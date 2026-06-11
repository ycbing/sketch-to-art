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
              text: "Describe this sketch in detail in English. Include: (1) What objects/figures are drawn, their exact positions (center, left, right, top, bottom), sizes, and shapes. (2) The overall composition and layout. (3) Colors or shading used. (4) Any text, arrows, or labels. Be precise about spatial arrangement - this description will be used to recreate the SAME composition as a finished artwork. 150 words max.",
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
      ? `Based on this sketch description: "${sketchDescription}"\n\nIMPORTANT: Create an artwork that EXACTLY follows this composition. The position, size, and arrangement of elements must match the original sketch description exactly. Do NOT change the layout, do NOT add new major elements, and do NOT remove any elements.`
      : "";

    const fullPrompt = sketchBase64
      ? `${sketchContext}\n\nRender this composition in the following art style: ${stylePrompt}. ${prompt || ""}. Professional quality, detailed rendering.`.trim()
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