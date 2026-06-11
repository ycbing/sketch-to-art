"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Eye, Globe, GlobeLock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getStyleById } from "@/lib/styles";
import Image from "next/image";
import { type ArtworkItem } from "@/types/artwork";

interface ArtworkCardProps {
  artwork: ArtworkItem;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
}

export function ArtworkCard({ artwork, onDelete, onTogglePublic }: ArtworkCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const style = artwork.styleId ? getStyleById(artwork.styleId) : null;

  const toProxyUrl = (url: string) => {
    if (url.includes('.cos.')) {
      const match = url.match(/myqcloud\.com\/(.+)$/);
      if (match) return '/api/uploads/cos/' + match[1];
    }
    return url;
  };

  const urls = (artwork.resultUrls
    ? JSON.parse(artwork.resultUrls) as string[]
    : artwork.resultUrl
    ? [artwork.resultUrl]
    : []).map(toProxyUrl);

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${artwork.title || "artwork"}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Card className="group overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {urls[0] && (
            <Image
              src={urls[0]}
              alt={artwork.title || "Artwork"}
              width={512}
              height={512}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {style && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full glass-panel text-[10px] font-medium">
              {style.icon} {style.name}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
            <button
              onClick={() => setPreview(urls[0])}
              className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
            >
              <Eye className="h-4 w-4 text-gray-800" />
            </button>
            {urls[0] && (
              <button
                onClick={() => handleDownload(urls[0])}
                className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
              >
                <Download className="h-4 w-4 text-gray-800" />
              </button>
            )}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium truncate">
                {artwork.title || "无题"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(artwork.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {onTogglePublic && (
                <button
                  onClick={() => onTogglePublic(artwork.id, !artwork.isPublic)}
                  className={`p-1.5 rounded-lg transition-all shrink-0 ${
                    artwork.isPublic
                      ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={artwork.isPublic ? "公开" : "私密"}
                  aria-label={artwork.isPublic ? "设为私密" : "设为公开"}
                >
                  {artwork.isPublic ? <Globe className="h-3.5 w-3.5" /> : <GlobeLock className="h-3.5 w-3.5" />}
                </button>
              )}
              {onDelete && (
              <button
                onClick={() => onDelete(artwork.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none overflow-hidden">
          <DialogTitle className="sr-only">作品预览</DialogTitle>
          {preview && (
            <div className="relative">
              <Image src={preview} alt="Preview" width={1024} height={1024} className="w-full h-auto" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => handleDownload(preview)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  下载原图
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
