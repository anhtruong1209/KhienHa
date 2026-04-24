"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const menu = [
  { label: "Trang chủ", href: "#hero" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Năng lực", href: "#services" },
  { label: "Chất lượng", href: "#quality" },
  { label: "Tin tức", href: "#news" },
  { label: "Liên hệ", href: "#contact" },
];

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/72 backdrop-blur-2xl">
      <div className="container flex items-center justify-between py-2.5">
        <Link href="/" className="flex items-center gap-3">
          <div className="overflow-hidden">
            <img src="/logo.png" alt="Khiên Hà" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-base font-black tracking-[-0.04em] text-[#0f172a]">KHIÊN HÀ</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0f172a]/58 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" className="hidden h-10 rounded-2xl border-slate-200 px-4 font-black sm:inline-flex">
              Đăng nhập
            </Button>
          </Link>
          <a href="#contact">
            <Button className="hidden h-10 rounded-2xl bg-[#0f172a] px-5 font-black text-white hover:bg-primary sm:inline-flex">
              Liên hệ ngay
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="text-[#0f172a] lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
