"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, ChevronRight, Cpu, Users, Wind } from "lucide-react";
import { getSiteContent } from "@/services/api";

const getIcon = (iconName) => {
  switch (iconName) {
    case "Users":
      return <Users className="h-7 w-7" />;
    case "Cpu":
      return <Cpu className="h-7 w-7" />;
    case "Wind":
      return <Wind className="h-7 w-7" />;
    default:
      return <Building2 className="h-7 w-7" />;
  }
};

export function Services() {
  const [capacities, setCapacities] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setCapacities(data?.capacity || []);
    }

    load();
  }, []);

  return (
    <section id="services" className="section-padding bg-[#f7fbff]">
      <div className="container">
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Năng lực hoạt động
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#0f172a] md:text-5xl">
              Sức mạnh từ hạ tầng, con người và công nghệ
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#0f172a]/58">
            Khiên Hà vận hành mô hình sản xuất đồng bộ từ gia công kết cấu, lắp ráp, hoàn thiện bề mặt đến chạy thử và bàn giao, phù hợp cho các dự án đóng mới và sửa chữa quy mô lớn.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {capacities.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group overflow-hidden rounded-[2.4rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.8))]" />
                <div className="absolute left-6 top-6 rounded-full border border-white/40 bg-white/18 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur-xl">
                  {item.category}
                </div>
              </div>

              <div className="p-8">
                <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-2xl font-black text-[#0f172a]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#0f172a]/60">{item.detail}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                  Năng lực thực tế
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
