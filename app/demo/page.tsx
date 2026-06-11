"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Download,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

interface Example {
  id: string;
  name: string;
  sketch: string;
  style: string;
  styleName: string;
  description: string;
}

export default function DemoPage() {
  const router = useRouter();
  const [examples, setExamples] = useState<Example[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/examples/examples.json")
      .then((res) => res.json())
      .then(setExamples)
      .catch(() => {});
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  const selected = examples.find((e) => e.id === selectedId);

  const handleGenerate = useCallback(async () => {
    if (!selected) return;

    setGenerating(true);
    setResultImage(null);
    setError(null);
    setTaskStatus("Preparing sketch...");
    setTaskProgress(0);

    try {
      // Fetch SVG text → convert to base64 PNG
      const svgRes = await fetch(selected.sketch);
      const svgText = await svgRes.text();

      // Convert SVG to PNG via canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load SVG"));
        };
        img.src = url;
      });

      const base64 = canvas.toDataURL("image/png");
      setTaskStatus("Submitting to AI...");

      // Submit task
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketchBase64: base64,
          styleId: selected.style,
          prompt: "",
          styleStrength: 80,
          count: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed. Please sign in first.");
        setGenerating(false);
        setTaskStatus(null);
        return;
      }

      setTaskStatus("AI is creating...");
      setTaskProgress(10);

      // Poll task
      const poll = async () => {
        try {
          const taskRes = await fetch(`/api/tasks/${data.taskId}`);
          const taskData = await taskRes.json();

          setTaskProgress(taskData.progress ?? Math.min(taskProgress + 10, 90));

          if (taskData.status === "completed") {
            setResultImage(taskData.resultUrls?.[0] || null);
            setGenerating(false);
            setTaskStatus(null);
            setTaskProgress(100);
            return;
          }

          if (taskData.status === "failed") {
            setError(taskData.error || "Generation failed");
            setGenerating(false);
            setTaskStatus(null);
            return;
          }

          setTaskStatus(taskData.status === "processing" ? "AI is creating..." : "Queued...");
          pollRef.current = setTimeout(poll, 2000);
        } catch {
          setError("Failed to check status");
          setGenerating(false);
          setTaskStatus(null);
        }
      };

      pollRef.current = setTimeout(poll, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setGenerating(false);
      setTaskStatus(null);
    }
  }, [selected, taskProgress]);

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `sketch-to-art-${selected?.id || "demo"}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </button>
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Demo Gallery
            </span>
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Try Before You Draw
            </span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Pick an example sketch, hit generate, and see the AI magic. No drawing required.
            {generating || resultImage ? " Sign in required for generation." : ""}
          </p>
        </div>

        {/* Example Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setSelectedId(ex.id);
                setResultImage(null);
                setError(null);
              }}
              className={`group relative rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.03] ${
                selectedId === ex.id
                  ? "bg-white/[0.08] border-2 border-violet-500/50 shadow-lg shadow-violet-500/10"
                  : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {/* SVG Preview */}
              <div className="aspect-square rounded-xl bg-white/[0.05] mb-3 overflow-hidden flex items-center justify-center p-2">
                <Image
                  src={ex.sketch}
                  alt={ex.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="inline-flex px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50 mb-2">
                {ex.styleName}
              </div>
              <h3 className="text-sm font-semibold">{ex.name}</h3>
              <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                {ex.description}
              </p>
            </button>
          ))}
        </div>

        {/* Generate Section */}
        {selected && (
          <div className="max-w-2xl mx-auto">
            {/* Selected card info */}
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">
                    {selected.name}{" "}
                    <span className="text-sm font-normal text-white/40">
                      → {selected.styleName}
                    </span>
                  </h3>
                  <p className="text-sm text-white/40 mt-1">{selected.description}</p>
                </div>
                <div className="text-3xl">{getStyleEmoji(selected.style)}</div>
              </div>

              {/* SVG Preview */}
              <div className="rounded-xl bg-white/[0.05] p-4 mb-6 flex items-center justify-center">
                <Image
                  src={selected.sketch}
                  alt={`${selected.name} sketch`}
                  width={300}
                  height={300}
                  className="max-w-[300px] max-h-[300px] object-contain"
                  unoptimized
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {taskStatus || "Processing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </>
                )}
              </button>

              {/* Progress */}
              {generating && taskProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
                      style={{ width: `${taskProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                  {error.includes("sign in") && (
                    <button
                      onClick={() => router.push("/signin")}
                      className="mt-2 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                    >
                      Sign in <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Result */}
              {resultImage && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-xl overflow-hidden border border-white/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultImage}
                      alt="Generated artwork"
                      className="w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm font-medium hover:bg-white/[0.1] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm font-medium hover:bg-white/[0.1] transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="flex items-center justify-center gap-4 text-sm text-white/30">
              <button
                onClick={() => router.push(`/create?demo=${selected.id}`)}
                className="hover:text-violet-400 transition-colors flex items-center gap-1"
              >
                Open in Creator <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selected && (
          <div className="text-center py-16">
            <p className="text-white/30 text-lg">↑ Select an example above to try</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getStyleEmoji(styleId: string): string {
  const map: Record<string, string> = {
    watercolor: "🎨",
    "oil-painting": "🖼️",
    "flat-illustration": "✏️",
    "3d-render": "🔮",
    anime: "🌸",
    "chinese-ink": "🎋",
    "pixel-art": "👾",
    cyberpunk: "🌃",
    sketch: "✍️",
    "low-poly": "💎",
    "vintage-poster": "🎪",
    minimalism: "⬜",
  };
  return map[styleId] || "🎨";
}
