"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download, ZoomIn, Sparkles, ImageIcon, Share2, Copy, RotateCcw, Check } from "lucide-react";

interface ResultGalleryProps {
  images: string[];
  loading?: boolean;
  onRegenerate?: () => void;
}

export function ResultGallery({ images, loading, onRegenerate }: ResultGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (url: string) => {
    try {
      if (isDataUrl(url)) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `sketch-to-art-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const res = await fetch(url);
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `sketch-to-art-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      }
    } catch {
      if (!isDataUrl(url)) {
        window.open(url, "_blank");
      }
    }
  };

  const handleDownloadAll = async () => {
    for (const url of images) {
      try {
        await new Promise((r) => setTimeout(r, 300));
        await handleDownload(url);
      } catch {}
    }
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SketchToArt 作品",
          text: "看看我用 AI 生成的艺术作品！",
          url,
        });
      } catch {}
    } else {
      handleCopy(url);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const isDataUrl = (url: string) => url.startsWith("data:");

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

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-200 via-indigo-200 to-purple-200 dark:from-violet-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 animate-pulse" />
              <div className="absolute inset-0 animate-shimmer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-violet-400/50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {images.map((url, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      title="预览"
                    >
                      <ZoomIn className="h-4 w-4 text-gray-800" />
                    </button>
                    {!isDataUrl(url) && (
                      <button
                        onClick={() => handleShare(url)}
                        className="p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                        title="分享"
                      >
                        <Share2 className="h-4 w-4 text-gray-800" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(url)}
                      className="p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                      title="下载"
                    >
                      <Download className="h-4 w-4 text-gray-800" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-2 pt-1">
            {images.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="flex-1 h-9 text-xs font-medium rounded-xl border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                下载全部 ({images.length})
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex-1 h-9 text-xs font-medium rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                再次创作
              </button>
            )}
          </div>
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewIndex !== null} onOpenChange={() => setPreviewIndex(null)}>
        <DialogContent className="max-w-3xl p-0 bg-black/95 border-none overflow-hidden">
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          {previewIndex !== null && images[previewIndex] && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[previewIndex]}
                alt="Preview"
                className="w-full h-auto"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => handleCopy(images[previewIndex])}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "已复制" : "复制链接"}
                </button>
                {!isDataUrl(images[previewIndex]) && (
                  <button
                    onClick={() => handleShare(images[previewIndex])}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 font-medium text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Share2 className="h-4 w-4" />
                    分享
                  </button>
                )}
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