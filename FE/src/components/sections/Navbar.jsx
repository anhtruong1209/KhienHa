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
    <nav className="fixed inset-x-0 top-0 z-50 px-3 py-3">
      <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between rounded-[1.4rem] border border-white/80 bg-white/78 px-4 py-3 text-[#0f172a] shadow-[0_20px_70px_rgba(14,116,144,0.13)] backdrop-blur-2xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-white/80 shadow-sm">
            <img src="/logo.png" alt="Khiên Hà" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <div className="text-base font-black text-[#0f172a]">KHIÊN HÀ</div>
            <div className="hidden text-[10px] font-black uppercase tracking-[0.18em] text-primary/60 sm:block">
              Shipbuilding
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-sky-100 bg-sky-50/70 px-2 py-1.5 lg:flex">
          {menu.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f172a]/62 transition-colors hover:bg-white hover:text-primary xl:px-4"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button
              variant="outline"
              className="hidden h-10 rounded-2xl border-sky-100 bg-white/70 px-4 font-black text-[#0f172a] hover:bg-sky-50 sm:inline-flex"
            >
              Đăng nhập
            </Button>
          </Link>
          <a href="#contact">
            <Button className="hidden h-10 rounded-2xl bg-[#0f172a] px-5 font-black text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)] hover:bg-primary sm:inline-flex">
              Liên hệ ngay
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="rounded-2xl text-[#0f172a] hover:bg-sky-50 lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
