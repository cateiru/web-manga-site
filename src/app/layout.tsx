import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Webマンガサイト一覧",
    default: "Webマンガサイト一覧",
  },
  description: "出版社・事業者が運営する Web マンガサイトを横断的に一覧できるディレクトリサイト。",
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
