"use client";

import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteContent } from "@/services/api";

export function Footer() {
  const [company, setCompany] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setCompany(data?.company || null);
      setContact(data?.contact || null);
    }

    load();
  }, []);

  return (
    <footer className="relative overflow-hidden bg-[#f7fbff] py-8 text-[#0f172a]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,116,144,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-55" />

      <div className="relative mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="rounded-[2rem] border border-white/80 bg-white/76 p-6 shadow-[0_28px_90px_rgba(14,116,144,0.11)] backdrop-blur-2xl md:p-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr] xl:gap-12">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100 bg-white/82 shadow-sm">
                  <img src="/logo.png" alt="Khiên Hà" className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <div className="text-2xl font-black">{company?.shortName || "KHIÊN HÀ"}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary/62">{company?.tagline}</div>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-[#0f172a]/62">{company?.description}</p>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/62">Liên kết nhanh</div>
              <div className="mt-5 grid gap-3 text-sm text-[#0f172a]/70">
                <a href="#about" className="transition-colors hover:text-primary">Giới thiệu</a>
                <a href="#services" className="transition-colors hover:text-primary">Năng lực hoạt động</a>
                <a href="#gallery" className="transition-colors hover:text-primary">Dự án tiêu biểu</a>
                <a href="#contact" className="transition-colors hover:text-primary">Liên hệ</a>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/62">Thông tin liên hệ</div>
              <div className="mt-5 space-y-4 text-sm text-[#0f172a]/70">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{contact?.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {contact?.phone}
                    <br />
                    Hotline: {contact?.hotline}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{contact?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-5 text-sm text-[#0f172a]/45 md:flex-row md:items-center md:justify-between">
            <div>© 2026 {company?.name || "KHIEN HA CO., LTD"}. All rights reserved.</div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/48">Shipbuilding and repair partner</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
