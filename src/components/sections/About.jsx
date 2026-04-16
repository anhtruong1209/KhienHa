"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function About() {
  const [about, setAbout] = useState(null);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setAbout(data?.about || null);
      setCapabilities((data?.capacity || []).slice(0, 3));
    }

    load();
  }, []);

  return (
    <section id="about" className="section-padding overflow-hidden bg-white">
      <div className="container">
        <div className="rounded-[2.5rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:p-8 xl:p-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] xl:items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-primary/5 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-4 w-4" />
                {about?.eyebrow || "Về chúng tôi"}
              </div>

              <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] text-[#0f172a] md:text-4xl">
                {about?.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base font-semibold text-primary/75">{about?.highlight}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#0f172a]/68">{about?.description}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {capabilities.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.category}</div>
                    <h3 className="mt-2 text-base font-black text-[#0f172a]">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-6 text-[#0f172a]/56">{item.detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="grid gap-4"
            >
              <div className="overflow-hidden rounded-[2rem] bg-[#071b2f] p-6 text-white shadow-[0_24px_70px_rgba(7,27,47,0.18)]">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  <BadgeCheck className="h-4 w-4" />
                  {about?.certificateLabel || "ISO 9001:2015"}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {about?.certificateText || "Hệ thống quản lý chất lượng cho hoạt động đóng mới và sửa chữa tàu thủy."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="rounded-[1.8rem] border border-slate-100 bg-[#f3f8fc] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-[#0b6aa2] shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="mt-5 text-3xl font-black text-[#0f172a]">22+</div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Năm kinh nghiệm</div>
                  <p className="mt-3 text-sm leading-6 text-[#0f172a]/58">
                    Hành trình vận hành liên tục với thế mạnh đóng mới, sửa chữa và hoàn thiện phương tiện thủy.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Điểm nhấn vận hành</div>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#0f172a]/62">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Tối ưu tiến độ bằng năng lực gia công và lắp ráp tại chỗ.</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Kiểm soát chất lượng nhiều lớp trước khi bàn giao.</div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">Đội ngũ kỹ thuật và công nhân lành nghề theo từng hạng mục.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
