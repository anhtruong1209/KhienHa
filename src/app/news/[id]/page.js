"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Share2, Ship, User } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import { getNewsItem } from "@/services/api";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const item = await getNewsItem(id);
      setNews(item);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#0f172a]">404</h1>
          <p className="mt-3 text-[#0f172a]/58">Không tìm thấy bài viết này.</p>
          <Link href="/" className="mt-8 inline-flex">
            <Button variant="outline">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff]">
      <Navbar />

      <div className="container max-w-5xl pb-20 pt-32">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Trở lại danh sách
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-[0.22em] text-primary/70">
              <span className="rounded-full bg-primary/5 px-3 py-2 text-primary">{news.category}</span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {news.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                Ban biên tập
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#0f172a] md:text-6xl">{news.title}</h1>
            <p className="mt-8 border-l-4 border-primary pl-6 text-lg leading-8 text-[#0f172a]/62">
              {news.excerpt || news.content}
            </p>
          </header>

          <div className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            {news.image ? (
              <img src={news.image} alt={news.title} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#0f172a,#0ea5e9)]">
                <Ship className="h-24 w-24 text-white/20" />
              </div>
            )}
          </div>

          <article className="mt-12 rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-10">
            <div className="whitespace-pre-line text-base leading-8 text-[#0f172a]/72">{news.content}</div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-8">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Chia sẻ</div>
              {[1, 2, 3].map((item) => (
                <Button key={item} variant="outline" size="icon" className="rounded-2xl">
                  <Share2 className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </article>
        </motion.div>
      </div>
    </main>
  );
}
