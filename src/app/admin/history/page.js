"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

function sortHistory(items) {
  return [...items].sort((left, right) => Number(left.year || 0) - Number(right.year || 0));
}

export default function HistoryManager() {
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
        setData(sortHistory(siteContent?.history || []));
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
    const payload = { ...content, history: sortHistory(nextData) };
    const success = await updateSiteContent(payload);

    if (!success) {
      message.error("Không lưu được lịch sử phát triển.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setData(payload.history);
    });
    message.success("Đã cập nhật lịch sử phát triển.");
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
      title: "Xóa cột mốc này?",
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
        year: values.year,
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
      message.error("Vui lòng kiểm tra lại thông tin cột mốc.");
    }
  }

  const firstYear = data[0]?.year || "-";
  const latestYear = data[data.length - 1]?.year || "-";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Company timeline"
        icon={<HistoryOutlined />}
        title="Lịch sử phát triển"
        description="Quản lý các cột mốc doanh nghiệp để hiển thị phần giới thiệu trên website theo đúng dòng thời gian."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} className="h-11 rounded-2xl px-5 font-semibold" onClick={openCreateModal}>
            Thêm cột mốc
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng cột mốc</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Khởi đầu</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{firstYear}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Mốc gần nhất</div>
          <div className="mt-4 text-4xl font-black">{latestYear}</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Timeline được sắp theo năm để frontend hiển thị ổn định và dễ đọc hơn.</Text>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            columns={[
              {
                title: "Năm",
                dataIndex: "year",
                key: "year",
                width: 110,
                render: (value) => <span className="font-bold text-slate-900">{value}</span>,
              },
              {
                title: "Nội dung",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 text-sm leading-7 text-slate-500">{record.content}</div>
                  </div>
                ),
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

        <Card bordered={false} className="rounded-[30px] bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Timeline preview</Text>
          <div className="mt-6 space-y-5">
            {data.map((item, index) => (
              <div key={item.id} className="relative pl-8">
                {index < data.length - 1 ? <div className="absolute left-[10px] top-7 h-[calc(100%+18px)] w-px bg-white/15" /> : null}
                <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-[10px] font-black text-slate-950">
                  {index + 1}
                </div>
                <div className="text-sm font-semibold text-cyan-200">{item.year}</div>
                <div className="mt-1 font-semibold text-white">{item.title}</div>
                <div className="mt-2 text-sm leading-7 text-slate-300">{item.content}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu cột mốc"
        cancelText="Hủy"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: "Vui lòng nhập năm." }]}>
            <Input placeholder="Ví dụ: 2025" />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
            <Input placeholder="Ví dụ: Mở rộng nhà xưởng" />
          </Form.Item>
          <Form.Item name="content" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}>
            <Input.TextArea rows={5} placeholder="Mô tả ngắn gọn ý nghĩa của cột mốc." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
