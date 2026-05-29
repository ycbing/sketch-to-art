import { registerProvider } from "./index";

registerProvider({
  name: "OpenAI DALL-E",
  id: "dalle",
  isConfigured() {
    return !!(process.env.OPENAI_API_KEY);
  },
  async generate(opts) {
    const { prompt, stylePrompt, size = "1024x1024" } = opts;
    const fullPrompt = stylePrompt
      ? `${stylePrompt}. ${prompt}`
      : prompt;

    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
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