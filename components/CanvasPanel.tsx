"use client";

import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useCallback, useRef, useState } from "react";

interface CanvasPanelProps {
  onExport?: (base64: string) => void;
}

export function CanvasPanel({ onExport }: CanvasPanelProps) {
  const editorRef = useRef<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

  const handleExport = useCallback(async () => {
    if (!editorRef.current || isExporting) return;
    setIsExporting(true);

    try {
      // Get the current shapes as an SVG, then convert to PNG
      const svgString = await editorRef.current.getSvgString();
      if (!svgString) return;

      // Create a canvas to render the SVG to PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 1024;
      canvas.height = 1024;

      const img = new Image();
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        // White background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the SVG centered
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const base64 = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
        onExport?.(base64);
        setIsExporting(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };

      img.src = url;
    } catch (err) {
      console.error("Export failed:", err);
      setIsExporting(false);
    }
  }, [isExporting, onExport]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border bg-white">
      <div className="absolute top-3 right-3 z-[1000]">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isExporting ? "导出中..." : "📷 导出草图"}
        </button>
      </div>
      <Tldraw
        onMount={handleMount}
        options={{
          maxPages: 1,
        }}
      />
    </div>
  );
}
