"use client";
import React from "react";
import { motion } from "framer-motion";
import { Ship, Filter, Settings, Hammer, Zap, HardHat } from "lucide-react";

const services = [
  {
    title: "Đóng mới tàu nội địa",
    desc: "Thiết kế và thi công các loại tàu chở hàng, tàu vận tải chạy nội địa.",
    icon: <Ship className="w-10 h-10" />,
    size: "col-span-2 row-span-2",
  },
  {
    title: "Sửa chữa tàu biển",
    desc: "Dịch vụ bảo dưỡng, lên đà và sửa chữa tàu biển chuyên nghiệp.",
    icon: <Settings className="w-10 h-10" />,
    size: "col-span-1 row-span-2",
  },
  {
    title: "Tàu chuyên tuyến",
    desc: "Đóng tàu vận tải quốc tế vượt đại dương.",
    icon: <Filter className="w-10 h-10" />,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Sà lan biển",
    desc: "Sản xuất sà lan chất lượng cao, bền bỉ.",
    icon: <Hammer className="w-10 h-10" />,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Cơ khí hàng hải",
    desc: "Gia công các thiết bị cơ khí chuyên dụng cho ngành tàu thủy.",
    icon: <HardHat className="w-10 h-10" />,
    size: "col-span-2 row-span-1",
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">Năng lực hoạt động</h2>
          <h3 className="text-4xl font-bold font-heading">Lĩnh Vực Chuyên Môn</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`${s.size} group relative overflow-hidden glass-card p-8 flex flex-col justify-end transition-all hover:bg-white/5 border-white/5`}
            >
              <div className="absolute top-8 right-8 text-primary/40 group-hover:text-primary transition-colors">
                {s.icon}
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
                <p className="text-foreground/60 leading-relaxed">{s.desc}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
