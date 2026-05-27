"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SketchToArt</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition">
            功能
          </Link>
          <Link href="/#styles" className="text-muted-foreground hover:text-foreground transition">
            风格
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition">
            使用方法
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/create">
                <Button size="sm">开始创作</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">我的作品</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">免费注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
