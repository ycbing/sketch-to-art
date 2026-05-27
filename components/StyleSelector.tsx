"use client";

import { STYLE_PRESETS, type StylePreset } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedId: string | null;
  onSelect: (style: StylePreset) => void;
}

export function StyleSelector({ selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {STYLE_PRESETS.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          className={cn(
            "group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer",
            selectedId === style.id
              ? "border-primary style-glow bg-primary/5 -translate-y-0.5"
              : "border-transparent bg-muted/50 hover:border-primary/30 hover:bg-muted hover:-translate-y-0.5"
          )}
        >
          <div
            className={cn(
              "w-full aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-105",
              style.previewColor,
              selectedId === style.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {style.icon}
          </div>
          <span className="text-xs font-semibold text-center leading-tight">
            {style.name}
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">
            {style.nameEn}
          </span>
        </button>
      ))}
    </div>
  );
}
