"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ImageIcon, Plus, Coins, Loader2, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

import { type ArtworkItem } from "@/types/artwork";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditHistory, setCreditHistory] = useState<
    { id: string; action: string; amount: number; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [artRes, creditsRes] = await Promise.all([
        fetch("/api/artworks"),
        fetch("/api/credits"),
      ]);
      if (artRes.ok) {
        const artData = await artRes.json();
        setArtworks(artData.artworks || []);
      }
      if (creditsRes.ok) {
        const creditsData = await creditsRes.json();
        setCredits(creditsData.credits);
        setCreditHistory(creditsData.recentUsage || []);
        if (creditsData.canClaimDailyBonus === false) {
          setDailyClaimed(true);
        }
      }
    } catch {
      toast.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个作品吗？")) return;
    try {
      const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArtworks((prev) => prev.filter((a) => a.id !== id));
        toast.success("已删除");
      } else {
        toast.error("删除失败");
      }
    } catch {
      toast.error("删除失败");
    }
  };

  const handleDailyBonus = async () => {
    if (dailyClaimed) return;
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "daily_bonus" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCredits((prev) => (prev ?? 0) + data.added);
        setDailyClaimed(true);
        toast.success(`🎁 +${data.added} 积分！`);
      }
    } catch {
      toast.error("领取失败");
    }
  };

  // Stats
  const thisMonth = artworks.filter(a => {
    const d = new Date(a.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-8">
          <div className="p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-100 dark:border-violet-900/40">
            <div className="flex items-center gap-2 mb-1.5">
              <ImageIcon className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-medium text-muted-foreground">总作品</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{artworks.length}</p>
          </div>
          <div className="p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center gap-2 mb-1.5">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">剩余积分</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-amber-700 dark:text-amber-400">{credits ?? 0}</p>
          </div>
          <div className="p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">本月创作</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{thisMonth.length}</p>
          </div>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl lg:text-2xl font-bold">我的作品</h1>
          <div className="flex items-center gap-2">
            {!dailyClaimed && (
              <button
                onClick={handleDailyBonus}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-sm hover:shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                每日签到 +10
              </button>
            )}
            <Link href="/create">
              <Button size="sm" className="btn-brand">
                <Plus className="h-4 w-4 mr-1" />
                新建创作
              </Button>
            </Link>
          </div>
        </div>

        {/* Credit history */}
        {creditHistory.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              积分明细
            </h3>
            <div className="space-y-1.5">
              {creditHistory.slice(0, 8).map((item) => {
                const isCredit = item.action === "daily_bonus";
                const labels: Record<string, string> = {
                  generate_single: "单张生成",
                  generate_batch: "批量生成",
                  daily_bonus: "每日签到",
                };
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-xs"
                  >
                    <span className="text-muted-foreground">
                      {labels[item.action] || item.action}
                    </span>
                    <span className={isCredit ? "font-semibold text-emerald-600" : "font-semibold text-muted-foreground"}>
                      {isCredit ? "+" : "-"}{item.amount} 积分
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery */}
        {artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-100 via-indigo-100 to-purple-100 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center mb-5">
              <ImageIcon className="h-9 w-9 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">还没有作品</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              在画布上绘制草图，选择你喜欢的风格，<br />AI 将为你生成精美的画作
            </p>
            <Link href="/create">
              <Button className="btn-brand">
                <Sparkles className="h-4 w-4 mr-2" />
                开始创作
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
