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

  const qualityImage = quality?.mainImage || quality?.image;
  const steps = quality?.steps || [];

  return (
    <section id="quality" className="relative overflow-hidden bg-[#f4fbff] py-18 text-[#0f172a] md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:80px_80px] opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(239,248,255,0.86))]" />

      <div className="relative mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(460px,0.58fr)] xl:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/78 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-xl">
              <Workflow className="h-4 w-4" />
              Quản lý chất lượng
            </div>
            <h2 className="max-w-5xl text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">
              Quy trình rõ ràng, mục tiêu vận hành nhất quán
            </h2>
          </div>
          <p className="rounded-[1.4rem] border border-white/80 bg-white/72 p-5 text-sm leading-7 text-[#0f172a]/64 shadow-[0_18px_60px_rgba(14,116,144,0.09)] backdrop-blur-xl">
            {quality?.description ||
              "Khiên Hà kiểm soát chất lượng từ tiếp nhận vật tư đến bàn giao nhằm bảo đảm độ bền, an toàn và tiến độ dự án."}
          </p>
        </div>

        <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(430px,0.95fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white/72 p-3 shadow-[0_28px_90px_rgba(14,116,144,0.13)] backdrop-blur-2xl"
          >
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.6rem] md:min-h-[560px]">
              {qualityImage ? (
                <img
                  src={qualityImage}
                  alt={quality?.title || "Quản lý chất lượng Khiên Hà"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#071b2f,#0b6aa2)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.02),rgba(6,17,31,0.68))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <div className="mb-4 inline-flex rounded-2xl bg-white/18 p-3 text-cyan-100 backdrop-blur-xl">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <h3 className="max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                  {quality?.title || "Quy trình quản lý chất lượng nhiều lớp"}
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                  Hệ thống kiểm soát được triển khai theo từng công đoạn, từ vật tư đầu vào đến nghiệm thu và bàn giao.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">{steps.length} bước kiểm soát</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">ISO 9001:2015</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id || index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[1.6rem] border border-white/80 bg-white/76 p-5 shadow-[0_22px_70px_rgba(14,116,144,0.10)] backdrop-blur-2xl md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{step.step}</div>
                    <p className="mt-3 text-sm leading-7 text-[#0f172a]/66">{step.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(320px,0.42fr)_minmax(0,1fr)] xl:items-start">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mục tiêu chiến lược</div>
            <h3 className="mt-3 text-2xl font-black leading-tight text-[#0f172a] md:text-3xl">
              Cam kết định hướng dài hạn của Khiên Hà
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-full rounded-[1.6rem] border border-white/80 bg-white/76 p-5 shadow-[0_22px_70px_rgba(14,116,144,0.10)] backdrop-blur-2xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <Flag className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black leading-tight text-[#0f172a]">{goal.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#0f172a]/62">{goal.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
