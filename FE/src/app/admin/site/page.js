"use client";

import React, { startTransition, useEffect, useState } from "react";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Tag, Typography, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function SiteContentManager() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const data = await getSiteContent(true);
      if (!active) return;

      startTransition(() => {
        setContent(data || {});
        form.setFieldsValue({
          companyName: data?.company?.name,
          companyTagline: data?.company?.tagline,
          heroTitleLine1: data?.hero?.titleLine1,
          heroTitleLine2: data?.hero?.titleLine2,
          heroSubtitle: data?.hero?.subtitle,
          aboutTitle: data?.about?.title,
          aboutHighlight: data?.about?.highlight,
          aboutDescription: data?.about?.description,
          aboutVideoUrl: data?.about?.videoUrl,
          contactTitle: data?.contact?.title,
          contactDescription: data?.contact?.description,
          address: data?.contact?.address,
          phone: data?.contact?.phone,
          hotline: data?.contact?.hotline,
          email: data?.contact?.email,
        });
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [form]);

  async function handleSave() {
    try {
      setSaving(true);
      const values = await form.validateFields();

      const payload = {
        ...content,
        company: {
          ...(content.company || {}),
          name: values.companyName,
          tagline: values.companyTagline,
        },
        hero: {
          ...(content.hero || {}),
          titleLine1: values.heroTitleLine1,
          titleLine2: values.heroTitleLine2,
          subtitle: values.heroSubtitle,
        },
        about: {
          ...(content.about || {}),
          title: values.aboutTitle,
          highlight: values.aboutHighlight,
          description: values.aboutDescription,
          videoUrl: values.aboutVideoUrl || "",
          image: "",
        },
        contact: {
          ...(content.contact || {}),
          title: values.contactTitle,
          description: values.contactDescription,
          address: values.address,
          phone: values.phone,
          hotline: values.hotline,
          email: values.email,
        },
      };

      const success = await updateSiteContent(payload);
      if (!success) {
        message.error("Không lưu được dữ liệu site content.");
        return;
      }

      startTransition(() => {
        setContent(payload);
      });
      message.success("Đã lưu site content.");
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại biểu mẫu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text className="text-xs leading-6 text-slate-500">
            Phần giới thiệu ngoài landing page đã chuyển sang layout không dùng ảnh, nên mục này chỉ còn tiêu đề, highlight và mô tả.
          </Text>

          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} className="h-9 rounded-xl px-4 font-semibold" style={{ flexShrink: 0 }}>
            Lưu thay đổi
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.38fr)_minmax(320px,380px)]">
        <Form form={form} layout="vertical" className="grid gap-4">
          <Card loading={loading} title="Thông tin công ty" variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true, message: "Vui lòng nhập tên công ty." }]}>
                <Input placeholder="CÔNG TY TNHH TM KHIÊN HÀ" />
              </Form.Item>
              <Form.Item name="companyTagline" label="Tagline">
                <Input placeholder="Mô tả ngắn hiển thị ở phần đầu trang" />
              </Form.Item>
            </div>
          </Card>

          <Card loading={loading} title="Hero section" variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item name="heroTitleLine1" label="Tiêu đề dòng 1" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
                <Input />
              </Form.Item>
              <Form.Item name="heroTitleLine2" label="Tiêu đề dòng 2" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
                <Input />
              </Form.Item>
            </div>
            <Form.Item name="heroSubtitle" label="Mô tả">
              <Input.TextArea rows={5} placeholder="Mô tả chính hiển thị ở đầu trang." />
            </Form.Item>
          </Card>

          <Card loading={loading} title="Giới thiệu" variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-6 text-slate-500">
              Section này không còn dùng ảnh giới thiệu. Bạn chỉ cần quản lý phần chữ để landing page hiển thị gọn hơn.
            </div>

            <div className="grid gap-4">
              <Form.Item name="aboutTitle" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
                <Input />
              </Form.Item>
              <Form.Item name="aboutHighlight" label="Dòng nhấn mạnh">
                <Input />
              </Form.Item>
              <Form.Item name="aboutDescription" label="Mô tả">
                <Input.TextArea rows={6} />
              </Form.Item>
              <Form.Item
                name="aboutVideoUrl"
                label="Link YouTube (tuỳ chọn)"
                extra="Dán link YouTube vào đây để nhúng video trực tiếp trong phần Giới thiệu."
              >
                <Input placeholder="https://www.youtube.com/watch?v=..." />
              </Form.Item>
            </div>
          </Card>

          <Card loading={loading} title="Liên hệ" variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <Form.Item name="contactTitle" label="Tiêu đề">
              <Input />
            </Form.Item>
            <Form.Item name="contactDescription" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item name="phone" label="Điện thoại">
                <Input />
              </Form.Item>
              <Form.Item name="hotline" label="Hotline">
                <Input />
              </Form.Item>
            </div>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
          </Card>
        </Form>

        <div className="space-y-4 2xl:sticky 2xl:top-4 2xl:self-start">
          <Card variant="none" className="overflow-hidden rounded-2xl bg-[#071b2f] text-white shadow-[0_10px_30px_rgba(7,27,47,0.18)]">
            <div className="mb-3 flex flex-wrap gap-2">
              <Tag color="cyan" variant="filled">
                Preview
              </Tag>
            </div>
            <Title level={5} className="!mb-1 !text-white">
              {form.getFieldValue("companyName") || content?.company?.name || "Chưa có tên công ty"}
            </Title>
            <Text className="text-xs leading-6 text-slate-300">
              {form.getFieldValue("companyTagline") || content?.company?.tagline || "Tagline sẽ xuất hiện tại đây."}
            </Text>

            <div className="mt-4 rounded-xl bg-white/8 p-3">
              <Text className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Hero preview</Text>
              <div className="mt-2 text-xl font-bold leading-tight text-white">
                <div>{form.getFieldValue("heroTitleLine1") || content?.hero?.titleLine1 || "Tiêu đề hero dòng 1"}</div>
                <div className="text-cyan-200">{form.getFieldValue("heroTitleLine2") || content?.hero?.titleLine2 || "Tiêu đề hero dòng 2"}</div>
              </div>
              <Text className="mt-2 block text-xs leading-6 text-slate-300">
                {form.getFieldValue("heroSubtitle") || content?.hero?.subtitle || "Mô tả hero sẽ hiển thị ở đây."}
              </Text>
            </div>
          </Card>

          <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Giới thiệu preview</Text>
            <Title level={5} className="!mb-1 !mt-3 !text-slate-950">
              {form.getFieldValue("aboutTitle") || content?.about?.title || "Chưa có tiêu đề giới thiệu"}
            </Title>
            <div className="text-xs font-semibold text-[#0b6aa2]">
              {form.getFieldValue("aboutHighlight") || content?.about?.highlight || "Dòng nhấn mạnh sẽ hiển thị ở đây."}
            </div>
            <div className="mt-2 text-xs leading-6 text-slate-500">
              {form.getFieldValue("aboutDescription") || content?.about?.description || "Mô tả giới thiệu sẽ hiển thị ở đây."}
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
              Khối giới thiệu ngoài landing page hiện chỉ dùng text và các card năng lực, không còn ảnh minh họa.
            </div>
          </Card>

          <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Xem nhanh liên hệ</Text>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div>
                <div className="font-semibold text-slate-900">Địa chỉ</div>
                <div>{form.getFieldValue("address") || content?.contact?.address || "-"}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Điện thoại</div>
                <div>{form.getFieldValue("phone") || content?.contact?.phone || "-"}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Hotline</div>
                <div>{form.getFieldValue("hotline") || content?.contact?.hotline || "-"}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Email</div>
                <div>{form.getFieldValue("email") || content?.contact?.email || "-"}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
