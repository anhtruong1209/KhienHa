"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, History, Settings, Award, Anchor, Globe, Ship, Activity } from "lucide-react";
import { bannerImages, siteContent } from "@/data/site-content";
import { newsData } from "@/data/news";

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.length > 2) {
      const filteredNews = newsData.filter(n => n.title.toLowerCase().includes(term));
      const filteredProjects = siteContent.gallery.filter(p => p.title.toLowerCase().includes(term));
      setResults([...filteredNews, ...filteredProjects]);
    } else {
      setResults([]);
    }
  };

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
           className="absolute inset-0 z-0"
        >
          <img 
            src={bannerImages[current]} 
            alt="Khiên Hà Banner" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-[#0f172a]/80 z-[1]" />

      <div className="container relative z-10 flex flex-col items-center pt-20">
        <div className="w-full grid lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-12 text-center flex flex-col items-center">
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-widest mb-8"
             >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Established Since 2002
             </motion.div>
             
             <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter mb-6 drop-shadow-2xl">
                TIÊN PHONG <br/>
                <span className="text-primary italic">HÀNG HẢI VIỆT</span>
             </h1>
             
             <p className="max-w-2xl text-[16px] text-white/70 font-medium mb-12 drop-shadow-lg leading-relaxed">
               Khẳng định vị thế dẫn đầu trong ngành đóng tàu với hơn 22 năm kinh nghiệm 
               và năng lực vươn tầm đại dương.
             </p>

             {/* Search Hub */}
             <div className="w-full max-w-3xl relative">
               <div className="flex bg-white/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/20">
                  <div className="flex-1 flex items-center px-6">
                    <Search className="w-5 h-5 text-primary mr-4" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Tìm kiếm nhanh: tàu hành, ISO, hạ thủy..." 
                      className="w-full py-4 bg-transparent outline-none font-bold text-[#0f172a] text-sm placeholder:text-[#0f172a]/30"
                    />
                  </div>
                  <button className="bg-[#0f172a] hover:bg-primary text-white font-black px-10 rounded-xl transition-all shadow-xl text-xs uppercase tracking-widest">
                    TRUY VẤN
                  </button>
               </div>
               
               {/* Search Results Dropdown */}
               <AnimatePresence>
                 {results.length > 0 && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-border"
                   >
                     <div className="max-h-60 overflow-auto p-2">
                       {results.map((res, i) => (
                         <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border-b border-gray-50 last:border-0 text-left">
                            <img src={res.url || res.image || "/logo.png"} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                               <div className="text-[10px] font-black text-primary uppercase tracking-tighter mb-1">{res.category || "HỆ THỐNG"}</div>
                               <div className="text-sm font-bold text-[#0f172a] line-clamp-1">{res.title}</div>
                            </div>
                         </div>
                       ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Categories Grid - High Density */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-4 shadow-2xl border border-white/20 grid grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-6xl">
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
