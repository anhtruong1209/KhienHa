"use client";
import React from "react";
import { motion } from "framer-motion";
import { newsData } from "@/data/news";
import { Calendar, ArrowRight, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function News() {
  return (
    <section id="news" className="section-padding bg-[#f8fafc]">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-[2px] bg-primary" />
               <span className="text-sm font-bold uppercase tracking-widest text-primary">Media & Resources</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black font-heading text-[#0f172a]">Thông Tin <span className="text-primary">Mới Nhất</span></h3>
          </div>
          <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 gap-2 px-6 h-12 rounded-xl">
            Xem tất cả bài viết <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news, i) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-3xl border border-border p-4 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#f1f5f9] relative mb-6">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                 <div className="w-full h-full flex items-center justify-center">
                    <Ship className="w-12 h-12 text-primary/10 group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 rounded-lg text-[9px] font-black text-primary uppercase tracking-tighter">
                   {news.category || "HÀNG HẢI"}
                 </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 mb-3 uppercase tracking-widest">
                  <Calendar className="w-3 h-3 text-primary/40" /> {news.date}
                </div>
                <h4 className="text-lg font-black mb-3 text-[#0f172a] group-hover:text-primary transition-colors leading-tight">
                  {news.title}
                </h4>
                <p className="text-xs text-foreground/50 line-clamp-2 mb-6 font-medium leading-relaxed">
                  {news.content}
                </p>
                <Link href={`/news/${news.id}`} className="mt-auto inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                  CHI TIẾT <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
