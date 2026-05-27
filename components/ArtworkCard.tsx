"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string | null;
    prompt: string | null;
    resultUrl: string | null;
    resultUrls: string | null;
    styleId: string | null;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
}

export function ArtworkCard({ artwork, onDelete }: ArtworkCardProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const urls = artwork.resultUrls
    ? JSON.parse(artwork.resultUrls) as string[]
    : artwork.resultUrl
    ? [artwork.resultUrl]
    : [];

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
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {urls[0] && (
            <img
              src={urls[0]}
              alt={artwork.title || "Artwork"}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
            <button
              onClick={() => setPreview(urls[0])}
              className="p-2 rounded-full bg-white/90 hover:bg-white transition"
            >
              <Eye className="h-4 w-4" />
            </button>
            {urls[0] && (
              <button
                onClick={() => handleDownload(urls[0])}
                className="p-2 rounded-full bg-white/90 hover:bg-white transition"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium truncate">
                {artwork.title || "无题"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(artwork.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(artwork.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">作品预览</DialogTitle>
          {preview && <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />}
        </DialogContent>
      </Dialog>
    </>
  );
}
