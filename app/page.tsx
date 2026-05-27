import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Pencil, Palette, WandSparkles, Layers,
  ArrowRight, Sparkles, Zap, Frame,
} from "lucide-react";
import { STYLE_PRESETS } from "@/lib/styles";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-blue-50/50 to-indigo-50/80 dark:from-violet-950/20 dark:via-zinc-950 dark:to-indigo-950/20" />
          <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl animate-float" />
          <div className="absolute top-40 right-[15%] w-80 h-80 rounded-full bg-indigo-300/20 dark:bg-indigo-600/10 blur-3xl animate-float-delayed" />
          <div className="absolute bottom-10 left-[40%] w-64 h-64 rounded-full bg-purple-300/15 dark:bg-purple-600/10 blur-3xl animate-float-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/10">
              <Sparkles className="h-4 w-4" />
              AI 驱动的艺术创作工具
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              手绘草图
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                秒变精美画作
              </span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              在画布上随意绘制你的灵感草图，选择你喜欢的艺术风格，
              <br className="hidden sm:block" />
              AI 将在几秒内为你生成专业级别的精美画作。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <button className="btn-brand rounded-xl px-8 h-12 text-base font-semibold flex items-center gap-2">
                  免费开始创作
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/#how-it-works">
                <button className="rounded-xl px-8 h-12 text-base font-medium border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-muted transition-all flex items-center gap-2">
                  了解更多
                </button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-4">
              新用户注册即送 50 积分 · 可生成约 16 张画作 · 无需信用卡
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">12+</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-0.5">艺术风格</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">~5秒</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-0.5">平均生成速度</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">1024px</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-0.5">高清输出</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">强大的创作工具</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">从草图到艺术品，只需简单三步</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Pencil,
                title: "自由绘制",
                desc: "专业画布工具，支持多种画笔和形状，尽情挥洒你的创意灵感",
                gradient: "from-blue-500 to-cyan-500",
                shadow: "shadow-blue-500/20",
              },
              {
                icon: Palette,
                title: "12种风格",
                desc: "水彩、油画、国风水墨、赛博朋克... 总有一款风格适合你",
                gradient: "from-violet-500 to-purple-500",
                shadow: "shadow-violet-500/20",
              },
              {
                icon: WandSparkles,
                title: "AI 生成",
                desc: "基于智谱 CogView-3-Plus 大模型，秒级生成高质量画作",
                gradient: "from-pink-500 to-rose-500",
                shadow: "shadow-pink-500/20",
              },
              {
                icon: Layers,
                title: "批量创作",
                desc: "一次生成多张不同效果，挑选你最满意的那一张",
                gradient: "from-amber-500 to-orange-500",
                shadow: "shadow-amber-500/20",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group p-5 md:p-6 rounded-2xl border border-border/50 bg-card hover:shadow-xl ${item.shadow} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-base mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles showcase */}
      <section id="styles" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">丰富多样的艺术风格</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">从古典到现代，从东方到西方，找到属于你的艺术表达</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {STYLE_PRESETS.map((style) => (
              <div
                key={style.id}
                className="group relative flex flex-col items-center p-3 md:p-4 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`w-full aspect-square rounded-xl bg-gradient-to-br ${style.previewColor} flex items-center justify-center text-3xl mb-2.5 group-hover:scale-105 transition-transform duration-300`}
                >
                  {style.icon}
                </div>
                <span className="font-medium text-sm">{style.name}</span>
                <span className="text-[10px] text-muted-foreground">{style.nameEn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">三步完成创作</h2>
            <p className="text-muted-foreground text-base md:text-lg">简单直观的创作流程</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: Pencil, title: "绘制草图", desc: "在专业画布上用画笔、形状等工具绘制你的创意草图" },
              { step: "02", icon: Palette, title: "选择风格", desc: "从12种精美艺术风格中选择你喜欢的效果" },
              { step: "03", icon: Zap, title: "AI 生成", desc: "点击生成，AI 将你的草图转化为专业级画作" },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-100 dark:border-violet-900/40 mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <item.icon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="text-[10px] font-bold text-primary mb-1 tracking-widest">STEP {item.step}</div>
                <h3 className="font-semibold text-lg mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 md:mt-14">
            <Link href="/create">
              <button className="btn-brand rounded-xl px-8 h-12 text-base font-semibold flex items-center gap-2 mx-auto">
                立即体验
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">准备好释放你的创意了吗？</h2>
          <p className="text-white/75 text-base md:text-lg mb-8">注册即可免费体验，让 AI 将你的想象变为现实</p>
          <Link href="/signup">
            <button className="rounded-xl px-8 h-12 text-base font-semibold bg-white text-violet-700 hover:bg-white/90 shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
              免费注册，开始创作
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
