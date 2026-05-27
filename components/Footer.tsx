import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold">SketchToArt</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI 驱动的草图转艺术品工具。将你的手绘草图瞬间变为精美画作。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">产品</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/create" className="hover:text-foreground transition">开始创作</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition">我的作品</Link></li>
              <li><Link href="/#styles" className="hover:text-foreground transition">风格库</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">支持</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">帮助中心</a></li>
              <li><a href="#" className="hover:text-foreground transition">常见问题</a></li>
              <li><a href="#" className="hover:text-foreground transition">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">法律</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition">服务条款</a></li>
              <li><a href="#" className="hover:text-foreground transition">隐私政策</a></li>
              <li><a href="#" className="hover:text-foreground transition">版权声明</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SketchToArt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
