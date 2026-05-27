"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
}

export function GenerateButton({ onClick, loading, disabled, label }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full h-12 text-base font-semibold rounded-xl btn-brand disabled:opacity-50 disabled:cursor-not-allowed disabled:filter-none disabled:shadow-none flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="animate-pulse">AI 正在创作中...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          {label || "开始创作 · 3积分"}
        </>
      )}
    </button>
  );
}
