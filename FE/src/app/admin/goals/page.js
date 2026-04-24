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
    <div className="space-y-8">
      <div style={{ marginTop: "10px" }}>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="none" className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng mục tiêu</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card variant="none" className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-500">Độ hoàn thiện</div>
          <div className="mt-4 text-xl font-black text-slate-900 flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${data.length >= 3 ? 'bg-green-500' : 'bg-orange-400'}`}></div>
            {data.length >= 3 ? 'Đã tối ưu' : 'Cần thêm mục'}
          </div>
        </Card>
        <Card variant="none" className="rounded-[28px] bg-slate-900 text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Gợi ý</div>
          <div className="mt-4 text-sm leading-relaxed text-slate-300">Nên có từ 3 đến 5 mục tiêu để frontend cân đối.</div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {data.map((item, index) => (
          <Card
            key={item.id}
            variant="none"
            loading={loading}
            className="group rounded-[32px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_30px_70px_rgba(15,23,42,0.1)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
                  <FlagOutlined className="text-xl" />
                </div>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Mục tiêu chiến lược {index + 1}</div>
                <Title level={4} className="!mb-3 !mt-2 !text-slate-900 !font-black !leading-tight">{item.title}</Title>
                <div className="mb-4 text-sm leading-relaxed text-slate-500">{item.content}</div>
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
        <Card bordered={false} className="rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/50 p-20 text-center shadow-none">
          <FlagOutlined className="text-4xl text-slate-200 mb-4" />
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chưa có mục tiêu nào được thiết lập</div>
        </Card>
      )}

      <div className="mt-8 flex justify-center border-t border-slate-50 pt-10">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="h-12 rounded-2xl bg-slate-900 px-10 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-600"
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
