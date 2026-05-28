import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "创作 - SketchToArt",
  description: "在画布上绘制草图，选择你喜欢的艺术风格，让 AI 为你生成精美画作。",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}