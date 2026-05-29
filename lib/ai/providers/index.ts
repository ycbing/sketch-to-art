export interface ImageGenerationResult {
  url: string;
  provider: string;
}

export interface ImageProviderConfig {
  size?: string;
  [key: string]: unknown;
}

export interface ImageProvider {
  readonly name: string;
  readonly id: string;
  isConfigured(): boolean;
  generate(opts: GenerateImageOpts): Promise<string>;
}

export type GenerateImageOpts = {
  prompt: string;
  stylePrompt: string;
  sketchBase64?: string;
  size?: string;
};

const registry: Map<string, ImageProvider> = new Map();

export function registerProvider(provider: ImageProvider): void {
  registry.set(provider.id, provider);
}

export function getProvider(id: string): ImageProvider | undefined {
  return registry.get(id);
}

export function getConfiguredProvider(): ImageProvider | undefined {
  for (const provider of registry.values()) {
    if (provider.isConfigured()) return provider;
  }
  return undefined;
}

export function getAllProviders(): ImageProvider[] {
  return Array.from(registry.values());
}

export async function generateImage(opts: GenerateImageOpts): Promise<string> {
  const providerId = process.env.IMAGE_PROVIDER || "";
  const provider = providerId
    ? getProvider(providerId)
    : getConfiguredProvider();

  if (!provider) {
    throw new Error(
      providerId
        ? `Image provider "${providerId}" is not configured`
        : "No image provider is configured"
    );
  }

  return provider.generate(opts);
}