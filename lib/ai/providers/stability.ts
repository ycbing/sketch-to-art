import { registerProvider } from "./index";

registerProvider({
  name: "Stability AI",
  id: "stability",
  isConfigured() {
    return !!(process.env.STABILITY_API_KEY);
  },
  async generate(opts) {
    const { prompt, stylePrompt, size = "1024x1024" } = opts;
    const fullPrompt = stylePrompt
      ? `${stylePrompt}. ${prompt}`
      : prompt;

    const [width, height] = size.split("x").map(Number);
    const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
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

    const data = await res.json();
    if (!data.artifacts?.length || !data.artifacts[0].base64) {
      throw new Error("Stability API returned no image data");
    }

    return `data:image/png;base64,${data.artifacts[0].base64}`;
  },
});