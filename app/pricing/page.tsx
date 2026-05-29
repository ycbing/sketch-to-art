"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Check, Sparkles, Coins, ArrowRight } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "入门包",
    credits: 100,
    price: 9.9,
    originalPrice: 19.9,
    popular: false,
    desc: "体验 AI 创作的乐趣",
    features: ["100 积分", "约可生成 30 张画作", "永久有效", "标准画质 1024px"],
  },
  {
    id: "creator",
    name: "创作者包",
    credits: 500,
    price: 39.9,
    originalPrice: 79.9,
    popular: true,
    desc: "满足日常创作需求",
    features: ["500 积分", "约可生成 160 张画作", "永久有效", "高优先级队列", "批量生成支持 (4张/次)"],
  },
  {
    id: "pro",
    name: "专业包",
    credits: 1500,
    price: 99.9,
    originalPrice: 199.9,
    popular: false,
    desc: "解放创作生产力",
    features: ["1500 积分", "约可生成 500 张画作", "永久有效", "最高优先级队列", "批量生成支持 (4张/次)", "优先体验新风格"],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePurchase = async (planId: string, credits: number) => {
    if (!session) {
      toast.error("请先登录后再购买");
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, credits }),
      });

      if (res.ok) {
        toast.success(`购买成功！${credits} 积分已到账，开始创作吧`);
        setTimeout(() => window.location.href = "/create", 1000);
      } else {
        const data = await res.json();
        toast.error(data.error || "购买失败，请重试");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">选择适合你的套餐</h1>
          <p className="text-muted-foreground text-base lg:text-lg max-w-lg mx-auto">
            一次购买，积分永久有效。解锁更多创作可能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 lg:p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg">
                  最受欢迎
                </div>
              )}

              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">¥{plan.price}</span>
                {plan.originalPrice > plan.price && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ¥{plan.originalPrice}
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePurchase(plan.id, plan.credits)}
                disabled={loadingPlan !== null}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-6 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? (
                  "处理中..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    立即购买
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground">
            购买即表示同意服务条款。如有问题请联系 support@sketchtoart.com
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}