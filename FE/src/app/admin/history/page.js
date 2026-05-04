"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Space, Table, Typography, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text } = Typography;

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
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tổng cột mốc</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{data.length}</div>
        </Card>
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Khởi đầu</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{firstYear}</div>
        </Card>
        <Card variant="none" className="rounded-2xl bg-slate-900 text-white shadow-[0_6px_20px_rgba(7,27,47,0.14)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Mốc gần nhất</div>
          <div className="mt-2 text-2xl font-bold">{latestYear}</div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_340px]">
        <Card
          variant="none"
          className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
          title={<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Dòng thời gian phát triển</span>}
        >
          <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            className="history-table"
            columns={[
              {
                title: "Năm",
                dataIndex: "year",
                key: "year",
                width: 100,
                render: (value) => <span className="text-sm font-black text-slate-900">{value}</span>,
              },
              {
                title: "Chi tiết cột mốc",
                key: "content",
                render: (_, record) => (
                  <div className="py-1">
                    <div className="text-sm font-bold text-slate-800">{record.title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">{record.content}</div>
                  </div>
                ),
              },
              {
                title: "Thao tác",
                key: "action",
                width: 110,
                align: "right",
                render: (_, record) => (
                  <Space>
                    <Button type="text" shape="circle" icon={<EditOutlined className="text-slate-400" />} onClick={() => openEditModal(record)} className="hover:bg-blue-50" />
                    <Button type="text" shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} className="hover:bg-red-50" />
                  </Space>
                ),
              },
            ]}
          />

          <div className="mt-5 flex justify-center border-t border-slate-50 pt-5">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="h-9 rounded-xl bg-[#0f172a] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md hover:bg-blue-600"
            >
              Thêm cột mốc mới
            </Button>
          </div>
        </Card>

        <Card variant="none" className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
          <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Timeline preview</Text>
          <div className="mt-4 space-y-4">
            {data.map((item, index) => (
              <div key={item.id} className="relative pl-10">
                {index < data.length - 1 ? <div className="absolute left-[11px] top-6 h-[calc(100%+24px)] w-0.5 bg-white/10" /> : null}
                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/20 text-[10px] font-black text-cyan-300 ring-1 ring-cyan-400/30">
                  {index + 1}
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400/80">{item.year}</div>
                <div className="mt-1 text-sm font-bold text-white">{item.title}</div>
                <div className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{item.content}</div>
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
