"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download, ZoomIn, Sparkles, ImageIcon } from "lucide-react";

interface ResultGalleryProps {
  images: string[];
  loading?: boolean;
}

export function ResultGallery({ images, loading }: ResultGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

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
    } catch {
      window.open(url, "_blank");
    }
  };

  // Empty state
  if (!images.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center mb-3">
          <Sparkles className="h-6 w-6 text-violet-400" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">等待创作</p>
        <p className="text-xs text-muted-foreground/70">绘制草图并选择风格后，点击生成</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">生成结果</h3>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-200 via-indigo-200 to-purple-200 dark:from-violet-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 animate-pulse" />
              <div className="absolute inset-0 animate-shimmer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-violet-400/50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={url}
                alt={`Generated ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewIndex(i)}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                  >
                    <ZoomIn className="h-4 w-4 text-gray-800" />
                  </button>
                  <button
                    onClick={() => handleDownload(url)}
                    className="p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                  >
                    <Download className="h-4 w-4 text-gray-800" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewIndex !== null} onOpenChange={() => setPreviewIndex(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none overflow-hidden">
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          {previewIndex !== null && images[previewIndex] && (
            <div className="relative">
              <img
                src={images[previewIndex]}
                alt="Preview"
                className="w-full h-auto"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => handleDownload(images[previewIndex])}
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
    </div>
  );
}
