"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, Play, ShieldCheck, Sparkles } from "lucide-react";
import { getSiteContent } from "@/services/api";

function cleanYouTubeId(value) {
  return value ? value.replace(/[^a-zA-Z0-9_-]/g, "") : null;
}

function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return cleanYouTubeId(parsed.pathname.split("/").filter(Boolean)[0]);
    }

    if (host.endsWith("youtube.com")) {
      const videoParam = parsed.searchParams.get("v");
      if (videoParam) return cleanYouTubeId(videoParam);

      const [type, id] = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(type)) return cleanYouTubeId(id);
    }
  } catch {
    const match = url.match(/(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^&?/\s]+)/);
    return match ? cleanYouTubeId(match[1]) : null;
  }

  return null;
}

export function About() {
  const [about, setAbout] = useState(null);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setAbout(data?.about || null);
      setCapabilities((data?.capacity || []).slice(0, 3));
    }
    load();
  }, []);

  const videoId = getYouTubeId(about?.videoUrl);
  const videoEmbedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <section id="about" className="section-padding overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)]">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(580px,1.18fr)] xl:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="py-2 xl:py-8"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-4 w-4" />
              {about?.eyebrow || "Về chúng tôi"}
            </div>

            <h2 className="max-w-4xl text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">
              {about?.title || "Nhà máy đóng tàu tư nhân hàng đầu khu vực phía Bắc"}
            </h2>

            <p className="mt-5 max-w-3xl text-lg font-bold leading-8 text-primary/78">
              {about?.highlight || "Hạ tầng lớn, kỹ thuật mạnh, kiểm soát chất lượng chặt."}
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-[#0f172a]/68">
              {about?.description ||
                "Khiên Hà đầu tư đồng bộ từ công nghệ cắt CNC, thiết bị nâng hạ trọng tải lớn, hệ thống bắn cát phun sơn đến đội ngũ kỹ sư và thợ lành nghề nhằm bảo đảm hiệu quả thi công cho từng dự án."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200/75 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#071b2f] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  <BadgeCheck className="h-4 w-4" />
                  {about?.certificateLabel || "ISO 9001:2015"}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#0f172a]/62">
                  {about?.certificateText || "Hệ thống quản lý chất lượng cho hoạt động đóng mới và sửa chữa tàu thủy."}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200/75 bg-[#eef6fb] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <div className="inline-flex rounded-2xl bg-white p-3 text-[#0b6aa2] shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="mt-4 text-4xl font-black text-[#0f172a]">22+</div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Năm kinh nghiệm</div>
                <p className="mt-3 text-sm leading-7 text-[#0f172a]/62">
                  Vận hành liên tục với thế mạnh đóng mới, sửa chữa và hoàn thiện phương tiện thủy.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] bg-[#071b2f] p-3 shadow-[0_28px_90px_rgba(7,27,47,0.22)]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1 text-white">
              <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Video giới thiệu
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                Khiên Hà
              </span>
            </div>

            <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-slate-950">
              {videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title="Video giới thiệu Khiên Hà"
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#071b2f,#0b6aa2)] px-6 text-center text-sm font-semibold leading-7 text-white/78">
                  Video giới thiệu sẽ hiển thị tại đây khi có link YouTube.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="h-full rounded-[1.5rem] border border-slate-200/75 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.category}</div>
              <h3 className="mt-3 max-w-xl text-xl font-black leading-7 text-[#0f172a]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#0f172a]/58">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
