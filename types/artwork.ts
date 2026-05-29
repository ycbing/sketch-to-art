export interface ArtworkItem {
  id: string;
  title: string | null;
  prompt: string | null;
  resultUrl: string | null;
  resultUrls: string | null;
  styleId: string | null;
  provider: string | null;
  styleStrength: number | null;
  size: string | null;
  isPublic: boolean;
  likes: number;
  createdAt: string;
}