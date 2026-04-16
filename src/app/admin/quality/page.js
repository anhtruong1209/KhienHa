"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyCertificateOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Space, Table, Typography, Upload, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function QualityManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [steps, setSteps] = useState([]);
  const [processImage, setProcessImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const siteContent = await getSiteContent(true);
      if (!active) return;

      startTransition(() => {
        setContent(siteContent || {});
        setSteps(siteContent?.quality?.steps || []);
        setProcessImage(siteContent?.quality?.mainImage || siteContent?.quality?.image || "");
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function persist(nextQuality, successMessage) {
    setSaving(true);
    const payload = { ...content, quality: nextQuality };
    const success = await updateSiteContent(payload);

    if (!success) {
      message.error("Không lưu được quy trình chất lượng.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setSteps(nextQuality.steps || []);
      setProcessImage(nextQuality.mainImage || nextQuality.image || "");
    });
    message.success(successMessage);
    setSaving(false);
    return true;
  }

  function handleUpload(info) {
    const file = info.file.originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const nextImage = event.target?.result || "";
      const nextQuality = {
        ...(content.quality || {}),
        image: nextImage,
        mainImage: nextImage,
        steps,
      };
      await persist(nextQuality, "Đã cập nhật sơ đồ quy trình.");
    };
    reader.readAsDataURL(file);
  }

  async function handleDelete(record) {
    const nextSteps = steps.filter((item) => item.id !== record.id);
    const nextQuality = {
      ...(content.quality || {}),
      image: processImage,
      mainImage: processImage,
      steps: nextSteps,
    };
    await persist(nextQuality, "Đã cập nhật các bước kiểm soát.");
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRecord = {
        id: values.id || Date.now(),
        step: values.step,
        title: values.title,
      };

      const nextSteps = values.id
        ? steps.map((item) => (item.id === values.id ? nextRecord : item))
        : [...steps, nextRecord];

      const nextQuality = {
        ...(content.quality || {}),
        image: processImage,
        mainImage: processImage,
        steps: nextSteps,
      };

      const success = await persist(nextQuality, "Đã cập nhật quy trình chất lượng.");
      if (!success) return;

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại nội dung bước quy trình.");
    }
  }

  function openCreateModal() {
    form.resetFields();
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Quality flow"
        icon={<SafetyCertificateOutlined />}
        title="Quy trình chất lượng"
        description="Quản lý sơ đồ quy trình và các bước kiểm soát để phần giới thiệu chất lượng trên website có cấu trúc rõ ràng hơn."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng số bước</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{steps.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Sơ đồ chính</div>
          <div className="mt-4 text-2xl font-black text-slate-900">{processImage ? "Đã có ảnh" : "Chưa có ảnh"}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Vai trò</div>
          <div className="mt-4 text-2xl font-black">Trust section</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Khối này giúp phần giới thiệu doanh nghiệp đáng tin hơn, nên giữ mô tả rõ và ít nhưng chắc.</Text>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
        <Card
          bordered={false}
          className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          extra={
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
              <Button icon={<UploadOutlined />} className="rounded-xl">
                Tải sơ đồ
              </Button>
            </Upload>
          }
        >
          <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Sơ đồ quy trình</Text>
          {processImage ? (
            <div className="mt-4 overflow-hidden rounded-[28px] bg-slate-100">
              <Image src={processImage} alt="Quy trình chất lượng" preview={false} className="max-h-[520px] w-full object-contain" />
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
              Chưa có ảnh sơ đồ quy trình. Hãy tải một ảnh tổng quan để phần này hiển thị đẹp hơn trên frontend.
            </div>
          )}
        </Card>

        <Card
          bordered={false}
          className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          extra={
            <Button type="primary" icon={<PlusOutlined />} className="rounded-xl" onClick={openCreateModal}>
              Thêm bước
            </Button>
          }
        >
          <Table
            rowKey="id"
            loading={loading}
            dataSource={steps}
            pagination={false}
            columns={[
              {
                title: "Bước",
                dataIndex: "step",
                key: "step",
                width: 120,
                render: (value) => <span className="font-semibold text-slate-900">{value}</span>,
              },
              {
                title: "Nội dung kiểm soát",
                dataIndex: "title",
                key: "title",
                render: (value) => <div className="text-sm leading-7 text-slate-600">{value}</div>,
              },
              {
                title: "Thao tác",
                key: "action",
                width: 140,
                render: (_, record) => (
                  <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa bước quy trình" : "Thêm bước quy trình mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu bước"
        cancelText="Hủy"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="step" label="Nhãn bước" rules={[{ required: true, message: "Vui lòng nhập nhãn bước." }]}>
            <Input placeholder="Ví dụ: Bước 1" />
          </Form.Item>
          <Form.Item name="title" label="Mô tả kiểm soát" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}>
            <Input.TextArea rows={5} placeholder="Mô tả rõ bước kiểm soát chất lượng cần hiển thị." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
