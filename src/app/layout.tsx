import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "読み切りマンガ横断ビューア",
  description:
    "複数の出版社・Web マンガサイトが掲載している「読み切り」作品を横断的に一覧できるキュレーションサイト。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
