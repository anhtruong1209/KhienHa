"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SafetyCertificateOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Space, Table, Typography, message, Upload } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text } = Typography;

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

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      const nextImage = loadEvent.target?.result || "";
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
    const nextQuality = { ...(content.quality || {}), image: processImage, mainImage: processImage, steps: nextSteps };
    await persist(nextQuality, "Đã cập nhật các bước kiểm soát.");
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRecord = { id: values.id || Date.now(), step: values.step, title: values.title };
      const nextSteps = values.id ? steps.map((item) => (item.id === values.id ? nextRecord : item)) : [...steps, nextRecord];
      const nextQuality = { ...(content.quality || {}), image: processImage, mainImage: processImage, steps: nextSteps };
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
      <div style={{ marginTop: "10px" }}>
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Sơ đồ quy trình Section */}
        <Card
          variant="none"
          className="overflow-hidden rounded-[32px] bg-white shadow-[0_30px_70px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_40px_80px_rgba(15,23,42,0.12)]"
          title={
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <SafetyCertificateOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">Sơ đồ quy trình</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Quality Workflow</div>
              </div>
            </div>
          }
        >
          <div className="relative group">
            {processImage ? (
              <div className="relative mt-2 overflow-hidden rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100 transition-all group-hover:ring-blue-100">
                <Image
                  src={processImage}
                  alt="Quy trình chất lượng"
                  preview={true}
                  className="max-h-[650px] w-full rounded-2xl object-contain shadow-sm"
                />
                <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <label className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white/90 px-5 text-sm font-bold text-slate-900 shadow-xl backdrop-blur-md transition-all hover:bg-white hover:scale-105">
                    <UploadOutlined />
                    <span>Thay đổi sơ đồ</span>
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="mt-2 flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-blue-400 hover:bg-blue-50/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-md">
                  <UploadOutlined className="text-2xl text-blue-500" />
                </div>
                <div className="mt-6 text-center">
                  <div className="text-lg font-bold text-slate-800">Chưa có sơ đồ quy trình</div>
                  <div className="mt-2 text-sm text-slate-400">Kéo thả hoặc nhấp để tải ảnh lên</div>
                </div>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>

          {processImage && (
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <PlusOutlined className="text-xs" />
                </div>
                <span className="text-xs font-semibold text-slate-500">Sơ đồ hiện tại đang được hiển thị ở trang chủ</span>
              </div>
              <label className="cursor-pointer text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700">
                Tải ảnh mới
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          )}
        </Card>

        {/* Các bước kiểm soát Section */}
        <Card
          variant="none"
          className="flex flex-col rounded-[32px] bg-white shadow-[0_30px_70px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_40px_80px_rgba(15,23,42,0.12)]"
          title={
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <EditOutlined className="text-xl" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">Các bước kiểm soát</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Control Steps</div>
              </div>
            </div>
          }
        >
          <Table
            rowKey="id"
            loading={loading}
            dataSource={steps}
            pagination={false}
            className="quality-table mt-2"
            columns={[
              {
                title: "Bước",
                dataIndex: "step",
                key: "step",
                width: 130,
                render: (value) => (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                    <span className="text-xs font-black text-slate-800">{value}</span>
                  </div>
                ),
              },
              {
                title: "Nội dung kiểm soát",
                dataIndex: "title",
                key: "title",
                render: (value) => (
                  <div className="text-sm font-medium leading-relaxed text-slate-600">
                    {value}
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
                    <Button
                      type="text"
                      shape="circle"
                      icon={<EditOutlined className="text-slate-400" />}
                      onClick={() => openEditModal(record)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    />
                    <Button
                      type="text"
                      shape="circle"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(record)}
                      className="hover:bg-red-50"
                    />
                  </Space>
                ),
              },
            ]}
          />

          <div className="mt-10 flex flex-col items-center border-t border-slate-50 pt-8">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="h-12 rounded-2xl bg-[#0f172a] px-8 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_20px_40px_rgba(15,23,42,0.2)] transition-all hover:scale-105 hover:bg-cyan-600"
            >
              Thêm bước kiểm soát mới
            </Button>
            <p className="mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Tối đa 6-8 bước để giao diện frontend cân đối nhất
            </p>
          </div>
        </Card>
      </div>

      <Modal title={form.getFieldValue("id") ? "Chỉnh sửa bước quy trình" : "Thêm bước quy trình mới"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)} okText="Lưu bước" cancelText="Hủy" confirmLoading={saving}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="step" label="Nhãn bước" rules={[{ required: true, message: "Vui lòng nhập nhãn bước." }]}><Input placeholder="Ví dụ: Bước 1" /></Form.Item>
          <Form.Item name="title" label="Mô tả kiểm soát" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}><Input.TextArea rows={5} placeholder="Mô tả rõ bước kiểm soát chất lượng cần hiển thị." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
