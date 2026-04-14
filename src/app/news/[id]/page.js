"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { newsData } from "@/data/news";
import { Navbar } from "@/components/sections/Navbar";
import { Calendar, User, ArrowLeft, Share2, Ship } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const { id } = useParams();
  const news = newsData.find((n) => n.id === parseInt(id));

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">404</h1>
          <p className="text-foreground/50 mb-8">Không tìm thấy bài viết này.</p>
          <Link href="/">
             <Button variant="outline">Quay lại trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-8 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> TRỞ LẠI DANH SÁCH
            </Link>

            <header className="mb-12">
               <div className="flex items-center gap-4 text-xs font-black text-primary/40 uppercase tracking-[0.2em] mb-6">
                  <span className="px-3 py-1 bg-primary/5 rounded-full text-primary">Tin tức hoạt động</span>
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {news.date || "14/04/2026"}</div>
                  <div className="flex items-center gap-1"><User className="w-3 h-3" /> Ban quản trị</div>
               </div>
               
               <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] leading-tight mb-8">
                  {news.title}
               </h1>
               
               <p className="text-xl text-foreground/60 font-medium leading-relaxed italic border-l-4 border-primary pl-8">
                  {news.content.substring(0, 150)}...
               </p>
            </header>

            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden mb-12 bg-[#0f172a] relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-0" />
               <div className="w-full h-full flex items-center justify-center relative z-10">
                  <Ship className="w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
               </div>
               <div className="absolute bottom-10 left-10 p-4 glass-white rounded-2xl border border-white/20">
                  <span className="text-xs font-bold text-[#0f172a]/50 uppercase tracking-widest">Hình ảnh minh họa</span>
               </div>
            </div>

            <article className="prose prose-lg max-w-none text-foreground/80 leading-relaxed font-medium space-y-8">
               <p>{news.content}</p>
               <p>
                 Với kinh nghiệm hơn 20 năm, Khiên Hà luôn cam kết mang đến những sản phẩm đóng tàu chất lượng cao nhất, 
                 đáp ứng các tiêu chuẩn khắt khe nhất của Cục Đăng kiểm Việt Nam và các tổ chức quốc tế.
               </p>
               <div className="p-8 bg-white border border-border rounded-3xl shadow-sm italic text-foreground/60 text-center">
                  "Sự hài lòng của khách hàng là kim chỉ nam cho mọi hoạt động của chúng tôi."
               </div>
               <p>
                 Trong thời gian tới, công ty sẽ tiếp tục đầu tư vào công nghệ CNC và các trang thiết bị hiện đại để nâng cao hơn nữa 
                 năng lực sản xuất, phục vụ các dự án tàu vận tải viễn dương lên tới 25,000 DWT.
               </p>
            </article>

            <footer className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Chia sẻ bài viết:</span>
                  <div className="flex gap-2">
                     {[1,2,3].map(i => (
                        <Button key={i} variant="outline" size="icon" className="rounded-xl border-border hover:bg-primary/5 hover:text-primary transition-all">
                           <Share2 className="w-4 h-4" />
                        </Button>
                     ))}
                  </div>
               </div>
               <Link href="/">
                  <Button className="rounded-xl bg-[#0f172a] hover:bg-primary text-white font-bold h-12 px-8 transition-all">
                     Khám phá thêm thông tin khác
                  </Button>
               </Link>
            </footer>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
