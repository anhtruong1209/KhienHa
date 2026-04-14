"use client";
import React from "react";
import { Ship, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass bg-transparent backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30">
          <Ship className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight font-heading text-glow">
          KHIÊN HÀ
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
        <a href="#hero" className="hover:text-primary transition-colors">Trang chủ</a>
        <a href="#about" className="hover:text-primary transition-colors">Giới thiệu</a>
        <a href="#services" className="hover:text-primary transition-colors">Năng lực</a>
        <a href="#gallery" className="hover:text-primary transition-colors">Hình ảnh</a>
        <a href="#contact" className="hover:text-primary transition-colors">Liên hệ</a>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="hidden sm:flex border-white/20 hover:bg-white/10 glass">
          Liên hệ ngay
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
}
