"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, History, Award, Globe } from "lucide-react";

const features = [
  {
    icon: <History className="w-8 h-8 text-primary" />,
    title: "Di sản 22 năm",
    description: "Xây dựng niềm tin từ năm 2002 với hàng trăm dự án thành công."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Chứng nhận năng lực",
    description: "Được Cục Đăng Kiểm Việt Nam đánh giá và cấp giấy chứng nhận năng lực."
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Chất lượng hàng đầu",
    description: "Top các công ty đóng tàu tư nhân hàng đầu Việt Nam hiện nay."
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Vươn tầm quốc tế",
    description: "Đóng mới các loại tàu chuyên dụng phục vụ tuyến vận tải quốc tế."
  }
];

export function About() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">Về chúng tôi</h2>
            <h3 className="text-4xl md:text-5xl font-bold font-heading mb-8">
              Khiên Hà - Biểu Tượng Của Ngành <br/> <span className="text-foreground/50">Cơ Khí Đóng Tàu</span>
            </h3>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Công ty TNHH thương mại Khiên Hà tự hào là đơn vị tiên phong trong lĩnh vực đóng mới và sửa chữa tàu thủy tại Hải Phòng. 
              Với đội ngũ lãnh đạo và nhân viên giàu kinh nghiệm, chúng tôi cam kết mang lại những sản phẩm 
              đáp ứng tiêu chuẩn kỹ thuật khắt khe nhất của ngành hàng hải.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col gap-3 p-6 glass-card border-none bg-white/5">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit">
                    {f.icon}
                  </div>
                  <h4 className="font-bold text-lg">{f.title}</h4>
                  <p className="text-sm text-foreground/60">{f.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
             <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-4 border-white/5">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 relative flex items-center justify-center">
                   {/* This would be an abstract industrial image or certificate */}
                   <ShieldCheck className="w-32 h-32 text-primary animate-pulse" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <span className="text-[15rem] font-bold">KH</span>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
