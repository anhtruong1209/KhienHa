"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, FlagOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Space, Typography, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function GoalsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
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
        setData(siteContent?.goals || []);
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function persist(nextData) {
    setSaving(true);
    const payload = { ...content, goals: nextData };
    const success = await updateSiteContent(payload);

    if (!success) {
      message.error("Không lưu được mục tiêu chiến lược.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setData(nextData);
    });
    message.success("Đã cập nhật mục tiêu chiến lược.");
    setSaving(false);
    return true;
  }

  function openCreateModal() {
    form.resetFields();
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
    setIsModalOpen(true);
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa mục tiêu này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        await persist(data.filter((item) => item.id !== record.id));
      },
    });
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRecord = {
        id: values.id || Date.now(),
        title: values.title,
        content: values.content,
      };

      const nextData = values.id
        ? data.map((item) => (item.id === values.id ? nextRecord : item))
        : [...data, nextRecord];

      const success = await persist(nextData);
      if (!success) return;

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin mục tiêu.");
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Strategic goals"
        icon={<FlagOutlined />}
        title="Mục tiêu chiến lược"
        description="Quản lý các khối tầm nhìn, sứ mệnh và cam kết để phần giới thiệu thương hiệu ngoài frontend có định hướng rõ ràng hơn."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} className="h-11 rounded-2xl px-5 font-semibold" onClick={openCreateModal}>
            Thêm mục tiêu
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng mục tiêu</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Thẻ dài nhất</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{Math.max(...data.map((item) => item.content?.length || 0), 0)}</div>
          <Text className="mt-2 block text-sm text-slate-500">Số ký tự mô tả lớn nhất hiện có.</Text>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Gợi ý hiển thị</div>
          <div className="mt-4 text-2xl font-black">3 - 5 khối nổi bật</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Phần ngoài frontend đẹp nhất khi giữ số lượng vừa phải nhưng nội dung súc tích và rõ thông điệp.</Text>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {data.map((item, index) => (
          <Card key={item.id} bordered={false} loading={loading} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Goal {index + 1}</div>
                <Title level={4} className="!mb-2 !mt-3 !text-slate-900">
                  {item.title}
                </Title>
              </div>
              <Space>
                <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(item)} />
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item)} />
              </Space>
            </div>
            <Text className="text-sm leading-7 text-slate-500">{item.content}</Text>
          </Card>
        ))}
      </div>

      {data.length === 0 ? (
        <Card bordered={false} className="rounded-[30px] border border-dashed border-slate-200 bg-slate-50 shadow-none">
          <div className="py-12 text-center text-sm text-slate-500">Chưa có mục tiêu chiến lược nào. Hãy tạo mục đầu tiên để phần giới thiệu ngoài frontend đầy đặn hơn.</div>
        </Card>
      ) : null}

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu mục tiêu"
        cancelText="Hủy"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
            <Input placeholder="Ví dụ: Tầm nhìn 2030" />
          </Form.Item>
          <Form.Item name="content" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}>
            <Input.TextArea rows={5} placeholder="Mô tả mục tiêu, định hướng hoặc cam kết muốn hiển thị trên website." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
