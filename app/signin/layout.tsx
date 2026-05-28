import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - SketchToArt",
  description: "登录你的 SketchToArt 账户，继续创作。",
};

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}