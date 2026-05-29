"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type { Editor } from "tldraw";
import { Camera, Trash2, Check, Undo2, Redo2, AlertTriangle } from "lucide-react";

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
  onExport?: (base64: string) => void;
  hasSketch?: boolean;
}

export function CanvasPanel({ onExport, hasSketch }: CanvasPanelProps) {
  const editorRef = useRef<Editor | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [shapeCount, setShapeCount] = useState(0);

  const updateShapeCount = useCallback((editor: Editor) => {
    try {
      const ids = editor.getCurrentPageShapeIds();
      setShapeCount(ids.size);
    } catch {}
  }, []);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      updateShapeCount(editor);

      const unsubscribe = editor.store.listen(() => {
        updateShapeCount(editor);
      });

      return () => unsubscribe();
    },
    [updateShapeCount]
  );

  const handleUndo = useCallback(() => {
    editorRef.current?.undo();
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.redo();
  }, []);

  const handleExport = useCallback(async () => {
    if (!editorRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const svgString = await editorRef.current.getSvgString();
      if (!svgString) {
        setIsExporting(false);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      canvas.width = 1024;
      canvas.height = 1024;

      const img = new Image();
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
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

  const handleClear = useCallback(() => {
    if (!editorRef.current) return;
    try {
      const editor = editorRef.current;
      const allShapes = editor.getCurrentPageShapeIds();
      if (allShapes.size > 0) {
        editor.deleteShapes([...allShapes]);
      }
      updateShapeCount(editor);
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Clear failed:", err);
    }
  }, [updateShapeCount]);

  const handleRequestClear = useCallback(() => {
    if (shapeCount === 0) return;
    setShowClearConfirm(true);
  }, [shapeCount]);

  return (
    <div className="relative w-full h-full">
      <Tldraw onMount={handleMount} />

      {/* Floating action bar - bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001]">
        {/* Clear confirmation */}
        {showClearConfirm && (
          <div className="mb-3 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border border-red-200/60 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <span className="text-sm font-medium">确定要清空画布吗？</span>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              清空
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              取消
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg border border-border/50 glass-panel">
          {/* Undo */}
<button
            onClick={handleUndo}
            disabled={shapeCount === 0}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="撤销 (Ctrl+Z)"
            aria-label="撤销"
          >
            <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            onClick={handleRedo}
            disabled={shapeCount === 0}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="重做 (Ctrl+Shift+Z)"
            aria-label="重做"
          >
            <Redo2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          {/* Redo */}
          <button
            onClick={handleRedo}
            disabled={shapeCount === 0}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="重做 (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-6 bg-border/50" />

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm hover:shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="导出草图为图片"
          >
            {hasSketch ? (
              <><Check className="w-3.5 h-3.5" /> 已就绪</>
            ) : isExporting ? (
              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 导出中</>
            ) : (
              <><Camera className="w-3.5 h-3.5" /> 导出草图</>
            )}
          </button>

          <div className="w-px h-6 bg-border/50" />

          {/* Clear */}
          <button
            onClick={handleRequestClear}
            disabled={shapeCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="清空画布"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空
          </button>
        </div>

        {/* Shape count badge */}
        {shapeCount > 0 && !showClearConfirm && (
          <div className="flex justify-center mt-2">
            <span className="text-[10px] text-muted-foreground/60">
              {shapeCount} 个元素
            </span>
          </div>
        )}
      </div>
    </div>
  );
}