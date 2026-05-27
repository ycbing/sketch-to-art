"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { ImageIcon, Plus, Coins, Loader2 } from "lucide-react";
import Link from "next/link";

interface Artwork {
  id: string;
  title: string | null;
  prompt: string | null;
  resultUrl: string | null;
  resultUrls: string | null;
  styleId: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "daily_bonus" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCredits((prev) => (prev ?? 0) + data.added);
        toast.success(`+${data.added} 积分！`);
      }
    } catch {
      toast.error("领取失败");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">我的作品</h1>
            <p className="text-muted-foreground mt-1">
              管理你创作的所有 AI 画作
            </p>
          </div>

          <div className="flex items-center gap-3">
            {credits !== null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">{credits} 积分</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDailyBonus}
                  className="text-xs text-amber-600 hover:text-amber-700 h-auto p-1"
                >
                  每日签到 +10
                </Button>
              </div>
            )}
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建创作
              </Button>
            </Link>
          </div>
        </div>

        {/* Gallery */}
        {artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">还没有作品</h3>
            <p className="text-muted-foreground mb-6">
              开始你的第一次 AI 艺术创作吧
            </p>
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                开始创作
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
