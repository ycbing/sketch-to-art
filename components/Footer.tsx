import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">SketchToArt</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI 驱动的草图转艺术品工具。<br />
              将你的手绘草图瞬间变为精美画作。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">产品</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/create" className="hover:text-foreground transition">开始创作</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition">我的作品</Link></li>
              <li><Link href="/#styles" className="hover:text-foreground transition">风格库</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">支持</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition">帮助中心</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">常见问题</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">法律</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition">服务条款</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">隐私政策</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">版权声明</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SketchToArt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
