"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Newspaper, Ship } from "lucide-react";
import { NEWS_CATEGORY_OPTIONS, resolveNewsCategoryValue } from "@/data/category-options";
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

  const categories = NEWS_CATEGORY_OPTIONS;
  const filteredNews = newsList
    .filter((item) => (activeCategory === "all" ? true : resolveNewsCategoryValue(item.category) === activeCategory))
    .slice(0, 6);

  return (
    <section id="news" className="relative overflow-hidden bg-[#f7fbff] py-18 text-[#0f172a] md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,116,144,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.07)_1px,transparent_1px)] bg-[size:88px_88px] opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,248,255,0.9))]" />

      <div className="relative mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_auto] xl:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/78 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-xl">
              <Newspaper className="h-4 w-4" />
              Tin tức & cập nhật
            </div>
            <h2 className="max-w-5xl text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">
              Nhịp vận hành mới nhất từ Khiên Hà
            </h2>
          </div>

          <Link
            href="#contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white/72 px-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f172a]/70 shadow-sm backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-primary"
          >
            Kết nối tư vấn
            <ArrowRight className="h-4 w-4" />
          </Link>
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
          Đang hiển thị {filteredNews.length} tin {activeCategory === "all" ? "mới nhất từ toàn bộ chuyên mục" : `thuộc chuyên mục ${activeCategory}`}.
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredNews.map((news, index) => (
            <motion.article
              key={news._id || news.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`group overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/78 shadow-[0_24px_80px_rgba(14,116,144,0.12)] backdrop-blur-2xl ${
                index === 0 ? "xl:col-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                {news.image ? (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#0f172a,#0ea5e9)] text-white">
                    <Ship className="h-14 w-14 opacity-35" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.02),rgba(6,17,31,0.58))]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/14 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                  {news.category}
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary/64">
                  <Calendar className="h-3.5 w-3.5" />
                  {news.date}
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight text-[#0f172a]">{news.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#0f172a]/58">{news.excerpt || news.content}</p>

                <Link
                  href={`/news/${news.slug || news.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary"
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
