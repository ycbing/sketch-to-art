"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLANS = [
  {
    id: "starter",
    name: "免费体验",
    price: "免费",
    credits: 50,
    features: ["注册即送 50 积分", "约可生成 16 张画作", "12 种艺术风格", "基础画质"],
    popular: false,
  },
  {
    id: "pro",
    name: "创作者",
    price: "¥9.9",
    credits: 500,
    features: ["500 积分永久有效", "约可生成 160 张画作", "12 种艺术风格", "批量生成", "高优先级"],
    popular: true,
  },
  {
    id: "studio",
    name: "工作室",
    price: "¥29.9",
    credits: 1500,
    features: ["1500 积分永久有效", "约可生成 500 张画作", "所有高级风格", "批量生成", "优先体验新功能"],
    popular: false,
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePurchase = async (planId: string, credits: number) => {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, credits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "购买失败");
      toast.success(`购买成功！${credits} 积分已到账`);
      setLoadingPlan(null);
    } catch {
      toast.error("购买失败，请重试");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">简单透明的价格</h1>
          <p className="text-muted-foreground">
            一次购买，积分永久有效。注册即送 50 积分开始体验。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-xs font-medium">
                  推荐
                </div>
              )}
              <div className="mb-4">
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <div className="mt-1 text-3xl font-bold">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(plan.id, plan.credits)}
                disabled={loadingPlan === plan.id}
                className="w-full h-10 font-medium rounded-xl"
                variant={plan.popular ? "default" : "outline"}
              >
                {loadingPlan === plan.id ? "处理中..." : plan.price === "免费" ? "注册领取" : "立即购买"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
