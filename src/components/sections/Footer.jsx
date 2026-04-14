"use client";
import React from "react";
import { Ship, Globe, MessageCircle, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Ship className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-heading">KHIÊN HÀ</span>
            </div>
            <p className="max-w-md text-foreground/50 leading-relaxed mb-6">
              Công ty TNHH thương mại Khiên Hà - Đơn vị đóng tàu tư nhân hàng đầu Việt Nam. 
              Chúng tôi luôn nỗ lực mang lại giá trị bền vững cho ngành hàng hải Việt Nam qua từng dự án.
            </p>
            <div className="flex gap-4">
               <a href="#" className="p-3 rounded-full glass hover:bg-primary/20 transition-colors"><Globe className="w-5 h-5" /></a>
               <a href="#" className="p-3 rounded-full glass hover:bg-primary/20 transition-colors"><MessageCircle className="w-5 h-5" /></a>
               <a href="#" className="p-3 rounded-full glass hover:bg-primary/20 transition-colors"><Share2 className="w-5 h-5" /></a>
            </div>
          </div>


          <div>
            <h4 className="font-bold mb-6">Liên kết nhanh</h4>
            <ul className="space-y-4 text-foreground/50">
               <li><a href="#hero" className="hover:text-primary transition-colors">Trang chủ</a></li>
               <li><a href="#about" className="hover:text-primary transition-colors">Giới thiệu</a></li>
               <li><a href="#services" className="hover:text-primary transition-colors">Năng lực</a></li>
               <li><a href="#contact" className="hover:text-primary transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Hỗ trợ</h4>
            <ul className="space-y-4 text-foreground/50">
               <li><a href="#" className="hover:text-primary transition-colors">Tuyển dụng</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Báo cáo dự án</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-sm text-foreground/40">
           © 2024 CÔNG TY TNHH TM KHIÊN HÀ. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
