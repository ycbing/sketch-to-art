const GLM_BASE_URL = process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";
const GLM_API_KEY = process.env.GLM_API_KEY || "";
const IMAGE_MODEL = process.env.IMAGE_MODEL || "cogview-3-plus";

interface CogViewResponse {
  id: string;
  created: number;
  data: {
    url: string;
  }[];
}

/**
 * Text-to-image generation via CogView-3-Plus
 */
export async function generateFromText(
  prompt: string,
  size: string = "1024x1024"
): Promise<string> {
  const res = await fetch(`${GLM_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
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
}

/**
 * Image-to-image generation via CogView-3-Plus.
 * The CogView-3-Plus model may not natively support img2img;
 * we compose the prompt to describe the transformation.
 * For true img2img we'd use a different endpoint or encode the image reference.
 *
 * Strategy: use the sketch as visual context in the prompt description.
 */
export async function generateFromImage(
  sketchBase64: string,
  stylePrompt: string,
  userPrompt: string = "",
  size: string = "1024x1024"
): Promise<string> {
  const fullPrompt = userPrompt
    ? `Transform this sketch into a beautiful artwork: ${stylePrompt}. The sketch depicts: ${userPrompt}. Maintain the composition and layout of the original sketch but transform it into the target style.`
    : `Transform this sketch into a beautiful artwork: ${stylePrompt}. Maintain the composition and layout of the original sketch but render it in the target style.`;

  return generateFromText(fullPrompt, size);
}

/**
 * Generate a single image (auto-detect text-only vs sketch input)
 */
export async function generateImage(opts: {
  prompt: string;
  stylePrompt: string;
  sketchBase64?: string;
  size?: string;
}): Promise<string> {
  if (opts.sketchBase64) {
    return generateFromImage(opts.sketchBase64, opts.stylePrompt, opts.prompt, opts.size);
  }
  return generateFromText(`${opts.stylePrompt}. ${opts.prompt}`, opts.size);
}


