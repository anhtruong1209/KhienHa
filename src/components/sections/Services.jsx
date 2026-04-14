"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Cpu, Wind, ChevronRight } from "lucide-react";
import { getSiteContent } from "@/services/api";

const getIcon = (iconName) => {
  switch(iconName) {
    case 'Users': return <Users className="w-8 h-8" />;
    case 'Building2': return <Building2 className="w-8 h-8" />;
    case 'Cpu': return <Cpu className="w-8 h-8" />;
    case 'Wind': return <Wind className="w-8 h-8" />;
    default: return <Building2 className="w-8 h-8" />;
  }
};

export function Services() {
  const [capacities, setCapacities] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      if (data && data.capacity) {
        setCapacities(data.capacity);
      }
    }
    load();
  }, []);

  return (
    <section id="services" className="section-padding bg-[#f4f7fa]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-[2px] bg-primary" />
               <span className="text-sm font-bold uppercase tracking-widest text-primary">Năng lực hoạt động</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6">
              Sức Mạnh <br />
              <span className="text-primary italic">Nội Lực Toàn Diện</span>
            </h3>
            <p className="text-base text-foreground/50 font-medium">
              Sự kết hợp hoàn hảo giữa con người dày dặn kinh nghiệm và hệ thống cơ sở hạ tầng hiện đại bậc nhất.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {capacities.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col lg:flex-row bg-white rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/20 hover:shadow-2xl transition-all"
            >
              <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
              
              <div className="lg:w-3/5 p-8 flex flex-col justify-center">
                <div className="p-3 w-fit rounded-xl bg-primary/5 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  {getIcon(item.icon)}
                </div>
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{item.category}</div>
                <h4 className="text-2xl font-black text-[#0f172a] mb-4 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-foreground/40 font-medium leading-relaxed mb-8 italic">
                  "{item.detail}"
                </p>
                <div className="mt-auto">
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0f172a] hover:text-primary transition-all">
                      Xem hồ sơ kỹ thuật <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
