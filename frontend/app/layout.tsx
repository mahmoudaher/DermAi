import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DermAI - Deri Lezyon Analizi",
  description: "Yapay zekâ destekli deri lezyonu sınıflandırma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-xl shadow-emerald-500/10">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-cyan-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/30 hover-lift">
                  DA
                </div>
                <div className="leading-tight">
                  <p className="text-lg font-semibold text-white">DermAI</p>
                  <p className="text-xs text-slate-300">
                    Yapay zekâ ile deri lezyonu analizi
                  </p>
                </div>
              </div>
              <nav className="flex items-center gap-2 text-sm font-medium text-slate-200">
                {[
                  { href: "/", label: "Ana Sayfa" },
                  { href: "/hastaliklar", label: "Hastalık Açıklamaları" },
                  { href: "/farkindalik", label: "Farkındalık" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative rounded-xl px-4 py-2 transition hover:text-white"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    <span className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-linear-to-r from-emerald-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
                <Link
                  href="/"
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-slate-900 font-semibold shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
                >
                  Hemen Başla
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-200">DermAI</p>
                <p className="text-xs text-slate-400">
                  Yapay zekâ destekli deri lezyonu analizi. Klinik karar desteği
                  için tasarlanmıştır.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Developed by Mahmoud Al-Daher
                </p>
              </div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span>Mahremiyet</span>
                <span>Güvenlik</span>
                <span>İletişim</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
