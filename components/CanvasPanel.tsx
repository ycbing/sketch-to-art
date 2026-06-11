"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useEffect } from "react";
import type { Editor } from "tldraw";

const Tldraw = dynamic(() => import("tldraw").then((mod) => mod.Tldraw), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-violet-950/30 dark:via-black/30 dark:to-indigo-950/30 gap-3">
      <div className="animate-spin h-10 w-10 border-[3px] border-violet-500 border-t-transparent rounded-full" />
      <span className="text-sm text-muted-foreground">画布加载中...</span>
    </div>
  ),
});

interface CanvasPanelProps {
  onSketchReady?: (base64: string | null) => void;
}

export function CanvasPanel({ onSketchReady }: CanvasPanelProps) {
  const editorRef = useRef<Editor | null>(null);
  const [shapeCount, setShapeCount] = useState(0);

  // Auto-export sketch when canvas content changes
  const exportSketch = useCallback(async (editor: Editor) => {
    try {
      const svgResult = await editor.getSvgString([]);
      if (!svgResult) return null;

      const svgString = typeof svgResult === "string" ? svgResult : svgResult.svg;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      canvas.width = 1024;
      canvas.height = 1024;

      const img = new Image();
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      return await new Promise<string | null>((resolve) => {
        img.onload = () => {
          try {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            resolve(canvas.toDataURL("image/png"));
          } catch {
            resolve(null);
          } finally {
            URL.revokeObjectURL(url);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });
    } catch {
      return null;
    }
  }, []);

  // Auto-export sketch when canvas content changes (debounced 500ms)
  const exportTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedExport = useCallback((editor: Editor) => {
    if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    exportTimeoutRef.current = setTimeout(async () => {
      if (shapeCount === 0) {
        onSketchReady?.(null);
        return;
      }
      const base64 = await exportSketch(editor);
      onSketchReady?.(base64);
    }, 500);
  }, [shapeCount, exportSketch, onSketchReady]);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;

      const updateCount = () => {
        const ids = editor.getCurrentPageShapeIds();
        setShapeCount(ids.size);
      };

      updateCount();

      const unsubscribe = editor.store.listen(() => {
        updateCount();
        debouncedExport(editor);
      });

      return () => unsubscribe();
    },
    [debouncedExport]
  );

  return (
    <div className="relative w-full h-full">
      <Tldraw onMount={handleMount} />
    </div>
  );
}
