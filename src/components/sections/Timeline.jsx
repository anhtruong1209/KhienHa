"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSiteContent } from "@/services/api";
import { History, Milestone } from "lucide-react";

export function Timeline() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      if (data && data.history) {
        setHistory(data.history);
      }
    }
    load();
  }, []);

  if (history.length === 0) return null;

  return (
    <section id="timeline" className="section-padding bg-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-6">
             <span className="w-8 h-[2px] bg-primary" />
             <span className="text-sm font-bold uppercase tracking-widest text-primary">Lịch sử phát triển</span>
             <span className="w-8 h-[2px] bg-primary" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-[#0f172a]">Hành Trình <span className="text-primary italic">Xây Dựng Niềm Tin</span></h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gray-100" />

          <div className="space-y-12">
            {history.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center justify-between w-full ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12" />
                
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#0f172a] border-4 border-white shadow-xl z-10">
                   <Milestone className="w-5 h-5 text-primary" />
                </div>

                <div className="w-full md:w-5/12 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5">
                   <div className="text-3xl font-black text-primary mb-2 italic">{item.year}</div>
                   <h4 className="text-lg font-black text-[#0f172a] mb-4 uppercase tracking-tighter">{item.title}</h4>
                   <p className="text-sm text-foreground/50 leading-relaxed font-medium">
                     {item.content}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
