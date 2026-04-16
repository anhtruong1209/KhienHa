"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function About() {
  const [about, setAbout] = useState(null);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setAbout(data?.about || null);
      setCapabilities((data?.capacity || []).slice(0, 2));
    }

    load();
  }, []);

  return (
    <section id="about" className="section-padding overflow-hidden bg-white">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-primary/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-primary">
              <Sparkles className="h-4 w-4" />
              {about?.eyebrow || "Về chúng tôi"}
            </div>

            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#0f172a] md:text-5xl">
              {about?.title}
            </h2>

            <p className="mt-6 max-w-2xl text-lg font-semibold text-primary/75">{about?.highlight}</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#0f172a]/68">{about?.description}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-slate-100 bg-[#f8fbff] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#0f172a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#0f172a]/56">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative"
          >
            <div className="absolute -top-8 -left-6 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-[#0f172a]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.75rem] border border-white/70 bg-white p-4 shadow-[0_32px_100px_rgba(15,23,42,0.14)]">
              <div className="relative overflow-hidden rounded-[2.25rem]">
                <img src={about?.image} alt="Nhà máy Khiên Hà" className="h-[520px] w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.62))]" />
              </div>

              <div className="absolute left-10 right-10 bottom-10 rounded-[2rem] border border-white/35 bg-white/20 p-6 text-white backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.24em] text-white/90">
                  <BadgeCheck className="h-5 w-5 text-[#7dd3fc]" />
                  {about?.certificateLabel || "ISO 9001:2015"}
                </div>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
                  {about?.certificateText}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-2 rounded-[2rem] border border-white/80 bg-white/72 px-6 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-[#0f172a] p-3 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-3xl font-black text-[#0f172a]">22+</div>
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f172a]/45">
                    Years of experience
                  </div>
                </div>
                <div className="rounded-full border border-slate-200 p-3 text-[#0f172a]">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
