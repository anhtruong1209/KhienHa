"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, FlagOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Space, Typography, message } from "antd";
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
      const nextRecord = { id: values.id || Date.now(), title: values.title, content: values.content };
      const nextData = values.id ? data.map((item) => (item.id === values.id ? nextRecord : item)) : [...data, nextRecord];
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
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tổng mục tiêu</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{data.length}</div>
        </Card>
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-500">Độ hoàn thiện</div>
          <div className="mt-2 text-base font-bold text-slate-900 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${data.length >= 3 ? 'bg-green-500' : 'bg-orange-400'}`}></div>
            {data.length >= 3 ? 'Đã tối ưu' : 'Cần thêm mục'}
          </div>
        </Card>
        <Card variant="none" className="rounded-2xl bg-slate-900 text-white shadow-[0_6px_20px_rgba(7,27,47,0.14)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Gợi ý</div>
          <div className="mt-2 text-xs leading-5 text-slate-300">Nên có từ 3 đến 5 mục tiêu để frontend cân đối.</div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {data.map((item, index) => (
          <Card
            key={item.id}
            variant="none"
            loading={loading}
            className="group rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
                  <FlagOutlined className="text-sm" />
                </div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Mục tiêu chiến lược {index + 1}</div>
                <Title level={5} className="!mb-2 !mt-1.5 !text-slate-900 !font-bold !leading-tight">{item.title}</Title>
                <div className="mb-3 text-xs leading-relaxed text-slate-500">{item.content}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="text"
                  shape="circle"
                  icon={<EditOutlined className="text-slate-400" />}
                  onClick={() => openEditModal(item)}
                  className="hover:bg-blue-50"
                />
                <Button
                  type="text"
                  shape="circle"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item)}
                  className="hover:bg-red-50"
                />
              </div>
            </div>
            <div className="mt-2 h-1 w-24 rounded-full bg-slate-50 overflow-hidden">
              <div className="h-full bg-cyan-400 w-1/3 transition-all group-hover:w-full"></div>
            </div>
          </Card>
        ))}
      </div>

      {data.length === 0 && (
        <Card bordered={false} className="rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center shadow-none">
          <FlagOutlined className="text-2xl text-slate-200 mb-3" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chưa có mục tiêu nào được thiết lập</div>
        </Card>
      )}

      <div className="mt-4 flex justify-center border-t border-slate-50 pt-5">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="h-9 rounded-xl bg-slate-900 px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md hover:bg-blue-600"
        >
          Thêm mục tiêu mới
        </Button>
      </div>

      <Modal title={form.getFieldValue("id") ? "Chỉnh sửa mục tiêu" : "Thêm mục tiêu mới"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)} okText="Lưu mục tiêu" cancelText="Hủy" confirmLoading={saving}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}><Input placeholder="Ví dụ: Tầm nhìn 2030" /></Form.Item>
          <Form.Item name="content" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}><Input.TextArea rows={5} placeholder="Mô tả mục tiêu, định hướng hoặc cam kết muốn hiển thị trên website." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
