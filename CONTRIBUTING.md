# Contributing to SketchToArt

Thanks for your interest in contributing! 🎉

## Development Setup

```bash
git clone https://github.com/ycbing/sketch-to-art.git
cd sketch-to-art
cp .env.example .env.local
# Fill in your API keys
pnpm install
pnpm run db:push
pnpm run dev
```

## Project Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — React components (UI, Canvas, Styles, etc.)
- `lib/` — Core logic (AI providers, database, storage)
- `types/` — TypeScript type definitions

## Adding a New Art Style

1. Open `lib/styles.ts`
2. Add a new entry to `STYLE_PRESETS` array:
   ```typescript
   {
     id: "your-style-id",
     name: "风格名",
     nameEn: "Style Name",
     icon: "🎨",
     prompt: "Detailed style description for AI generation...",
     previewColor: "from-blue-200 to-purple-200",
   }
   ```
3. The style will automatically appear in the style selector

## Adding a New AI Provider

1. Create a new file in `lib/ai/providers/` (e.g., `midjourney.ts`)
2. Implement the provider interface:
   ```typescript
   export async function generateImage(params: GenerateParams): Promise<string> {
     // Call the AI API and return the image URL
   }
   ```
3. Register the provider in `lib/ai/providers/index.ts`
4. Set `IMAGE_PROVIDER` in `.env.local` to use the new provider

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Tailwind CSS for styling
- No `any` types

## Pull Request Process

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
