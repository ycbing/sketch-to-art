"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ZoomIn } from "lucide-react";

interface ResultGalleryProps {
  images: string[];
  loading?: boolean;
}

export function ResultGallery({ images, loading }: ResultGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (!images.length && !loading) return null;

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sketch-to-art-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">生成结果</h3>

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-muted animate-pulse flex items-center justify-center"
            >
              <span className="text-muted-foreground text-sm">生成中...</span>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden border bg-muted"
            >
              <img
                src={url}
                alt={`Generated ${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewIndex(i)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(url)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewIndex !== null} onOpenChange={() => setPreviewIndex(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          {previewIndex !== null && images[previewIndex] && (
            <div className="relative">
              <img
                src={images[previewIndex]}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(images[previewIndex])}
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载图片
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
