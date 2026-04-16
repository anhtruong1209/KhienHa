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
    <footer className="bg-[#0f172a] py-14 text-white">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr_0.9fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                <img src="/logo.png" alt="Khiên Hà" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <div className="text-2xl font-black tracking-[-0.04em]">{company?.shortName || "KHIÊN HÀ"}</div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">
                  {company?.tagline}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-8 text-white/65">{company?.description}</p>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Liên kết nhanh</div>
            <div className="mt-5 space-y-3 text-sm text-white/75">
              <a href="#about" className="block transition-colors hover:text-[#7dd3fc]">
                Giới thiệu
              </a>
              <a href="#services" className="block transition-colors hover:text-[#7dd3fc]">
                Năng lực hoạt động
              </a>
              <a href="#gallery" className="block transition-colors hover:text-[#7dd3fc]">
                Dự án tiêu biểu
              </a>
              <a href="#contact" className="block transition-colors hover:text-[#7dd3fc]">
                Liên hệ
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-[0.24em] text-white/45">Thông tin liên hệ</div>
            <div className="mt-5 space-y-4 text-sm text-white/75">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#7dd3fc]" />
                <span>{contact?.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#7dd3fc]" />
                <span>
                  {contact?.phone}
                  <br />
                  Hotline: {contact?.hotline}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#7dd3fc]" />
                <span>{contact?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/45">
          © 2026 {company?.name || "CÔNG TY TNHH TM KHIÊN HÀ"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
