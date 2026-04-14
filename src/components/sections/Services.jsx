"use client";
import React from "react";
import { motion } from "framer-motion";
import { Ship, Settings, Layers, Hammer, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/site-content";

const getIcon = (iconName) => {
  switch(iconName) {
    case 'Ship': return <Ship className="w-8 h-8" />;
    case 'Settings': return <Settings className="w-8 h-8" />;
    case 'Layers': return <Layers className="w-8 h-8" />;
    case 'Hammer': return <Hammer className="w-8 h-8" />;
    default: return <Ship className="w-8 h-8" />;
  }
};

export function Services() {
  const services = siteContent.capacity;

  return (
    <section id="services" className="section-padding bg-[#f4f7fa]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h3 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6">
              Giải Pháp Hàng Hải <br />
              <span className="text-primary italic">Toàn Diện</span>
            </h3>
            <p className="text-base text-foreground/50 font-medium">
              Chúng tôi cung cấp hệ sinh thái dịch vụ từ thiết kế đến hạ thủy, đảm bảo tiến độ và chất lượng quốc tế.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-8 rounded-[2.5rem] border border-border hover:border-primary/20 hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                {getIcon(s.icon)}
              </div>
              <h4 className="text-xl font-bold text-[#0f172a] mb-4 group-hover:text-primary transition-colors">
                {s.title}
              </h4>
              <p className="text-sm text-foreground/40 font-medium leading-relaxed mb-8">
                {s.detail}
              </p>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f172a] hover:text-primary transition-all">
                Xem chi tiết <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
