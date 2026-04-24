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

  return (
    <section id="contact" className="relative overflow-hidden bg-[#eaf6ff] py-18 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.12),_transparent_24%)]" />

      <div className="container relative z-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.1rem] border border-white/70 bg-white/68 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.1)] backdrop-blur-2xl md:p-8"
          >
            <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-primary/5 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <ShieldEllipsis className="h-4 w-4" />
              {contact?.eyebrow || "Liên hệ"}
            </div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0f172a]">{contact?.title}</h2>
            <p className="mt-4 text-sm leading-6 text-[#0f172a]/58">{contact?.description}</p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Địa chỉ</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/68">{contact?.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Điện thoại</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/68">
                    {contact?.phone}
                    <br />
                    Hotline: {contact?.hotline}
                    <br />
                    Fax: {contact?.fax}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-[#0f172a]/42">Email</div>
                  <div className="mt-2 text-sm leading-7 text-[#0f172a]/68">{contact?.email}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.1rem] border border-white/70 bg-white/78 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.1)] backdrop-blur-2xl md:p-8"
          >
            <h3 className="text-2xl font-black tracking-[-0.03em] text-[#0f172a]">Gửi yêu cầu tư vấn</h3>
            <p className="mt-3 text-sm leading-6 text-[#0f172a]/58">
              Mô tả ngắn nhu cầu đóng mới, sửa chữa hoặc đại tu để đội ngũ kỹ thuật của chúng tôi phản hồi nhanh hơn.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Họ và tên"
                  className="h-12 rounded-2xl border-white bg-[#f8fbff]"
                />
                <Input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Số điện thoại"
                  className="h-12 rounded-2xl border-white bg-[#f8fbff]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Email"
                  className="h-12 rounded-2xl border-white bg-[#f8fbff]"
                />
                <Input
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="Tên công ty"
                  className="h-12 rounded-2xl border-white bg-[#f8fbff]"
                />
              </div>

              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="h-32 w-full rounded-[1.5rem] border border-white bg-[#f8fbff] p-4 text-sm outline-none transition focus:border-primary/40"
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
                className="h-12 w-full rounded-2xl bg-[#0f172a] text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-primary"
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
