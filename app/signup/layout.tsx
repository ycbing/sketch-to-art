import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注册 - SketchToArt",
  description: "创建 SketchToArt 账户，注册即送 50 积分，开始你的 AI 艺术之旅。",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}