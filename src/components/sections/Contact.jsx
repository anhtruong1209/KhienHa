"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">Liên hệ</h2>
            <h3 className="text-4xl font-bold font-heading mb-8">Kết Nối Với Chúng Tôi</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="p-4 rounded-2xl glass bg-primary/10">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Trụ sở chính</h4>
                  <p className="text-foreground/60">Xã Chiến Thắng, Huyện An Lão, Hải Phòng, Việt Nam</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-4 rounded-2xl glass bg-primary/10">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Điện thoại / Fax</h4>
                  <p className="text-foreground/60">(+84-31).3903088 | Fax: (+84-31).3903088</p>
                  <p className="text-foreground/60 font-medium">Hotline: 0913 598 034</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-4 rounded-2xl glass bg-primary/10">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-foreground/60">khienhadongtau18@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 glass-card bg-white/5 border-white/5"
          >
             <h4 className="text-2xl font-bold mb-6">Gửi yêu cầu tư vấn</h4>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                   <Input placeholder="Họ và tên" className="h-14 glass bg-transparent border-white/10" />
                   <Input placeholder="Số điện thoại" className="h-14 glass bg-transparent border-white/10" />
                </div>
                <Input placeholder="Email" className="h-14 glass bg-transparent border-white/10" />
                <textarea 
                  className="w-full h-32 p-4 rounded-2xl glass bg-transparent border-white/10 outline-none focus:border-primary/50 transition-colors"
                  placeholder="Nội dung tin nhắn..."
                ></textarea>
                <Button className="w-full h-14 text-lg rounded-2xl font-bold group shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                  Gửi tin nhắn <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
             </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
