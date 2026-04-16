"use client";

import React, { useEffect, useState } from "react";
import { AppstoreOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space, Typography, Upload, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function SiteContentManager() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({});
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
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
    }

    load();
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
      setLoading(true);
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

      if (success) {
        setContent(payload);
        message.success("Đã lưu site content.");
      } else {
        message.error("Không lưu được dữ liệu.");
      }
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại biểu mẫu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
            <AppstoreOutlined className="text-primary" /> Site content
          </Title>
          <Text type="secondary" className="text-xs">
            Cập nhật nội dung chính cho landing page gồm company info, hero, about và contact.
          </Text>
        </Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading} className="h-10 rounded-lg">
          Lưu thay đổi
        </Button>
      </div>

      <Form form={form} layout="vertical">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Thông tin công ty" bordered={false} className="shadow-sm">
            <Form.Item name="companyName" label="Tên công ty" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="companyTagline" label="Tagline">
              <Input />
            </Form.Item>
          </Card>

          <Card title="Hero section" bordered={false} className="shadow-sm">
            <Form.Item name="heroTitleLine1" label="Tiêu đề dòng 1" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroTitleLine2" label="Tiêu đề dòng 2" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="heroSubtitle" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Card>

          <Card title="About section" bordered={false} className="shadow-sm">
            <Form.Item name="aboutTitle" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="aboutHighlight" label="Highlight">
              <Input />
            </Form.Item>
            <Form.Item name="aboutDescription" label="Mô tả">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item label="Ảnh đại diện">
              <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
              {aboutImage ? <img src={aboutImage} alt="About" className="mt-4 h-40 rounded-2xl object-cover" /> : null}
            </Form.Item>
          </Card>

          <Card title="Liên hệ" bordered={false} className="shadow-sm">
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
        </div>
      </Form>
    </div>
  );
}
