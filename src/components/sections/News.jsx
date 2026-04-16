"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Newspaper, Ship } from "lucide-react";
import { getNews } from "@/services/api";

export function News() {
  const [newsList, setNewsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await getNews();
      setNewsList(data || []);
    }

    load();
  }, []);

  const categories = Array.from(new Set(newsList.map((item) => item.category).filter(Boolean)));
  const filteredNews = newsList
    .filter((item) => (activeCategory === "all" ? true : item.category === activeCategory))
    .slice(0, 6);

  return (
    <section id="news" className="section-padding bg-white">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-primary/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
              <Newspaper className="h-4 w-4" />
              Tin tức & cập nhật
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#0f172a] md:text-5xl">
              Nhịp vận hành mới nhất từ Khiên Hà
            </h2>
          </div>

          <Link
            href="#contact"
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 px-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#0f172a] transition-colors hover:border-primary hover:text-primary"
          >
            Kết nối tư vấn
            <ArrowRight className="h-4 w-4" />
          </Link>
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
          Đang hiển thị {filteredNews.length} tin {activeCategory === "all" ? "mới nhất từ toàn bộ chuyên mục" : `thuộc chuyên mục ${activeCategory}`}.
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNews.map((news, index) => (
            <motion.article
              key={news._id || news.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group overflow-hidden rounded-[2.2rem] border border-slate-100 bg-[#f9fbff] shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#0f172a,#0ea5e9)] text-white">
                    <Ship className="h-14 w-14 opacity-30" />
                  </div>
                )}
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-xl">
                  {news.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary/65">
                  <Calendar className="h-3.5 w-3.5" />
                  {news.date}
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#0f172a]">{news.title}</h3>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#0f172a]/58">{news.excerpt || news.content}</p>

                <Link
                  href={`/news/${news.slug || news.id}`}
                  className="mt-7 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary"
                >
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
