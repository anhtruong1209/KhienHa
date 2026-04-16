"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Milestone } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function Timeline() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setHistory(data?.history || []);
    }

    load();
  }, []);

  if (!history.length) return null;

  return (
    <section id="timeline" className="section-padding bg-[#eef7ff]">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/80 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Lịch sử phát triển
          </div>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a] md:text-4xl">
            Hành trình xây dựng năng lực và niềm tin
          </h2>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(14,165,233,0.05),rgba(14,165,233,0.45),rgba(14,165,233,0.05))] md:block" />

          <div className="space-y-6">
            {history.map((item, index) => {
              const reverse = index % 2 === 1;

              return (
                <motion.div
                  key={item.id || `${item.year}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`relative grid items-center gap-5 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="hidden justify-center md:flex">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-8 border-[#eef7ff] bg-[#0f172a] text-primary shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                      <Milestone className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="rounded-[1.9rem] border border-white/80 bg-white/82 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">{item.year}</div>
                    <h3 className="mt-2.5 text-xl font-black text-[#0f172a]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#0f172a]/62">{item.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
