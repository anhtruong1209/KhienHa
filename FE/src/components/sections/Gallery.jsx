"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { GALLERY_CATEGORY_OPTIONS, resolveGalleryCategoryValue } from "@/data/category-options";
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

  const categories = GALLERY_CATEGORY_OPTIONS;
  const filteredImages = images.filter((item) => (activeCategory === "all" ? true : resolveGalleryCategoryValue(item.category) === activeCategory));

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#eef8ff] py-18 text-[#0f172a] md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.07)_1px,transparent_1px)] bg-[size:96px_96px] opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.64),rgba(239,248,255,0.86))]" />

      <div className="relative mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(460px,0.56fr)] xl:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/78 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Hình ảnh hoạt động
            </div>
            <h2 className="max-w-5xl text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">
              Những dự án tiêu biểu tại nhà máy
            </h2>
          </div>

          <div className="rounded-[1.4rem] border border-white/80 bg-white/72 p-5 text-sm leading-7 text-[#0f172a]/64 shadow-[0_18px_60px_rgba(14,116,144,0.09)] backdrop-blur-xl">
            Chọn nhóm dự án để lọc nhanh hình ảnh theo từng mảng hoạt động, từ đóng mới đến nhà xưởng và bàn giao.
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={
              activeCategory === "all"
                ? "rounded-full bg-[#0f172a] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-white"
                : "rounded-full border border-sky-100 bg-white/72 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f172a]/62 backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-primary"
            }
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
              className={
                activeCategory === category.value
                  ? "rounded-full bg-primary px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-white"
                  : "rounded-full border border-sky-100 bg-white/72 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f172a]/62 backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-primary"
              }
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mb-6 text-sm text-[#0f172a]/58">
          Đang hiển thị {filteredImages.length} hình ảnh {activeCategory === "all" ? "từ toàn bộ nhà máy" : `thuộc nhóm ${activeCategory}`}.
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredImages.map((img, index) => (
            <motion.button
              key={img.id || index}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelected(img)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/72 text-left shadow-[0_24px_80px_rgba(14,116,144,0.14)] backdrop-blur-xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.02),rgba(6,17,31,0.66))]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100">{img.category}</div>
                  <h3 className="mt-2 text-lg font-black leading-tight text-white md:text-xl">{img.title}</h3>
                </div>
                <div className="rounded-2xl border border-white/18 bg-white/14 p-2.5 text-white backdrop-blur-xl">
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
            className="fixed inset-0 z-[100] bg-[#020817]/94 p-5"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full border border-white/15 bg-white/10 p-3 text-white backdrop-blur-xl"
              aria-label="Đóng hình ảnh"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-full items-center justify-center">
              <div className="grid w-full max-w-[1600px] gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <img src={selected.url} alt={selected.title} className="h-full max-h-[82vh] w-full object-cover" />
                </div>
                <div className="rounded-[2rem] border border-white/12 bg-white/10 p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100">{selected.category}</div>
                  <h3 className="mt-4 text-3xl font-black leading-tight">{selected.title}</h3>
                  <p className="mt-6 text-sm leading-7 text-white/70">
                    Không gian nhà máy, tiến độ thi công và sản phẩm thực tế được cập nhật nhằm phản ánh năng lực vận hành,
                    tổ chức sản xuất và mức độ hoàn thiện của các dự án trọng điểm.
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
