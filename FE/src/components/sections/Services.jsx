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
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Năng lực hoạt động
            </div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a] md:text-4xl">
              Sức mạnh từ hạ tầng, con người và công nghệ
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#0f172a]/58">
            Khiên Hà vận hành mô hình sản xuất đồng bộ từ gia công kết cấu, lắp ráp, hoàn thiện bề mặt đến chạy thử
            và bàn giao cho các dự án đóng mới và sửa chữa quy mô lớn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {capacities.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.8))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/18 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">{getIcon(item.icon)}</div>
                <h3 className="text-xl font-black text-[#0f172a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#0f172a]/60">{item.detail}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
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
