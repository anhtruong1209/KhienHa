"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor, ArrowRight, Gauge, ShieldCheck, ShipWheel } from "lucide-react";
import { getSiteContent } from "@/services/api";

const ICONS = [ShipWheel, Gauge, ShieldCheck];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setBanners(data?.banners || []);
      setHero(data?.hero || null);
    }
    load();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((v) => (v + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#060e1a]">
      {/* Ambient glow top-left */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_-10%_10%,rgba(14,165,233,0.18),transparent)]" />

      {/* Banner image with cinematic overlay */}
      <AnimatePresence mode="wait">
        {banners.length > 0 && (
          <motion.div
            key={banners[current]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={banners[current]}
              alt="Khiên Hà banner"
              className="h-full w-full object-cover"
            />
            {/* Cinematic multi-stop gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,14,26,0.72)_0%,rgba(6,14,26,0.52)_38%,rgba(6,14,26,0.18)_65%,rgba(6,14,26,0.38)_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(6,14,26,0.65),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(6,14,26,0.55),transparent)]" />

      {/* Slide indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-[#0ea5e9]" : "w-2 bg-white/25"}`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1760px] flex-col justify-center px-7 py-32 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">

          {/* ── Left: text block ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-white/65 backdrop-blur-xl"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,1)]" />
              {hero?.eyebrow || "Shipbuilding Since 2002"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-[2.6rem] font-black uppercase leading-[1.06] tracking-[-0.035em] text-white md:text-6xl xl:text-[5rem]"
            >
              {hero?.titleLine1 || "Năng Lực Đóng Tàu"}
              <span className="mt-2 block bg-[linear-gradient(130deg,#7dd3fc,#38bdf8,#0ea5e9)] bg-clip-text text-transparent leading-[1.12]">
                {hero?.titleLine2 || "Vươn Ra Biển Lớn"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-7 max-w-[34rem] text-sm font-medium leading-[1.9] text-white/50 md:text-[0.95rem]"
            >
              {hero?.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href={hero?.primaryCtaHref || "#services"}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl bg-[#0ea5e9] px-7 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_0_38px_rgba(14,165,233,0.45)] transition-all hover:bg-[#38bdf8] hover:shadow-[0_0_60px_rgba(14,165,233,0.65)]"
              >
                {hero?.primaryCtaLabel || "Khám phá năng lực"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={hero?.secondaryCtaHref || "#gallery"}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/16 bg-white/7 px-7 text-[11px] font-black uppercase tracking-[0.22em] text-white/75 backdrop-blur-xl transition-all hover:border-[#0ea5e9]/45 hover:bg-white/11 hover:text-white"
              >
                {hero?.secondaryCtaLabel || "Xem dự án tiêu biểu"}
              </a>
            </motion.div>
          </div>

          {/* ── Right: stat cards ── */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {(hero?.highlights || []).map((item, index) => {
              const Icon = ICONS[index] ?? Anchor;
              return (
                <motion.div
                  key={`${item.label}-${index}`}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 + 0.32 }}
                  className="group rounded-[1.5rem] border border-white/9 bg-white/5 p-6 shadow-[0_0_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all hover:border-[#0ea5e9]/30 hover:bg-white/8"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-[#0ea5e9]/12 p-2.5 text-[#38bdf8] transition-colors group-hover:bg-[#0ea5e9]/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[2rem] font-black leading-none text-white">{item.label}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{item.value}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
