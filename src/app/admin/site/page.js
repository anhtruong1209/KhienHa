"use client";

import React, { startTransition, useEffect, useState } from "react";
import { AppstoreOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Tag, Typography, Upload, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function SiteContentManager() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const data = await getSiteContent(true);
      if (!active) return;

      startTransition(() => {
        setContent(data || {});
        setAboutImage(data?.about?.image || "");
        form.setFieldsValue({
          companyName: data?.company?.name,
          companyTagline: data?.company?.tagline,
          heroTitleLine1: data?.hero?.titleLine1,
          heroTitleLine2: data?.hero?.titleLine2,
          heroSubtitle: data?.hero?.subtitle,
          aboutTitle: data?.about?.title,
          aboutHighlight: data?.about?.highlight,
          aboutDescription: data?.about?.description,
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

  function handleUpload(info) {
    const file = info.file.originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAboutImage(event.target?.result || "");
    };
    reader.readAsDataURL(file);
  }

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
          image: aboutImage || content?.about?.image,
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage content"
        icon={<AppstoreOutlined />}
        title="Site content"
        description="Chỉnh nhanh các khối quan trọng ngoài landing page và xem trước nội dung đang chuẩn bị xuất bản."
        actions={[
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} className="h-11 rounded-2xl px-5 font-semibold">
            Lưu thay đổi
          </Button>,
        ]}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.38fr)_minmax(360px,420px)]">
        <Form form={form} layout="vertical" className="grid gap-6">
          <Card loading={loading} title="Thông tin công ty" bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true, message: "Vui lòng nhập tên công ty." }]}>
                <Input placeholder="CÔNG TY TNHH TM KHIÊN HÀ" />
              </Form.Item>
              <Form.Item name="companyTagline" label="Tagline">
                <Input placeholder="Mô tả ngắn hiển thị ở phần đầu trang" />
              </Form.Item>
            </div>
          </Card>

          <Card loading={loading} title="Hero section" bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
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

          <Card loading={loading} title="Giới thiệu" bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
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
              <Form.Item label="Ảnh giới thiệu">
                <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
                  <Button className="rounded-xl">Chọn ảnh mới</Button>
                </Upload>
                {aboutImage ? <img src={aboutImage} alt="About" className="mt-4 h-52 w-full rounded-3xl object-cover" /> : null}
              </Form.Item>
            </div>
          </Card>

          <Card loading={loading} title="Liên hệ" bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
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

        <div className="space-y-6 2xl:sticky 2xl:top-5 2xl:self-start">
          <Card bordered={false} className="overflow-hidden rounded-[30px] bg-[#071b2f] text-white shadow-[0_24px_70px_rgba(7,27,47,0.22)]">
            <div className="mb-5 flex flex-wrap gap-2">
              <Tag color="cyan" variant="filled">
                Preview
              </Tag>
              <Tag color="blue" variant="filled">
                MySQL local
              </Tag>
            </div>
            <Title level={4} className="!mb-1 !text-white">
              {form.getFieldValue("companyName") || content?.company?.name || "Chưa có tên công ty"}
            </Title>
            <Text className="text-sm leading-7 text-slate-300">
              {form.getFieldValue("companyTagline") || content?.company?.tagline || "Tagline sẽ xuất hiện tại đây."}
            </Text>

            <div className="mt-6 rounded-[24px] bg-white/8 p-4">
              <Text className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">Hero preview</Text>
              <div className="mt-3 text-[28px] font-black leading-tight text-white">
                <div>{form.getFieldValue("heroTitleLine1") || content?.hero?.titleLine1 || "Tiêu đề hero dòng 1"}</div>
                <div className="text-cyan-200">{form.getFieldValue("heroTitleLine2") || content?.hero?.titleLine2 || "Tiêu đề hero dòng 2"}</div>
              </div>
              <Text className="mt-3 block text-sm leading-7 text-slate-300">
                {form.getFieldValue("heroSubtitle") || content?.hero?.subtitle || "Mô tả hero sẽ hiển thị ở đây."}
              </Text>
            </div>
          </Card>

          <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Xem nhanh liên hệ</Text>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
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
