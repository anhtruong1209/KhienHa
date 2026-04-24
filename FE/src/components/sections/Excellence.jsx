"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Flag, Workflow } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function Excellence() {
  const [quality, setQuality] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setQuality(data?.quality || null);
      setGoals(data?.goals || []);
    }

    load();
  }, []);

  return (
    <section id="quality" className="section-padding bg-white">
      <div className="container">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-primary/5 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Workflow className="h-4 w-4" />
              Quản lý chất lượng
            </div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a] md:text-4xl">
              Quy trình rõ ràng, mục tiêu vận hành nhất quán
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#0f172a]/58">{quality?.description}</p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.1rem] border border-slate-100 bg-[#f8fbff] p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="overflow-hidden rounded-[1.7rem]">
              <img src={quality?.mainImage || quality?.image} alt={quality?.title} className="h-[280px] w-full object-cover md:h-[360px]" />
            </div>

            <div className="mt-4 rounded-[1.7rem] bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div className="mb-3 inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-[#0f172a]">{quality?.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#0f172a]/60">
                Hệ thống kiểm soát chất lượng được triển khai theo từng công đoạn, từ kiểm tra vật tư đầu vào đến nghiệm
                thu và bàn giao.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                <span>{(quality?.steps || []).length} bước kiểm soát</span>
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {(quality?.steps || []).map((step, index) => (
              <motion.div
                key={step.id || index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[1.7rem] border border-slate-100 bg-[#f8fbff] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{step.step}</div>
                    <p className="mt-2.5 text-sm leading-6 text-[#0f172a]/65">{step.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[2.1rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fbff,#ffffff)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Mục tiêu chiến lược</div>
              <h3 className="mt-2.5 text-2xl font-black text-[#0f172a]">Những cam kết định hướng dài hạn của Khiên Hà</h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#0f172a]/58">
              Các mục tiêu được trình bày thành cụm riêng để cân lại bố cục section và giúp người xem đọc rõ hơn từng định
              hướng phát triển.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-full rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-[#0f172a] p-3 text-white">
                  <Flag className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black leading-tight text-[#0f172a]">{goal.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-[#0f172a]/58">{goal.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
