"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSiteContent } from "@/services/api";
import { ShieldCheck, History, Award, Globe, ArrowUpRight, Settings, Layers, Hammer } from "lucide-react";

const getIcon = (iconName) => {
  switch(iconName) {
    case 'Ship': return <Globe className="w-6 h-6" />;
    case 'Settings': return <Settings className="w-6 h-6" />;
    case 'Layers': return <Layers className="w-6 h-6" />;
    case 'Hammer': return <Hammer className="w-6 h-6" />;
    default: return <History className="w-6 h-6" />;
  }
};

export function About() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      if (data && data.capacity) {
        setMetrics(data.capacity);
      }
      setLoading(false);
    }
    load();
  }, []);
  return (
    <section id="about" className="section-padding bg-[#f8fafc]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-[2px] bg-primary" />
               <span className="text-sm font-bold uppercase tracking-widest text-primary">Về chúng tôi</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black font-heading mb-8 text-[#0f172a] leading-tight">
              Biểu Tượng Của Ngành <br/> 
              <span className="text-primary/40">Cơ Khí Đóng Tàu Miền Bắc</span>
            </h3>
            
            <p className="text-lg text-foreground/60 mb-10 leading-relaxed font-medium">
              Công ty TNHH thương mại Khiên Hà không ngừng đổi mới quy trình sản xuất, 
              áp dụng công nghệ CNC Plastma hiện đại để kiến tạo nên những con tàu vững chãi trước sóng gió đại dương.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="group p-6 bg-white rounded-2xl border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {getIcon(m.icon)}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#0f172a] mb-2">{m.title}</h4>
                  <p className="text-xs text-foreground/50 leading-normal">{m.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
             <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#38bdf8] opacity-10" />
                <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center p-12">
                   <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                      <ShieldCheck className="w-20 h-20 text-primary mb-6" />
                      <span className="text-2xl font-black text-[#0f172a]">ISO 9001:2015 CERTIFIED</span>
                      <p className="text-sm text-foreground/40 mt-4 uppercase tracking-widest font-bold">Standard of Quality Management</p>
                   </div>
                </div>
             </div>
             
             {/* Floating Badge */}
             <div className="absolute -bottom-10 -right-4 p-8 glass-white rounded-3xl border border-white shadow-2xl flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-4xl font-black text-primary">22+</span>
                   <span className="text-xs font-bold text-foreground/40 uppercase">Years of Exp</span>
                </div>
                <div className="w-[1px] h-12 bg-border" />
                <button className="p-4 rounded-full bg-[#0f172a] text-white hover:bg-primary transition-all">
                   <ArrowUpRight className="w-6 h-6" />
                </button>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
