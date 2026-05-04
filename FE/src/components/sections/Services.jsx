"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronRight, Cpu, Users, Wind } from "lucide-react";
import { getSiteContent } from "@/services/api";

const getIcon = (iconName) => {
  switch (iconName) {
    case "Users":
      return <Users className="h-6 w-6" />;
    case "Cpu":
      return <Cpu className="h-6 w-6" />;
    case "Wind":
      return <Wind className="h-6 w-6" />;
    default:
      return <Building2 className="h-6 w-6" />;
  }
};

export function Services() {
  const [capacities, setCapacities] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setCapacities(data?.capacity || []);
    }
    load();
  }, []);

  // Track desktop breakpoint
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sticky scroll: update active index based on scroll position
  useEffect(() => {
    if (!isDesktop || !capacities.length || !sectionRef.current) return;

    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = section.scrollHeight - window.innerHeight;

      if (scrolled <= 0) { setActiveIndex(0); return; }
      if (scrolled >= scrollable) { setActiveIndex(capacities.length - 1); return; }

      const progress = scrolled / scrollable;
      const index = Math.min(Math.floor(progress * capacities.length), capacities.length - 1);
      setActiveIndex(index);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop, capacities]);

  const active = capacities[activeIndex];

  const sectionHeader = (
    <>
      <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Năng lực hoạt động
      </div>
      <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a] md:text-4xl">
        Sức mạnh từ hạ tầng, con người và công nghệ
      </h2>
    </>
  );

  return (
    <div id="services">
      {/* ─── Mobile layout: regular cards ─── */}
      <section className="section-padding bg-[#f7fbff] md:hidden">
        <div className="container">
          <div className="mb-10 max-w-2xl">{sectionHeader}</div>
          <div className="grid gap-6">
            {capacities.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,23,42,0.8))]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/18 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">{getIcon(item.icon)}</div>
                  <h3 className="text-xl font-black text-[#0f172a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#0f172a]/60">{item.detail}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                    Năng lực thực tế
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Desktop layout: sticky scroll ─── */}
      <div
        ref={sectionRef}
        className="relative hidden md:block bg-[#f7fbff]"
        style={isDesktop && capacities.length ? { height: `${(capacities.length + 1) * 100}vh` } : { minHeight: "100vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex">
          {/* Left panel */}
          <div className="flex w-1/2 flex-col justify-between p-12 lg:p-16 xl:p-20">
            {/* Header */}
            <div>{sectionHeader}</div>

            {/* Active item content */}
            <div className="flex-1 flex flex-col justify-center py-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -32 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col"
                >
                  {/* Large step number */}
                  <div
                    className="select-none font-black leading-none text-slate-100"
                    style={{ fontSize: "clamp(80px, 12vw, 160px)" }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </div>

                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                    {active?.category}
                  </div>
                  <h3 className="mt-3 text-2xl font-black leading-tight text-[#0f172a] lg:text-3xl">
                    {active?.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[#0f172a]/60">
                    {active?.detail}
                  </p>

                  <div className="mt-6 inline-flex w-fit items-center gap-3 rounded-2xl bg-primary/10 px-5 py-3 text-primary">
                    {getIcon(active?.icon)}
                    <span className="text-sm font-semibold">{active?.category}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar + counter */}
            <div className="flex items-center gap-3">
              {capacities.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{ background: i === activeIndex ? "#0b6aa2" : "#e2e8f0" }}
                />
              ))}
              <span className="ml-2 shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                {String(activeIndex + 1).padStart(2, "0")} / {String(capacities.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right panel – full-height image */}
          <div className="relative w-1/2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {active?.image && (
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,27,47,0.2)_0%,transparent_40%,rgba(7,27,47,0.75)_100%)]" />

                {/* Image overlay – category badge */}
                <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {active?.category}
                </div>

                {/* Image overlay – stage counter */}
                <div className="absolute right-8 top-8 rounded-xl bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {String(activeIndex + 1).padStart(2, "0")} of {String(capacities.length).padStart(2, "0")}
                </div>

                {/* Image overlay – title at bottom */}
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-xl font-black text-white drop-shadow lg:text-2xl">{active?.title}</h3>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
