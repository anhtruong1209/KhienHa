"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Anchor } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.png" 
          alt="Khiên Hà Shipbuilding" 
          fill 
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background z-10" />
      </div>

      <div className="container relative z-20 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase glass border-white/20 rounded-full text-primary-foreground/80">
            <Anchor className="w-3 h-3" /> Since 2002
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-heading mb-6 tracking-tight">
            Nâng Tầm <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Công Nghệ Đóng Tàu
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-foreground/70 mb-10 leading-relaxed">
            Hơn 20 năm khẳng định vị thế công ty đóng tàu tư nhân hàng đầu Việt Nam. 
            Kiến tạo những con tàu vượt đại dương với khát vọng vươn tầm quốc tế.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full px-8 h-14 text-md shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              Khám phá năng lực <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-md glass border-white/20">
              Dịch vụ của chúng tôi
            </Button>
          </div>
        </motion.div>

        {/* Floating Stat Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-12 right-12 hidden lg:flex flex-col p-6 glass-card text-left"
        >
          <span className="text-3xl font-bold text-primary">20+</span>
          <span className="text-sm text-foreground/60">Năm Kinh Nghiệm</span>
        </motion.div>
      </div>
      
      {/* Static Visual Element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
