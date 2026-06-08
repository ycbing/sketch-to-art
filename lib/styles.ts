export interface StylePreset {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  prompt: string;
  previewColor: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "watercolor",
    name: "水彩风",
    nameEn: "Watercolor",
    icon: "🎨",
    prompt: "watercolor painting style, soft and transparent color washes, visible brush strokes, delicate blending, wet-on-wet technique, light and airy feel, paper texture visible",
    previewColor: "from-blue-200 to-pink-200",
  },
  {
    id: "oil-painting",
    name: "油画风",
    nameEn: "Oil Painting",
    icon: "🖼️",
    prompt: "oil painting style, rich and vivid colors, visible impasto texture, classical lighting, dramatic chiaroscuro, gallery-quality masterpiece",
    previewColor: "from-amber-200 to-orange-300",
  },
  {
    id: "flat-illustration",
    name: "扁平插画",
    nameEn: "Flat Illustration",
    icon: "✏️",
    prompt: "flat illustration style, clean vector-like shapes, bold solid colors, minimal shading, modern graphic design aesthetic, geometric forms",
    previewColor: "from-emerald-200 to-teal-300",
  },
  {
    id: "3d-render",
    name: "3D渲染",
    nameEn: "3D Render",
    icon: "🔮",
    prompt: "3D render style, photorealistic CGI, volumetric lighting, subsurface scattering, physically-based rendering, glossy and reflective surfaces, studio-quality",
    previewColor: "from-violet-200 to-purple-300",
  },
  {
    id: "anime",
    name: "二次元",
    nameEn: "Anime",
    icon: "🌸",
    prompt: "anime art style, Japanese animation aesthetic, vibrant cel-shading, large expressive eyes, clean line art, dynamic poses, Studio Ghibli or Makoto Shinkai inspired",
    previewColor: "from-pink-200 to-rose-300",
  },
  {
    id: "chinese-ink",
    name: "国风水墨",
    nameEn: "Chinese Ink",
    icon: "🎋",
    prompt: "traditional Chinese ink painting style, ink wash, xuan paper texture, elegant brush calligraphy strokes, monochrome with subtle color accents, zen aesthetic, 山水画 inspired",
    previewColor: "from-gray-200 to-slate-300",
  },
  {
    id: "pixel-art",
    name: "像素风",
    nameEn: "Pixel Art",
    icon: "👾",
    prompt: "pixel art style, retro 16-bit game aesthetic, limited color palette, crisp pixel edges, nostalgic video game vibe, detailed sprite work",
    previewColor: "from-cyan-200 to-sky-300",
  },
  {
    id: "cyberpunk",
    name: "赛博朋克",
    nameEn: "Cyberpunk",
    icon: "🌃",
    prompt: "cyberpunk style, neon-soaked futuristic cityscape, dark atmospheric mood, electric blue and magenta neon lights, holographic elements, high-tech low-life aesthetic",
    previewColor: "from-fuchsia-500 to-indigo-600",
  },
  {
    id: "sketch",
    name: "素描",
    nameEn: "Sketch",
    icon: "✍️",
    prompt: "professional pencil sketch, detailed hatching and cross-hatching, graphite on paper texture, realistic shading, fine line work, classical drawing technique",
    previewColor: "from-gray-300 to-stone-400",
  },
  {
    id: "low-poly",
    name: "低多边形",
    nameEn: "Low Poly",
    icon: "💎",
    prompt: "low poly 3D art style, geometric faceted surfaces, clean polygon edges, modern minimalist 3D aesthetic, colorful gradient lighting on flat polygon faces",
    previewColor: "from-teal-200 to-emerald-300",
  },
  {
    id: "vintage-poster",
    name: "复古海报",
    nameEn: "Vintage Poster",
    icon: "🎪",
    prompt: "vintage poster style, retro mid-century graphic design, aged paper texture, distressed halftone printing, bold typography layout, warm muted color palette, 1960s advertising aesthetic",
    previewColor: "from-yellow-200 to-amber-300",
  },
  {
    id: "minimalism",
    name: "极简主义",
    nameEn: "Minimalism",
    icon: "⬜",
    prompt: "minimalist style, clean lines, ample negative space, simple geometric forms, monochromatic or limited palette, Scandinavian design aesthetic, elegant simplicity",
    previewColor: "from-slate-100 to-zinc-200",
  },
];

export function getStyleById(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((s) => s.id === id);
}

export function buildStylePrompt(
  styleId: string,
  userPrompt: string,
  strength: number = 80
): string {
  const style = getStyleById(styleId);
  if (!style) return userPrompt;

  const styleWeight = Math.round(strength);
  const promptWeight = 100 - styleWeight;

  // More style = emphasize style prompt; less style = emphasize user prompt
  if (styleWeight >= 60) {
    return `${style.prompt}. ${userPrompt}. Style weight: ${styleWeight}%.`;
  } else {
    const truncated = style.prompt.length > 60
      ? style.prompt.substring(0, 60).replace(/\s+\S*$/, "")
      : style.prompt;
    return `${userPrompt}. With ${truncated}... Style weight: ${styleWeight}%.`;
  }
}
