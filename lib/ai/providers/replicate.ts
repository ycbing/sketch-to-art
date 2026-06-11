import { registerProvider } from "./index";

registerProvider({
  name: "Replicate FLUX",
  id: "replicate-flux",
  isConfigured() {
    return !!process.env.REPLICATE_API_TOKEN;
  },
  async generate(opts) {
    const { prompt, stylePrompt, sketchBase64, size = "1024x1024" } = opts;

    // Build full prompt
    const fullPrompt = stylePrompt
      ? `${stylePrompt}. ${prompt || ""}. Professional quality, highly detailed.`
      : prompt || "a beautiful artwork";

    // If sketch provided, upload to COS and get a signed URL
    let imageUrl: string | undefined;
    if (sketchBase64) {
      try {
        const { uploadBase64ToCos, getSignedCosUrl } = await import("@/lib/cos");
        const { v4: uuid } = await import("uuid");
        const key = `sketch-to-art/sketches/${uuid()}.png`;
        // Upload first
        await uploadBase64ToCos(sketchBase64, key);
        // Get signed URL (valid for 1 hour, enough for Replicate to process)
        imageUrl = getSignedCosUrl(key, 3600);
      } catch (e) {
        console.error("Sketch upload failed, falling back to text-to-image:", e);
      }
    }

    // Map size to valid aspect ratios for FLUX
    const sizeMap: Record<string, string> = {
      "1024x1024": "1:1",
      "768x1344": "3:4",
      "1344x768": "4:3",
      "864x1152": "3:4",
      "1152x864": "4:3",
      "1440x720": "2:1",
      "720x1440": "1:2",
    };
    const aspectRatio = sizeMap[size] || "1:1";

    // Create prediction with FLUX.1.1-pro
    const response = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "sketch-to-art/1.0",
        },
        body: JSON.stringify({
          input: {
            prompt: fullPrompt,
            ...(imageUrl ? { image: imageUrl } : {}),
            prompt_strength: imageUrl ? 0.25 : undefined,
            aspect_ratio: aspectRatio,
            output_format: "png",
            output_quality: 95,
            num_outputs: 1,
            num_inference_steps: 25,
          },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Replicate create prediction error ${response.status}: ${body}`);
    }

    let prediction = await response.json();
    const predictionId = prediction.id;

    if (!predictionId) {
      throw new Error("Replicate returned no prediction ID");
    }

    // Poll until complete (up to 120s)
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      if (prediction.status === "succeeded") {
        const output = prediction.output;
        const imageUrlResult = Array.isArray(output) ? output[0] : output;
        if (!imageUrlResult) {
          throw new Error("Replicate returned no output image");
        }
        return imageUrlResult;
      }

      if (prediction.status === "failed") {
        throw new Error(
          `Replicate prediction failed: ${prediction.error || "unknown error"}`
        );
      }

      if (prediction.status === "canceled") {
        throw new Error("Replicate prediction was canceled");
      }

      // Wait 1 second before polling again
      await new Promise((r) => setTimeout(r, 1000));

      const statusRes = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            "User-Agent": "sketch-to-art/1.0",
          },
        }
      );

      if (!statusRes.ok) {
        const body = await statusRes.text();
        throw new Error(`Replicate poll error ${statusRes.status}: ${body}`);
      }

      prediction = await statusRes.json();
    }

    throw new Error("Replicate prediction timed out after 120 seconds");
  },
});
