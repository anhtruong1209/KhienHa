"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function Gallery() {
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      if (data && data.gallery) {
        setImages(data.gallery);
      }
    }
    load();
  }, []);

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container">
        <div className="max-w-xl mb-16">
          <div className="flex items-center gap-2 mb-6">
             <span className="w-8 h-[2px] bg-primary" />
             <span className="text-sm font-bold uppercase tracking-widest text-primary">Hình ảnh hoạt động</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-[#0f172a]">Dự Án <span className="text-primary">Tiêu Biểu</span></h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelected(img)}
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-8">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">{img.category}</span>
                <h4 className="text-xl font-black text-white mb-4">{img.title}</h4>
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-white/10 text-white backdrop-blur-md hover:bg-primary transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-primary transition-colors">
              <X className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selected.url}
              alt={selected.title}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            />
            <div className="absolute bottom-10 left-10 text-white">
               <span className="text-primary font-black uppercase tracking-widest text-xs">{selected.category}</span>
               <h4 className="text-2xl font-black mt-2">{selected.title}</h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
