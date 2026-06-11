<p align="center">
  <img src="public/file.svg" alt="SketchToArt Logo" width="80" height="80" />
</p>

<h1 align="center">SketchToArt</h1>

<p align="center">
  <strong>Transform your sketches into stunning art with AI.</strong><br/>
  Draw on the canvas, choose an art style, and watch AI bring your vision to life.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/tldraw-v4-blue?logo=tldraw&logoColor=white" alt="tldraw" />
  <img src="https://img.shields.io/badge/CogView-3-Plus-orange?logo=zhipuai&logoColor=white" alt="CogView" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <a href="https://github.com/ycbing/sketch-to-art/stargazers"><img src="https://img.shields.io/github/stars/ycbing/sketch-to-art?style=social" alt="GitHub stars" /></a>
</p>

---

## ✨ What is SketchToArt?

SketchToArt is an AI-powered tool that transforms your hand-drawn sketches into beautiful artwork. Draw anything on the interactive canvas, pick from 12 curated art styles, and let AI generate stunning results in seconds.

## 🎨 12 Art Styles

| Style | Preview | Description |
|-------|---------|-------------|
| 🎨 Watercolor | `from-blue-200 to-pink-200` | Soft, transparent color washes with visible brush strokes |
| 🖼️ Oil Painting | `from-amber-200 to-orange-300` | Rich, vivid colors with classical chiaroscuro lighting |
| 🌸 Anime | `from-pink-200 to-rose-300` | Japanese animation with vibrant cel-shading |
| 🎋 Chinese Ink | `from-gray-200 to-slate-300` | Traditional ink wash painting with zen aesthetic |
| 🌃 Cyberpunk | `from-fuchsia-500 to-indigo-600` | Neon-soaked futuristic cityscapes |
| 👾 Pixel Art | `from-cyan-200 to-sky-300` | Retro 16-bit game aesthetic with crisp pixels |
| ✏️ Flat Illustration | `from-emerald-200 to-teal-300` | Clean vector shapes with bold solid colors |
| 🔮 3D Render | `from-violet-200 to-purple-300` | Photorealistic CGI with volumetric lighting |
| ✍️ Sketch | `from-gray-300 to-stone-400` | Professional pencil drawing with detailed hatching |
| 💎 Low Poly | `from-teal-200 to-emerald-300` | Geometric faceted surfaces with colorful gradients |
| 🎪 Vintage Poster | `from-yellow-200 to-amber-300` | Retro mid-century graphic design with aged texture |
| ⬜ Minimalism | `from-slate-100 to-zinc-200` | Clean lines and ample negative space |

## 🚀 Quick Start

### Deploy with Docker (Recommended)

```bash
git clone https://github.com/ycbing/sketch-to-art.git
cd sketch-to-art

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your API keys

# Start with Docker Compose (includes PostgreSQL)
docker compose up -d
```

Open [http://localhost:3006](http://localhost:3006)

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/ycbing/sketch-to-art&project-name=sketch-to-art&env=GLM_API_KEY,IMAGE_MODEL,IMAGE_PROVIDER)](https://vercel.com/new/clone?repository-url=https://github.com/ycbing/sketch-to-art&project-name=sketch-to-art&env=GLM_API_KEY,IMAGE_MODEL,IMAGE_PROVIDER)

### Local Development

```bash
git clone https://github.com/ycbing/sketch-to-art.git
cd sketch-to-art

cp .env.example .env.local
pnpm install
pnpm run db:push
pnpm run dev
```

Open [http://localhost:3006](http://localhost:3006)

## 🛠️ Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router, RSC)
- **Language** — [TypeScript](https://www.typescriptlang.org/)
- **Canvas** — [tldraw v4](https://tldraw.dev/) (professional drawing tools)
- **Database** — [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth** — [NextAuth v5](https://authjs.dev/) (Credentials Provider)
- **Storage** — [Tencent Cloud COS](https://cloud.tencent.com/product/cos) (optional)
- **AI** — [ZhipuAI CogView](https://open.bigmodel.cn/) (image generation)
- **UI** — [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)

## 📁 Project Structure

```
sketch-to-art/
├── app/
│   ├── (marketing)/           # Landing page components
│   │   ├── components/       # Hero, Showcase, Features, etc.
│   │   └── page.tsx          # Marketing landing page
│   ├── api/
│   │   ├── auth/             # Login / Register
│   │   ├── artworks/         # Artwork CRUD
│   │   ├── credits/          # Credits system
│   │   ├── generate/         # AI generation (single / batch)
│   │   ├── gallery/          # Public gallery
│   │   ├── styles/           # Style list
│   │   └── tasks/            # Async task management
│   ├── create/               # Create page (canvas + generate)
│   ├── dashboard/            # User's artworks
│   ├── demo/                 # Quick demo with preset sketches
│   ├── gallery/              # Public gallery
│   ├── signin/               # Login
│   ├── signup/               # Register
│   └── layout.tsx            # Root layout
├── components/                # Shared React components
│   ├── ui/                   # shadcn/ui components
│   ├── CanvasPanel.tsx       # tldraw drawing canvas
│   ├── StyleSelector.tsx      # Art style picker
│   └── ...
├── lib/
│   ├── ai/                   # AI image generation
│   │   ├── providers/        # CogView / DALL-E / Stability AI
│   │   └── task-manager.ts   # Async task queue
│   ├── db/                   # Drizzle schema
│   ├── styles.ts             # 12 art style presets
│   └── cos.ts                # Tencent COS uploader
├── public/examples/           # Demo sketch assets
│   ├── sketches/              # SVG sketch files
│   └── examples.json         # Example metadata
└── types/                    # TypeScript type definitions
```

## ⚙️ Configuration

### Required

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `NEXTAUTH_SECRET` | Auth secret key | — |
| `GLM_API_KEY` | ZhipuAI API key for CogView | — |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `IMAGE_PROVIDER` | `cogview` / `dalle` / `stability` | `cogview` |
| `IMAGE_MODEL` | Model name for generation | `cogview-3-plus` |
| `COS_SECRET_ID` | Tencent COS credentials | — |
| `COS_SECRET_KEY` | Tencent COS credentials | — |
| `COS_BUCKET` | Tencent COS bucket name | — |
| `COS_REGION` | Tencent COS region | — |

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
