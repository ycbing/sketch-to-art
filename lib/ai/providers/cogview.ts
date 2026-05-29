import { registerProvider } from "./index";

const GLM_BASE_URL = process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";

interface CogViewResponse {
  id: string;
  created: number;
  data: { url: string }[];
}

registerProvider({
  name: "智谱 CogView",
  id: "cogview",
  isConfigured() {
    return !!process.env.GLM_API_KEY;
  },
  async generate(opts) {
    const { prompt, stylePrompt, sketchBase64, size = "1024x1024" } = opts;
    const fullPrompt = sketchBase64
      ? stylePrompt
        ? `Transform this sketch into a beautiful artwork: ${stylePrompt}. ${prompt || ""}. Maintain the composition and layout of the original sketch but transform it into the target style.`
        : `Transform this sketch into a beautiful artwork. ${prompt || ""}. Maintain the composition and layout.`
      : `${stylePrompt}. ${prompt}`;

    const res = await fetch(`${GLM_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.IMAGE_MODEL || "cogview-3-plus",
        prompt: fullPrompt,
        size,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`CogView API error ${res.status}: ${body}`);
    }

    const data: CogViewResponse = await res.json();
    if (!data.data?.length || !data.data[0].url) {
      throw new Error("CogView returned no image URL");
    }

    return data.data[0].url;
  },
});