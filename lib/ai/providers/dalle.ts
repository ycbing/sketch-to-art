import { registerProvider } from "./index";

registerProvider({
  name: "OpenAI DALL-E",
  id: "dalle",
  isConfigured() {
    return !!(process.env.OPENAI_API_KEY);
  },
  async generate(opts) {
    const { prompt, stylePrompt, sketchBase64, size = "1024x1024" } = opts;
    const fullPrompt = stylePrompt
      ? `${stylePrompt}. ${prompt}`
      : prompt;

    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    // If a sketch is provided, use the image edit endpoint for better results
    if (sketchBase64) {
      try {
        const base64Data = sketchBase64.includes(",")
          ? sketchBase64.split(",")[1]
          : sketchBase64;
        const imageBuffer = Buffer.from(base64Data, "base64");

        const formData = new FormData();
        formData.append("model", "gpt-image-1");
        formData.append("image", new Blob([imageBuffer], { type: "image/png" }), "sketch.png");
        formData.append("prompt", fullPrompt);
        formData.append("n", "1");
        if (size === "1024x1024") {
          formData.append("size", "1024x1024");
        } else {
          formData.append("size", "1024x1792");
        }

        const res = await fetch(`${baseUrl}/images/edits`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`DALL-E edit API error ${res.status}: ${body}`);
        }

        const data = await res.json();
        if (!data.data?.length || !data.data[0].url) {
          throw new Error("DALL-E edit returned no image URL");
        }
        return data.data[0].url;
      } catch (editError) {
        console.warn("DALL-E image edit failed, falling back to text-only generation:", editError instanceof Error ? editError.message : editError);
      }
    }

    // Fallback: text-only generation
    const res = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DALLE_MODEL || "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: size === "1024x1024" ? "1024x1024" : "1024x1792",
        quality: "standard",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`DALL-E API error ${res.status}: ${body}`);
    }

    const data = await res.json();
    if (!data.data?.length || !data.data[0].url) {
      throw new Error("DALL-E returned no image URL");
    }

    return data.data[0].url;
  },
});