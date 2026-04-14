"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Settings, Award, Anchor, Globe, Ship, Activity } from "lucide-react";
import { getSiteContent, getNews } from "@/services/api";

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      if (data) setBanners(data.banners || []);
    }
    load();
    
    const timer = setInterval(() => {
      setBanners(prev => {
        if (prev.length > 0) {
           setCurrent((curr) => (curr + 1) % prev.length);
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#000]">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
           key={current}
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.5 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.5 }}
           className="absolute inset-0 z-0 bg-[#0f172a]"
        >
          {banners.length > 0 && (
            <img 
              src={banners[current]} 
              alt="Khiên Hà Banner" 
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-[#0f172a]/80 z-[1]" />

      <div className="container relative z-10 flex flex-col items-center pt-20">
        <div className="w-full text-center flex flex-col items-center">
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-widest mb-8"
             >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Established Since 2002
             </motion.div>
             
             <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter mb-8 drop-shadow-2xl">
                TIÊN PHONG <br/>
                <span className="text-primary italic font-heading">HÀNG HẢI VIỆT</span>
             </h1>
             
             <p className="max-w-2xl text-[18px] text-white/70 font-medium mb-12 drop-shadow-lg leading-relaxed">
               Khẳng định vị thế dẫn đầu trong ngành đóng tàu với hơn 22 năm kinh nghiệm 
               và năng lực vươn tầm đại dương.
             </p>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
             >
               <button className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-2xl transition-all shadow-xl shadow-primary/20 text-xs uppercase tracking-widest">
                  Khám phá năng lực
               </button>
               <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-black px-10 h-14 rounded-2xl transition-all text-xs uppercase tracking-widest">
                  Xem dự án tiêu biểu
               </button>
             </motion.div>
        </div>
        
        {/* Categories Grid - High Density */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl border border-white/20 grid grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-6xl mt-12 relative z-20">
          {[
            { icon: <History className="w-6 h-6" />, label: "Lịch sử" },
            { icon: <Settings className="w-6 h-6" />, label: "Năng lực" },
            { icon: <Award className="w-6 h-6" />, label: "Quy trình" },
            { icon: <Anchor className="w-6 h-6" />, label: "Mục tiêu" },
            { icon: <Globe className="w-6 h-6" />, label: "Quốc tế" },
            { icon: <Ship className="w-6 h-6" />, label: "Đóng mới" },
          ].map((item, i) => (
            <button 
              key={i} 
              className="group flex flex-col items-center p-6 rounded-3xl hover:bg-[#0f172a] transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                 {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-[#0f172a] group-hover:text-white transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
