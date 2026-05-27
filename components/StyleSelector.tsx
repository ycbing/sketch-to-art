"use client";

import { STYLE_PRESETS, type StylePreset } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedId: string | null;
  onSelect: (style: StylePreset) => void;
}

export function StyleSelector({ selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {STYLE_PRESETS.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          className={cn(
            "group relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer",
            selectedId === style.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-transparent bg-muted/50 hover:border-muted-foreground/30"
          )}
        >
          <div
            className={cn(
              "w-full aspect-square rounded-md bg-gradient-to-br flex items-center justify-center text-2xl",
              style.previewColor,
              selectedId === style.id && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {style.icon}
          </div>
          <span className="text-xs font-medium text-center leading-tight">
            {style.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {style.nameEn}
          </span>
        </button>
      ))}
    </div>
  );
}
