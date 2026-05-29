"use client";

import { STYLE_PRESETS, type StylePreset } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedId: string | null;
  onSelect: (style: StylePreset) => void;
}

function StylePreviewPattern({ styleId }: { styleId: string }) {
  switch (styleId) {
    case "watercolor":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full opacity-50">
          <circle cx="25" cy="30" r="18" fill="rgba(255,182,193,0.6)" />
          <circle cx="55" cy="25" r="14" fill="rgba(135,206,235,0.5)" />
          <circle cx="40" cy="55" r="16" fill="rgba(152,251,152,0.4)" />
          <circle cx="20" cy="60" r="10" fill="rgba(221,160,221,0.3)" />
        </svg>
      );
    case "oil-painting":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="8" y="10" width="28" height="22" rx="3" fill="#E8A87C" opacity="0.8" />
          <rect x="44" y="14" width="22" height="16" rx="3" fill="#95B8D1" opacity="0.8" />
          <rect x="16" y="42" width="34" height="20" rx="3" fill="#C38D9E" opacity="0.7" />
          <rect x="54" y="40" width="18" height="24" rx="3" fill="#E27D60" opacity="0.7" />
        </svg>
      );
    case "flat-illustration":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="10" y="15" width="25" height="25" rx="6" fill="#2ECC71" />
          <circle cx="50" cy="28" r="12" fill="#3498DB" />
          <polygon points="40,55 52,65 28,65" fill="#E74C3C" />
          <rect x="50" y="52" width="18" height="18" rx="4" fill="#F39C12" />
        </svg>
      );
    case "3d-render":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <defs>
            <linearGradient id="g3d1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="g3d2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" /><stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="12" y="24" width="28" height="28" rx="4" fill="url(#g3d1)" />
          <rect x="12" y="24" width="28" height="28" rx="4" fill="url(#g3d2)" />
          <rect x="36" y="36" width="24" height="24" rx="4" fill="url(#g3d1)" opacity="0.7" />
        </svg>
      );
    case "anime":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="28" r="16" fill="rgba(255,182,193,0.4)" />
          <circle cx="32" cy="26" r="3" fill="#2C3E50" />
          <circle cx="48" cy="26" r="3" fill="#2C3E50" />
          <path d="M34 35 Q40 42 46 35" stroke="#2C3E50" strokeWidth="2" fill="none" />
          <path d="M28 20 Q20 10 12 18" stroke="#E8A87C" strokeWidth="2" fill="#E8A87C" opacity="0.5" />
          <path d="M52 20 Q60 10 68 18" stroke="#E8A87C" strokeWidth="2" fill="#E8A87C" opacity="0.5" />
        </svg>
      );
    case "chinese-ink":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="50" r="20" fill="none" stroke="#2C3E50" strokeWidth="1.5" opacity="0.6" />
          <path d="M40 30 Q25 40 30 50" stroke="#2C3E50" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M40 30 Q55 40 50 50" stroke="#2C3E50" strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="40" cy="30" r="4" fill="#E74C3C" opacity="0.5" />
          <path d="M20 60 Q30 55 40 58 Q50 61 60 56" stroke="#5D4037" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
      );
    case "pixel-art":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="15" y="15" width="4" height="4" fill="#2C3E50" />
          <rect x="19" y="15" width="4" height="4" fill="#3498DB" />
          <rect x="23" y="15" width="4" height="4" fill="#2C3E50" />
          <rect x="15" y="19" width="4" height="4" fill="#E74C3C" />
          <rect x="19" y="19" width="4" height="4" fill="#F1C40F" />
          <rect x="23" y="19" width="4" height="4" fill="#E74C3C" />
          <rect x="15" y="23" width="4" height="4" fill="#2C3E50" />
          <rect x="19" y="23" width="4" height="4" fill="#3498DB" />
          <rect x="23" y="23" width="4" height="4" fill="#2C3E50" />
          <rect x="45" y="25" width="4" height="4" fill="#27AE60" />
          <rect x="49" y="25" width="4" height="4" fill="#2ECC71" />
          <rect x="45" y="29" width="4" height="4" fill="#2ECC71" />
          <rect x="49" y="29" width="4" height="4" fill="#27AE60" />
          <rect x="30" y="40" width="4" height="4" fill="#8E44AD" />
          <rect x="34" y="40" width="4" height="4" fill="#9B59B6" />
          <rect x="38" y="40" width="4" height="4" fill="#8E44AD" />
          <rect x="30" y="44" width="4" height="4" fill="#9B59B6" />
          <rect x="34" y="44" width="4" height="4" fill="#D2B4DE" />
          <rect x="38" y="44" width="4" height="4" fill="#9B59B6" />
        </svg>
      );
    case "cyberpunk":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="10" y="30" width="18" height="30" fill="#1A1A2E" opacity="0.8" />
          <rect x="30" y="20" width="12" height="40" fill="#16213E" opacity="0.8" />
          <rect x="44" y="35" width="20" height="25" fill="#0F3460" opacity="0.8" />
          <rect x="12" y="32" width="4" height="6" fill="#E040FB" opacity="0.9" />
          <rect x="20" y="40" width="4" height="6" fill="#00E5FF" opacity="0.9" />
          <rect x="34" y="25" width="3" height="5" fill="#E040FB" opacity="0.8" />
          <rect x="48" y="38" width="3" height="5" fill="#00E5FF" opacity="0.8" />
          <rect x="54" y="45" width="3" height="5" fill="#E040FB" opacity="0.7" />
        </svg>
      );
    case "sketch":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full opacity-70">
          <path d="M12 40 Q20 20 35 25 Q50 30 40 50 Q30 70 50 60 Q65 50 60 35" fill="none" stroke="#555" strokeWidth="1.2" />
          <circle cx="30" cy="30" r="8" fill="none" stroke="#555" strokeWidth="1" />
          <path d="M26 26 L34 34 M34 26 L26 34" stroke="#555" strokeWidth="0.8" />
        </svg>
      );
    case "low-poly":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <polygon points="30,15 50,20 40,35" fill="rgba(45,255,196,0.7)" stroke="rgba(45,255,196,0.3)" strokeWidth="1" />
          <polygon points="50,20 65,30 40,35" fill="rgba(45,255,150,0.5)" stroke="rgba(45,255,150,0.3)" strokeWidth="1" />
          <polygon points="30,15 40,35 20,40 10,25" fill="rgba(45,200,255,0.5)" stroke="rgba(45,200,255,0.3)" strokeWidth="1" />
          <polygon points="40,35 20,40 15,60 35,55" fill="rgba(100,255,200,0.5)" stroke="rgba(100,255,200,0.3)" strokeWidth="1" />
          <polygon points="65,30 40,35 35,55 55,50" fill="rgba(50,200,255,0.5)" stroke="rgba(50,200,255,0.3)" strokeWidth="1" />
        </svg>
      );
    case "vintage-poster":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <rect x="10" y="10" width="60" height="60" rx="4" fill="#E8C07A" opacity="0.6" />
          <rect x="18" y="18" width="44" height="44" rx="2" fill="#D4A05A" opacity="0.5" />
          <circle cx="35" cy="40" r="10" fill="#C0392B" opacity="0.7" />
          <text x="40" y="44" textAnchor="middle" fill="#2C3E50" fontSize="14" fontWeight="bold" fontFamily="serif">!</text>
          <line x1="25" y1="62" x2="55" y2="62" stroke="#6B4226" strokeWidth="3" opacity="0.5" />
        </svg>
      );
    case "minimalism":
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="35" cy="35" r="18" fill="none" stroke="#2C3E50" strokeWidth="3" />
          <line x1="55" y1="65" x2="20" y2="20" stroke="#2C3E50" strokeWidth="2" opacity="0.4" />
          <rect x="48" y="48" width="16" height="16" fill="#BDC3C7" opacity="0.7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="20" fill="currentColor" opacity="0.15" />
        </svg>
      );
  }
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
              "w-full aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105",
              style.previewColor,
              selectedId === style.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            <StylePreviewPattern styleId={style.id} />
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