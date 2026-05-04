"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ShieldEllipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSiteContent, submitContact } from "@/services/api";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  company: "",
  message: "",
};

export function Contact() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setContact(data?.contact || null);
    }

    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await submitContact(form);
      setFeedback({ type: "success", message: result.message || "Đã gửi yêu cầu thành công." });
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Không gửi được yêu cầu. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const inputClass =
    "h-12 rounded-2xl border-sky-100 bg-white/82 text-[#0f172a] placeholder:text-[#0f172a]/38 focus-visible:border-primary/35 focus-visible:ring-primary/12";

  return (
    <section id="contact" className="relative overflow-hidden bg-[#eef8ff] py-18 text-[#0f172a] md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.07)_1px,transparent_1px)] bg-[size:88px_88px] opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.66),rgba(239,248,255,0.9))]" />

      <div className="relative mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(380px,0.72fr)_minmax(0,1.28fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/80 bg-white/74 p-6 shadow-[0_28px_90px_rgba(14,116,144,0.12)] backdrop-blur-2xl md:p-8"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white/78 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-xl">
              <ShieldEllipsis className="h-4 w-4" />
              {contact?.eyebrow || "Liên hệ"}
            </div>
            <h2 className="text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">{contact?.title || "Kết nối với Khiên Hà"}</h2>
            <p className="mt-5 text-sm leading-7 text-[#0f172a]/64">
              {contact?.description || "Gửi nhu cầu đóng mới, sửa chữa hoặc tư vấn kỹ thuật để đội ngũ chúng tôi phản hồi nhanh chóng."}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="flex items-start gap-4 rounded-[1.4rem] border border-sky-100 bg-white/64 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Địa chỉ</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/66">{contact?.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-[1.4rem] border border-sky-100 bg-white/64 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Điện thoại</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/66">
                    {contact?.phone}
                    <br />
                    Hotline: {contact?.hotline}
                    <br />
                    Fax: {contact?.fax}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-[1.4rem] border border-sky-100 bg-white/64 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Email</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/66">{contact?.email}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-[0_28px_90px_rgba(14,116,144,0.12)] backdrop-blur-2xl md:p-8 xl:p-10"
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.64fr)_minmax(320px,0.36fr)] xl:items-start">
              <div>
                <h3 className="text-2xl font-black leading-tight text-[#0f172a] md:text-4xl">Gửi yêu cầu tư vấn</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#0f172a]/60">
                  Mô tả ngắn nhu cầu đóng mới, sửa chữa hoặc đại tu để đội ngũ kỹ thuật phản hồi nhanh hơn.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-sky-100 bg-sky-50/80 p-5 text-sm leading-7 text-[#0f172a]/64">
                Ưu tiên thông tin về loại tàu, tải trọng, tiến độ mong muốn và hạng mục cần xử lý.
              </div>
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Họ và tên"
                  className={inputClass}
                />
                <Input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Số điện thoại"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Email"
                  className={inputClass}
                />
                <Input
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="Tên công ty"
                  className={inputClass}
                />
              </div>

              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="h-40 w-full rounded-[1.5rem] border border-sky-100 bg-white/82 p-4 text-sm text-[#0f172a] outline-none transition placeholder:text-[#0f172a]/38 focus:border-primary/35 focus:ring-3 focus:ring-primary/12"
                placeholder="Nội dung yêu cầu..."
              />

              {feedback && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-2xl bg-[#0f172a] text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] hover:bg-primary"
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
