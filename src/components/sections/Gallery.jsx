"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function Gallery() {
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setImages(data?.gallery || []);
    }

    load();
  }, []);

  const categories = Array.from(new Set(images.map((item) => item.category).filter(Boolean)));
  const filteredImages = images.filter((item) => (activeCategory === "all" ? true : item.category === activeCategory));

  return (
    <section id="gallery" className="section-padding bg-[#eef7ff]">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Hình ảnh hoạt động
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#0f172a] md:text-5xl">
              Những dự án tiêu biểu tại nhà máy
            </h2>
          </div>

          <div className="max-w-xl text-sm leading-7 text-[#0f172a]/58">
            Chọn nhóm dự án để lọc nhanh hình ảnh theo từng mảng hoạt động, từ đóng mới đến nhà xưởng và bàn giao.
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all"
              ? "rounded-full bg-[#0f172a] px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white"
              : "rounded-full border border-slate-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 transition-colors hover:border-primary hover:text-primary"}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category
                ? "rounded-full bg-primary px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-white"
                : "rounded-full border border-slate-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 transition-colors hover:border-primary hover:text-primary"}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8 text-sm text-[#0f172a]/58">
          Đang hiển thị {filteredImages.length} hình ảnh {activeCategory === "all" ? "từ toàn bộ nhà máy" : `thuộc nhóm ${activeCategory}`}.
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredImages.map((img, index) => (
            <motion.button
              key={img.id || index}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelected(img)}
              className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/70 text-left shadow-[0_24px_80px_rgba(15,23,42,0.1)]"
            >
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.78))]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">{img.category}</div>
                  <h3 className="mt-3 text-xl font-black text-white">{img.title}</h3>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/12 p-3 text-white backdrop-blur-xl">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#08111f]/94 p-5"
            onClick={() => setSelected(null)}
          >
            <button className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 p-3 text-white backdrop-blur-xl">
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-full items-center justify-center">
              <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                  <img src={selected.url} alt={selected.title} className="h-full w-full object-cover" />
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/8 p-8 text-white backdrop-blur-xl">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">{selected.category}</div>
                  <h3 className="mt-4 text-3xl font-black">{selected.title}</h3>
                  <p className="mt-6 text-sm leading-7 text-white/70">
                    Không gian nhà máy, tiến độ thi công và sản phẩm thực tế được cập nhật nhằm phản ánh năng lực vận hành, tổ chức sản xuất và mức độ hoàn thiện của các dự án trọng điểm.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
