"use client";

import React, { startTransition, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Image, Input, Modal, Table, Typography, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

function toBannerRows(content) {
  return (content?.banners || []).map((url, index) => ({
    id: index + 1,
    title: `Banner ${index + 1}`,
    url,
  }));
}

export default function BannerManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
  const [previewId, setPreviewId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const siteContent = await getSiteContent(true);
      if (!active) return;

      const rows = toBannerRows(siteContent || {});
      startTransition(() => {
        setContent(siteContent || {});
        setData(rows);
        setPreviewId(rows[0]?.id || null);
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const previewItem = useMemo(() => {
    const current = data.find((item) => item.id === previewId) || data[0] || null;
    if (!current) return null;
    if (isModalOpen && editingId === current.id && imageUrl) {
      return { ...current, url: imageUrl, title: form.getFieldValue("title") || current.title };
    }
    return current;
  }, [data, previewId, isModalOpen, editingId, imageUrl, form]);

  function openCreateModal() {
    form.resetFields();
    setEditingId(null);
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setImageUrl(record.url);
    setPreviewId(record.id);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setImageUrl("");
    form.resetFields();
  }

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const nextImage = loadEvent.target?.result || "";
      setImageUrl(nextImage);
      form.setFieldsValue({ url: nextImage });
    };
    reader.readAsDataURL(file);
  }

  async function persist(nextRows, nextPreviewId = nextRows[0]?.id || null) {
    setSaving(true);
    const payload = {
      ...content,
      banners: nextRows.map((item) => item.url),
    };

    const success = await updateSiteContent(payload);
    if (!success) {
      message.error("Không lưu được banner.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setData(nextRows);
      setPreviewId(nextPreviewId);
    });
    message.success("Đã cập nhật banner trang chủ.");
    setSaving(false);
    return true;
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa banner này?",
      content: "Ảnh sẽ bị gỡ khỏi slider ngoài trang chủ sau khi lưu.",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        const nextRows = data
          .filter((item) => item.id !== record.id)
          .map((item, index) => ({ ...item, id: index + 1, title: item.title || `Banner ${index + 1}` }));
        await persist(nextRows, nextRows[0]?.id || null);
      },
    });
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRow = {
        id: values.id || Date.now(),
        title: values.title,
        url: values.url,
      };

      const nextRows = values.id
        ? data.map((item) => (item.id === values.id ? nextRow : item))
        : [...data, nextRow];

      const success = await persist(nextRows, nextRow.id);
      if (!success) return;

      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin banner.");
    }
  }

  const totalCount = data.length;
  const readyCount = data.filter((item) => item.url).length;

  return (
    <div className="space-y-8">
      <div style={{ marginTop: "10px" }}>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="none" className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng số slide</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{totalCount}</div>
        </Card>
        <Card variant="none" className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Sẵn sàng hiển thị</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{readyCount}</div>
        </Card>
        <Card variant="none" className="rounded-[28px] bg-slate-900 text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Thứ tự</div>
          <div className="mt-4 text-sm leading-relaxed text-slate-300">Dòng đầu tiên trong bảng sẽ là slide đầu tiên hiển thị ngoài trang chủ.</div>
        </Card>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Card
          variant="none"
          className="rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          title={<span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Quản lý slide trang chủ</span>}
        >
          <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            onRow={(record) => ({
              onClick: () => setPreviewId(record.id),
            })}
            className="banner-table mt-2"
            columns={[
              {
                title: "Ảnh",
                dataIndex: "url",
                key: "url",
                width: 140,
                render: (value) => <Image src={value} alt="Banner" width={100} height={60} className="rounded-xl object-cover ring-1 ring-slate-100" />,
              },
              {
                title: "Thông tin banner",
                dataIndex: "title",
                key: "title",
                render: (_, record) => (
                  <div className="py-1">
                    <div className="text-sm font-bold text-slate-800">{record.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Đã lưu
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                title: "Thao tác",
                key: "action",
                width: 110,
                align: "right",
                render: (_, record) => (
                  <Flex gap={8}>
                    <Button type="text" shape="circle" icon={<EditOutlined className="text-slate-400" />} onClick={() => openEditModal(record)} className="hover:bg-blue-50" />
                    <Button type="text" shape="circle" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} className="hover:bg-red-50" />
                  </Flex>
                ),
              },
            ]}
          />

          <div className="mt-10 flex flex-col items-center border-t border-slate-50 pt-8">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="h-12 rounded-2xl bg-slate-900 px-8 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-600"
            >
              Thêm banner mới
            </Button>
            <p className="mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Slide nên có kích thước 1920x800px để hiển thị đẹp nhất
            </p>
          </div>
        </Card>

        <Card bordered={false} className="sticky top-8 overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-center gap-2">
            <PictureOutlined className="text-slate-400" />
            <Text className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Xem trước Banner</Text>
          </div>
          {previewItem ? (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] bg-slate-50 p-3 ring-1 ring-slate-100">
                <Image src={previewItem.url} alt={previewItem.title} preview={true} className="h-[240px] w-full rounded-[20px] object-cover shadow-sm" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{previewItem.title}</div>
                <div className="mt-4 rounded-2xl bg-blue-50/50 p-5 ring-1 ring-blue-100/50">
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Tip hiển thị</div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    Phần kịch bản chữ ngoài Landing page sẽ tự động đè lên ảnh này. Hãy chọn ảnh có độ tương phản tốt để chữ dễ đọc hơn.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[32px] border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-400">
              Chọn một banner để xem chi tiết
            </div>
          )}
        </Card>
      </div>

      <Modal
        title={editingId ? "Chỉnh sửa banner" : "Thêm banner mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={closeModal}
        okText="Lưu banner"
        cancelText="Hủy"
        confirmLoading={saving}
        width={640}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Tên banner" rules={[{ required: true, message: "Vui lòng nhập tên banner." }]}>
            <Input placeholder="Ví dụ: Banner giới thiệu nhà máy" />
          </Form.Item>
          <Form.Item label="Ảnh banner">
            <Input type="file" accept="image/*" onChange={handleUpload} className="rounded-xl" />
            {imageUrl ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <Image src={imageUrl} alt="Preview" preview={false} className="h-[180px] w-full object-cover" />
              </div>
            ) : null}
          </Form.Item>
          <Form.Item name="url" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh banner." }]}>
            <Input />
          </Form.Item>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
            Ảnh mới sẽ được gửi về backend và lưu ngay trong payload hiện tại. Nếu đang sửa một banner, preview bên phải sẽ đổi ngay khi bạn chọn file mới.
          </div>
        </Form>
      </Modal>
    </div>
  );
}
