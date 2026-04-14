"use client";
import React from "react";
import { Ship, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl">
            <img
              src="/logo.png"
              alt="Khiên Hà Logo"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-[#0f172a] leading-none">KHIÊN HÀ</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-[#0f172a]/60 uppercase tracking-widest">
          {[
            { label: "Trang chủ", href: "#hero" },
            { label: "Giới thiệu", href: "#about" },
            { label: "Năng lực", href: "#services" },
            { label: "Tin tức", href: "#news" },
            { label: "Liên hệ", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-primary transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" className="hidden sm:flex rounded-xl border-border text-[#0f172a] font-bold px-6 h-11 hover:bg-[#f8fafc]">
              Admin Panel
            </Button>
          </Link>
          <Button className="hidden sm:flex rounded-xl bg-[#0f172a] hover:bg-primary text-white font-bold px-8 h-11 shadow-lg shadow-[#0f172a]/10">
            Liên hệ ngay
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden text-[#0f172a]">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
