"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full h-12 text-base font-semibold"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          AI 正在创作中...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          生成画作 (-3积分)
        </>
      )}
    </Button>
  );
}
