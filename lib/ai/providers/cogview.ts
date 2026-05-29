import { registerProvider } from "./index";

const GLM_BASE_URL = process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";

interface CogViewResponse {
  id: string;
  created: number;
  data: { url: string }[];
}

/**
 * Use GLM-4V vision model to describe the sketch,
 * enabling real img2img by passing the description into the generation prompt.
 */
async function describeSketch(sketchBase64: string): Promise<string> {
  const res = await fetch(`${GLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4v",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: sketchBase64 },
            },
            {
              type: "text",
              text: "请详细描述这幅草图中画了什么内容，包括主体、构图、位置、大致形状和颜色。用中文描述，200字以内。",
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GLM-4V vision error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

registerProvider({
  name: "智谱 CogView",
  id: "cogview",
  isConfigured() {
    return !!process.env.GLM_API_KEY;
  },
  async generate(opts) {
    const { prompt, stylePrompt, sketchBase64, size = "1024x1024" } = opts;

    let sketchDescription = "";
    if (sketchBase64) {
      try {
        sketchDescription = await describeSketch(sketchBase64);
      } catch (e) {
        console.error("Sketch description failed, falling back to text-only:", e);
      }
    }

    const sketchContext = sketchDescription
      ? `The sketch contains: ${sketchDescription}. Create a finished artwork based on this sketch. `
      : "";

    const fullPrompt = sketchBase64
      ? `${sketchContext}Art style: ${stylePrompt}. ${prompt || ""}. Maintain the composition and layout of the original sketch but render it fully in the target style with professional quality.`
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