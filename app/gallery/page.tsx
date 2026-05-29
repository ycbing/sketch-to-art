"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface GalleryArtwork {
  id: string;
  title: string | null;
  resultUrl: string | null;
  resultUrls: string | null;
  styleId: string | null;
  likes: number;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const [artworks, setArtworks] = useState<GalleryArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setArtworks(data.artworks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (id: string) => {
    setLikingId(id);
    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setArtworks((prev) =>
          prev.map((a) => (a.id === id ? { ...a, likes: data.likes } : a))
        );
        toast.success("已点赞");
      } else {
        const data = await res.json();
        toast.error(data.error || "操作失败");
      }
    } catch {
      toast.error("操作失败");
    } finally {
      setLikingId(null);
    }
  };

  const getImageUrl = (artwork: GalleryArtwork): string | null => {
    if (artwork.resultUrls) {
      try {
        const urls: string[] = JSON.parse(artwork.resultUrls);
        return urls[0] || artwork.resultUrl;
      } catch {}
    }
    return artwork.resultUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">社区画廊</h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-md mx-auto">
            浏览社区用户用 AI 创作的精美画作，发现灵感
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center mb-4">
              <ImageIcon className="h-7 w-7 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">暂无作品</h3>
            <p className="text-sm text-muted-foreground mb-6">
              成为第一个分享作品的人吧
            </p>
            <Link
              href="/create"
              className="btn-brand rounded-xl px-6 h-10 text-sm font-semibold flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              开始创作
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artworks.map((artwork) => {
              const imgUrl = getImageUrl(artwork);
              return (
                <div
                  key={artwork.id}
                  className="group rounded-xl overflow-hidden border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={artwork.title || "Artwork"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleLike(artwork.id)}
                        disabled={!session || likingId !== null}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 text-xs font-medium transition-all hover:scale-105"
                        aria-label="点赞"
                      >
                        <Heart className={`h-3.5 w-3.5 ${likingId === artwork.id ? "animate-pulse fill-red-500 text-red-500" : ""}`} />
                        {artwork.likes || 0}
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {artwork.title || "无题"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(artwork.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}