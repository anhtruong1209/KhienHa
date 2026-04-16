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
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-primary/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
              <Workflow className="h-4 w-4" />
              Quản lý chất lượng
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-[#0f172a] md:text-5xl">
              Quy trình rõ ràng, mục tiêu vận hành nhất quán
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#0f172a]/58">{quality?.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-[#f8fbff] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="overflow-hidden rounded-[2rem]">
              <img src={quality?.mainImage || quality?.image} alt={quality?.title} className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <div className="space-y-5">
            {(quality?.steps || []).map((step, index) => (
              <motion.div
                key={step.id || index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-[2rem] border border-slate-100 bg-[#f8fbff] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">{step.step}</div>
                    <p className="mt-3 text-sm leading-7 text-[#0f172a]/65">{step.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="grid gap-5 md:grid-cols-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,#f8fbff,#ffffff)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-[#0f172a] p-3 text-white">
                    <Flag className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#0f172a]">{goal.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#0f172a]/58">{goal.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
