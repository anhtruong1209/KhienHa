"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor, ArrowRight, Gauge, ShieldCheck, ShipWheel } from "lucide-react";
import { getSiteContent } from "@/services/api";

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
      setCurrent((value) => (value + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  return (
    <section id="hero" className="relative min-h-[88vh] overflow-hidden bg-[#e9f4ff]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.12),_transparent_28%)]" />

      <AnimatePresence mode="wait">
        {banners.length > 0 && (
          <motion.div
            key={banners[current]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img src={banners[current]} alt="Khiên Hà banner" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.88),rgba(255,255,255,0.45),rgba(15,23,42,0.65))]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),transparent)]" />

      <div className="container relative z-10 flex min-h-[88vh] flex-col justify-center py-24 md:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/65 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-primary shadow-[0_18px_80px_rgba(14,165,233,0.15)] backdrop-blur-xl">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(14,165,233,0.8)]" />
              {hero?.eyebrow || "Shipbuilding Since 2002"}
            </div>

            <h1 className="text-2xl font-black uppercase leading-[1.15] tracking-[-0.04em] text-[#0f172a] md:text-5xl xl:text-[3rem]">
              {hero?.titleLine1 || "Năng Lực Đóng Tàu"}
              <span className="text-2xl block bg-[linear-gradient(135deg,#0f172a,#0ea5e9)] bg-clip-text text-transparent tracking-wide py-1 font-size-[2rem]">
                {hero?.titleLine2 || "Vươn Ra Biển Lớn"}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-[#0f172a]/70 md:text-base">{hero?.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={hero?.primaryCtaHref || "#services"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f172a] px-6 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_24px_50px_rgba(15,23,42,0.22)] transition-all hover:bg-primary"
              >
                {hero?.primaryCtaLabel || "Khám phá năng lực"}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={hero?.secondaryCtaHref || "#gallery"}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/80 bg-white/60 px-6 text-[11px] font-black uppercase tracking-[0.18em] text-[#0f172a] shadow-[0_24px_50px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all hover:border-primary/20 hover:text-primary"
              >
                {hero?.secondaryCtaLabel || "Xem dự án tiêu biểu"}
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {(hero?.highlights || []).map((item, index) => (
              <motion.div
                key={`${item.label}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[1.75rem] border border-white/80 bg-white/58 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-2.5 text-primary">
                  {[ShipWheel, Gauge, ShieldCheck][index]
                    ? React.createElement([ShipWheel, Gauge, ShieldCheck][index], { className: "h-5 w-5" })
                    : <Anchor className="h-5 w-5" />}
                </div>
                <div className="text-2xl font-black text-[#0f172a]">{item.label}</div>
                <div className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f172a]/45">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
