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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type StylePreset } from "@/lib/styles";
import { Coins, Loader2, Image as ImageIcon } from "lucide-react";

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
    toast.success("草图已导出，可以开始生成了");
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row gap-0 h-[calc(100vh-3.5rem)]">
        {/* Left: Canvas (60%) */}
        <div className="lg:w-[60%] w-full h-[50vh] lg:h-full border-r bg-white">
          <CanvasPanel onExport={handleExport} />
        </div>

        {/* Right: Controls (40%) */}
        <div className="lg:w-[40%] w-full h-[50vh] lg:h-full overflow-y-auto">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Credits bar */}
            {credits !== null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm">
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{credits} 积分</span>
              </div>
            )}

            {/* Sketch status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  sketchBase64 ? "bg-green-500" : "bg-muted-foreground/30"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {sketchBase64
                  ? "✅ 草图已就绪（可重新绘制）"
                  : "在左侧画布上绘制草图，点击「导出草图」"}
              </span>
            </div>

            {/* Style selector */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                选择艺术风格
              </Label>
              <StyleSelector
                selectedId={selectedStyle?.id || null}
                onSelect={setSelectedStyle}
              />
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-semibold">
                描述（可选）
              </Label>
              <Input
                id="prompt"
                placeholder="描述你想要的内容，如：一只戴着墨镜的猫..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Style strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">风格强度</Label>
                <span className="text-sm text-muted-foreground">{styleStrength}%</span>
              </div>
              <Slider
                value={[styleStrength]}
                onValueChange={([v]) => setStyleStrength(v)}
                min={0}
                max={100}
                step={10}
              />
              <p className="text-xs text-muted-foreground">
                {styleStrength >= 70
                  ? "强烈风格化：AI 将更侧重于艺术风格"
                  : styleStrength >= 40
                  ? "平衡模式：兼顾内容和风格"
                  : "内容优先：更忠实于你的描述"}
              </p>
            </div>

            {/* Generate buttons */}
            <div className="space-y-2">
              <GenerateButton
                onClick={handleGenerate}
                loading={loading}
                disabled={!selectedStyle}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBatchGenerate}
                disabled={loading || !selectedStyle}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2" />
                )}
                批量生成 2 张 (-6积分)
              </Button>
            </div>

            {/* Results */}
            <ResultGallery images={results} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
