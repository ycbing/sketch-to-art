import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { STYLE_PRESETS } from "@/lib/styles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Paintbrush,
  Wand2,
  Layers,
  ArrowRight,
  Zap,
  Palette,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-pink-50" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI 驱动的艺术创作工具
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              手绘草图
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                秒变精美画作
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              在画布上随意绘制你的灵感草图，选择你喜欢的艺术风格，
              AI 将在几秒内为你生成专业级别的精美画作。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 h-12">
                  免费开始创作
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  了解更多
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              新用户注册即送 50 积分，可生成约 16 张画作
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">12+</div>
              <div className="text-sm text-muted-foreground mt-1">艺术风格</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">~5秒</div>
              <div className="text-sm text-muted-foreground mt-1">平均生成速度</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">1024px</div>
              <div className="text-sm text-muted-foreground mt-1">高清输出</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              强大的创作工具
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              从草图到艺术品，只需简单三步
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Pencil,
                title: "自由绘制",
                desc: "专业画布工具，支持多种画笔和形状，尽情挥洒你的创意灵感",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Palette,
                title: "12种风格",
                desc: "水彩、油画、国风水墨、赛博朋克... 总有一款风格适合你",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: Wand2,
                title: "AI 生成",
                desc: "基于智谱 CogView-3-Plus 大模型，秒级生成高质量画作",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Layers,
                title: "批量创作",
                desc: "一次生成多张不同效果，挑选你最满意的那一张",
                color: "from-amber-500 to-orange-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles showcase */}
      <section id="styles" className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              丰富多样的艺术风格
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              从古典到现代，从东方到西方，找到属于你的艺术表达
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {STYLE_PRESETS.map((style) => (
              <div
                key={style.id}
                className="group relative flex flex-col items-center p-4 rounded-2xl border bg-card hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${style.previewColor} flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform`}>
                  {style.icon}
                </div>
                <span className="font-medium text-sm">{style.name}</span>
                <span className="text-xs text-muted-foreground">{style.nameEn}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              三步完成创作
            </h2>
            <p className="text-muted-foreground text-lg">
              简单直观的创作流程
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "绘制草图",
                desc: "在专业画布上用画笔、形状等工具绘制你的创意草图",
                icon: "✏️",
              },
              {
                step: "02",
                title: "选择风格",
                desc: "从12种精美艺术风格中选择你喜欢的效果",
                icon: "🎨",
              },
              {
                step: "03",
                title: "AI 生成",
                desc: "点击生成，AI 将你的草图转化为专业级画作",
                icon: "✨",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/20" />
                )}
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-primary mb-2">
                  STEP {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/create">
              <Button size="lg" className="text-base px-8 h-12">
                立即体验
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-blue-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好释放你的创意了吗？
          </h2>
          <p className="text-white/80 text-lg mb-8">
            注册即可免费体验，让 AI 将你的想象变为现实
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-8 h-12 bg-white text-primary hover:bg-white/90">
              免费注册，开始创作
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
