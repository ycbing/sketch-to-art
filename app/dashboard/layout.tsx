import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的作品 - SketchToArt",
  description: "查看和管理你创建的所有 AI 艺术作品。",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}