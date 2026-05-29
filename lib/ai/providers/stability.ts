import { registerProvider } from "./index";

const STABILITY_BASE_URL = process.env.STABILITY_BASE_URL || "https://api.stability.ai";

interface StabilityTextResponse {
  artifacts: { base64: string }[];
}

registerProvider({
  name: "Stability AI",
  id: "stability",
  isConfigured() {
    return !!(process.env.STABILITY_API_KEY);
  },
  async generate(opts) {
    const { prompt, stylePrompt, sketchBase64, size = "1024x1024" } = opts;
    const [width, height] = size.split("x").map(Number);

    if (sketchBase64) {
      // Real img2img: pass the sketch as init_image
      const base64Data = sketchBase64.replace(/^data:image\/\w+;base64,/, "");
      const fullPrompt = stylePrompt
        ? `${stylePrompt}. ${prompt || ""}`
        : prompt || "a beautiful artwork";

      const res = await fetch(`${STABILITY_BASE_URL}/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          text_prompts: [{ text: fullPrompt, weight: 1 }],
          init_image: base64Data,
          image_strength: 0.35,
          cfg_scale: 7,
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
          samples: 1,
          steps: 40,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Stability img2img error ${res.status}: ${body}`);
      }

      const data: StabilityTextResponse = await res.json();
      if (!data.artifacts?.length || !data.artifacts[0].base64) {
        throw new Error("Stability API returned no image data");
      }

      return `data:image/png;base64,${data.artifacts[0].base64}`;
    }

    // Text-to-image fallback
    const fullPrompt = stylePrompt
      ? `${stylePrompt}. ${prompt || ""}`
      : prompt;

    const res = await fetch(`${STABILITY_BASE_URL}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: fullPrompt, weight: 1 }],
        cfg_scale: 7,
        width: Math.min(width, 1024),
        height: Math.min(height, 1024),
        samples: 1,
        steps: 30,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Stability API error ${res.status}: ${body}`);
    }

    const data: StabilityTextResponse = await res.json();
    if (!data.artifacts?.length || !data.artifacts[0].base64) {
      throw new Error("Stability API returned no image data");
    }

    return `data:image/png;base64,${data.artifacts[0].base64}`;
  },
});