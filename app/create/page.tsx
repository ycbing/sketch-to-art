"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CanvasPanel } from "@/components/CanvasPanel";
import { StyleSelector } from "@/components/StyleSelector";
import { GenerateButton } from "@/components/GenerateButton";
import { ResultGallery } from "@/components/ResultGallery";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { type StylePreset } from "@/lib/styles";
import { Coins, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sketchBase64, setSketchBase64] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [prompt, setPrompt] = useState("");
  const [styleStrength, setStyleStrength] = useState(80);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/credits")
        .then((res) => res.json())
        .then((data) => setCredits(data.credits ?? 0))
        .catch(() => {});
    }
  }, [status]);

  const handleExport = useCallback((base64: string) => {
    setSketchBase64(base64);
    toast.success("草图已就绪，选择风格后点击生成");
  }, []);

  const handleGenerate = async () => {
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

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: sketchBase64 || undefined,
          styleId: selectedStyle.id,
          prompt: prompt || undefined,
          styleStrength,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "生成失败");
        return;
      }

      setResults([data.imageUrl]);
      setCredits((prev) => (prev ?? 0) - 3);
      toast.success("画作生成成功！");
    } catch {
      toast.error("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerate = async () => {
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

    try {
      const res = await fetch("/api/generate/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: sketchBase64 || undefined,
          styleId: selectedStyle.id,
          prompt: prompt || undefined,
          styleStrength,
          count: 2,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "生成失败");
        return;
      }

      setResults(data.imageUrls || []);
      setCredits((prev) => (prev ?? 0) - 6);
      toast.success("批量生成完成！");
    } catch {
      toast.error("批量生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        {/* Left: Canvas (60%) */}
        <div className="lg:w-[60%] w-full h-[50vh] lg:h-full border-r border-border/50 bg-white dark:bg-zinc-950">
          <CanvasPanel onExport={handleExport} hasSketch={!!sketchBase64} />
        </div>

        {/* Right: Controls (40%) */}
        <div className="lg:w-[40%] w-full h-[50vh] lg:h-full overflow-y-auto">
          <div className="p-5 lg:p-6 space-y-5">
            {/* Header with credits */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">创作面板</h2>
              {credits !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200/60 dark:border-amber-800/40">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{credits}</span>
                </div>
              )}
            </div>

            {/* Sketch status */}
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all ${sketchBase64 ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40' : 'bg-muted/50 border border-border/50'}`}>
              <div className={`w-2 h-2 rounded-full ${sketchBase64 ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {sketchBase64 ? "✅ 草图已就绪" : "在左侧画布绘制后点击「导出草图」"}
              </span>
            </div>

            {/* Style selector */}
            <div>
              <Label className="text-sm font-semibold mb-2.5 block">
                选择艺术风格
              </Label>
              <StyleSelector
                selectedId={selectedStyle?.id || null}
                onSelect={setSelectedStyle}
              />
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <Label htmlFor="prompt" className="text-sm font-semibold">
                描述（可选）
              </Label>
              <textarea
                id="prompt"
                rows={2}
                placeholder="如：一只戴着墨镜的猫坐在沙发上..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Style strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">风格强度</Label>
                <span className="text-xs font-bold text-primary">{styleStrength}%</span>
              </div>
              <Slider
                value={[styleStrength]}
                onValueChange={([v]) => setStyleStrength(v)}
                min={0}
                max={100}
                step={10}
                className="py-1"
              />
              <p className="text-[11px] text-muted-foreground">
                {styleStrength >= 70
                  ? "🎨 强风格化 — AI 更侧重艺术风格表现"
                  : styleStrength >= 40
                  ? "⚖️ 平衡模式 — 兼顾内容和风格"
                  : "📝 内容优先 — 更忠实于原始描述"}
              </p>
            </div>

            {/* Generate buttons */}
            <div className="space-y-2.5 pt-1">
              <GenerateButton
                onClick={handleGenerate}
                loading={loading}
                disabled={!selectedStyle}
              />
              <button
                onClick={handleBatchGenerate}
                disabled={loading || !selectedStyle}
                className="w-full h-10 text-sm font-medium rounded-xl border border-border/60 bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                批量生成 2 张 · 6积分
              </button>
            </div>

            {/* Results */}
            <ResultGallery images={results} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
