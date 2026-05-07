"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Check, Copy, Ship, User } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import { getNewsItem } from "@/services/api";

export default function NewsDetailClient({ id }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    let active = true;

    async function load() {
      const item = await getNewsItem(id);

      if (!active) {
        return;
      }

      setNews(item);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
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
          <p className="mt-3 text-[#0f172a]/58">Khong tim thay bai viet nay.</p>
          <Link href="/" className="mt-8 inline-flex">
            <Button variant="outline">Quay lai trang chu</Button>
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
            Tro lai danh sach
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
                Ban bien tap
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
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl"
                title="Sao chép liên kết"
                onClick={copyUrl}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chia sẻ Facebook"
              >
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
              </a>
            </div>
          </article>
        </motion.div>
      </div>
    </main>
  );
}
