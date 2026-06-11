"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CanvasPanel } from "@/components/CanvasPanel";
import { StyleSelector } from "@/components/StyleSelector";
import { ResultGallery } from "@/components/ResultGallery";
import { GenerateButton } from "@/components/GenerateButton";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Coins, Loader2, Sparkles, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { type StylePreset } from "@/lib/styles";

const styles = import("@/lib/styles").then((m) => m.STYLE_PRESETS);

export default function CreatePageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sketchBase64, setSketchBase64] = useState<string | null>(null);
  const [hasEverDrawn, setHasEverDrawn] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Load credits
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/credits")
        .then((res) => res.json())
        .then((data) => setCredits(data.credits ?? 0));
    }
  }, [status]);

  // Stop polling on unmount
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  // Auto-detect sketch readiness
  const handleSketchReady = useCallback((base64: string | null) => {
    setSketchBase64(base64);
    if (base64 && !hasEverDrawn) {
      setHasEverDrawn(true);
    }
  }, [hasEverDrawn]);

  const pollTask = useCallback(
    (taskId: string, costCredits: number) => {
      const poll = async () => {
        try {
          const res = await fetch(`/api/tasks/${taskId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "查询任务失败");

          if (data.status === "completed") {
            setResults(data.resultUrls || []);
            setCredits((prev) => (prev ?? 0) - costCredits);
            setLoading(false);
            setTaskStatus(null);
            setTaskProgress(0);
            toast.success("画作生成成功！作品已自动保存。");
            stopPolling();
            return;
          }

          if (data.status === "failed") {
            setLoading(false);
            setTaskStatus(null);
            setTaskProgress(0);
            setTaskError(data.error || "生成失败，请重试");
            stopPolling();
            return;
          }

          setTaskProgress(data.progress ?? 0);
          setTaskStatus(data.status === "processing" ? "AI 正在创作中..." : "排队中...");
          pollRef.current = setTimeout(poll, 2000);
        } catch {
          setLoading(false);
          setTaskStatus(null);
          setTaskProgress(0);
          setTaskError("网络错误，请检查连接");
        }
      };
      poll();
    },
    [stopPolling]
  );

  const handleGenerate = async () => {
    stopPolling();
    if (!selectedStyle) {
      toast.error("请先选择一个艺术风格");
      return;
    }
    if (!credits || credits < 3) {
      toast.error("积分不足，请先领取每日签到奖励");
      return;
    }

    setLoading(true);
    setResults([]);
    setTaskError(null);
    setTaskStatus("提交任务中...");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: sketchBase64 || undefined,
          styleId: selectedStyle.id,
          prompt: "",
          styleStrength: 80,
          count: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "生成失败");
        setLoading(false);
        setTaskStatus(null);
        return;
      }

      pollTask(data.taskId, 3);
    } catch {
      toast.error("提交任务失败，请重试");
      setLoading(false);
      setTaskStatus(null);
      setTaskProgress(0);
    }
  };

  const handleBatchGenerate = async () => {
    stopPolling();
    if (!selectedStyle) {
      toast.error("请先选择一个艺术风格");
      return;
    }
    if (!credits || credits < 6) {
      toast.error("积分不足（批量生成需要6积分）");
      return;
    }

    setLoading(true);
    setResults([]);
    setTaskError(null);
    setTaskStatus("提交任务中...");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: sketchBase64 || undefined,
          styleId: selectedStyle.id,
          prompt: "",
          styleStrength: 80,
          count: 2,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "生成失败");
        setLoading(false);
        setTaskStatus(null);
        return;
      }

      pollTask(data.taskId, 6);
    } catch {
      toast.error("提交任务失败，请重试");
      setLoading(false);
      setTaskStatus(null);
      setTaskProgress(0);
    }
  };

  const handleRegenerate = async () => {
    stopPolling();
    if (!selectedStyle) return;
    setLoading(true);
    setResults([]);
    setTaskError(null);
    setTaskStatus("提交任务中...");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: sketchBase64 || undefined,
          styleId: selectedStyle.id,
          prompt: "",
          styleStrength: 80,
          count: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "生成失败");
        setLoading(false);
        setTaskStatus(null);
        return;
      }

      pollTask(data.taskId, 3);
    } catch {
      toast.error("提交任务失败，请重试");
      setLoading(false);
      setTaskStatus(null);
      setTaskProgress(0);
    }
  };

  // Loading skeleton
  if (status === "loading" || !styles) {
    return (
      <div className="h-[100dvh] flex flex-col bg-background">
        <div className="shrink-0 h-14 border-b border-border/50 bg-background/80" />
        <main className="flex-1 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  const isGenerating = loading || !!taskStatus;

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Canvas */}
        <div className="lg:w-[60%] w-full lg:h-full h-[50vh] border-r border-border/50 bg-white dark:bg-zinc-950 relative">
          <CanvasPanel onSketchReady={handleSketchReady} />

          {/* Empty state overlay */}
          {!sketchBase64 && !hasEverDrawn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                <Sparkles className="h-8 w-8" />
                <p className="text-sm font-medium">在画布上画点什么吧</p>
                <p className="text-xs">支持画笔、形状、文字等工具</p>
              </div>
            </div>
          )}

          {/* Sketch ready badge */}
          {sketchBase64 && !isGenerating && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/90 dark:bg-emerald-600/90 text-white text-sm font-medium shadow-lg backdrop-blur-sm animate-in fade-in">
                <Sparkles className="h-4 w-4" />
                草图已就绪，选择风格后开始创作
              </div>
            </div>
          )}

          {/* Generating overlay */}
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <span className="text-sm font-medium text-foreground">{taskStatus || "AI 正在创作中..."}</span>
                {taskProgress > 0 && taskProgress < 100 && (
                  <div className="w-48 h-1.5 rounded-full bg-violet-100 dark:bg-violet-900 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out" style={{ width: `${taskProgress}%` }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="lg:w-[40%] w-full lg:h-full h-[50vh] overflow-y-auto">
          <div className="p-5 lg:p-6 space-y-5">
            {/* Sketch status */}
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${sketchBase64 ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40' : 'bg-muted/50 border border-border/50'}`}>
              <div className={`w-2 h-2 rounded-full transition-colors ${sketchBase64 ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {sketchBase64 ? "✓ 草图已就绪" : "在左侧画布上绘制"}
              </span>
            </div>

            {/* Style selector */}
            <div>
              <h3 className="text-sm font-semibold mb-2.5">选择艺术风格</h3>
              <StyleSelector
                selectedId={selectedStyle?.id || null}
                onSelect={setSelectedStyle}
              />
            </div>

            {/* Generate button */}
            <GenerateButton
              onClick={handleGenerate}
              loading={loading}
              disabled={!sketchBase64 || !selectedStyle}
            />

            {/* Results */}
            {results.length > 0 && (
              <ResultGallery images={results} loading={loading} onRegenerate={handleRegenerate} />
            )}

            {/* Advanced options (collapsed) */}
            <details className="group">
              <summary className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1">
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                高级选项
              </summary>
              <div className="space-y-3 pt-2">
                {/* Batch generate */}
                <button
                  onClick={handleBatchGenerate}
                  disabled={loading || !sketchBase64 || !selectedStyle}
                  className="w-full h-10 text-sm font-medium rounded-xl border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  批量生成 2 张
                </button>

                {/* Custom prompt */}
                <textarea
                  rows={2}
                  placeholder="添加描述，如：一只戴着墨镜的猫坐在沙发上..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </div>
            </details>

            {/* Error state */}
            {taskError && !loading && (
              <div className="space-y-2 px-3 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40">
                <p className="text-xs text-red-600 dark:text-red-400">{taskError}</p>
                <button
                  onClick={() => {
                    setTaskError(null);
                    handleGenerate();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <Loader2 className="h-3 w-3" />
                  重试
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
