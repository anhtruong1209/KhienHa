"use client";

import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Button, Card, Flex, Form, Image, Input, Modal, Select, Space, Switch, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { deleteNews, getNews, saveNews } from "@/services/api";
import {
  NEWS_CATEGORY_FILTER_OPTIONS,
  NEWS_CATEGORY_OPTIONS,
  getNewsCategoryLabel,
  resolveNewsCategoryValue,
} from "@/data/category-options";

export default function NewsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const deferredSearch = useDeferredValue(search);

  async function loadData() {
    setLoading(true);
    const news = await getNews(true);
    startTransition(() => {
      setData(news || []);
    });
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      category: NEWS_CATEGORY_OPTIONS[0].value,
      date: new Date().toLocaleDateString("vi-VN"),
      is_featured: false,
      is_published: true,
    });
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    setEditingId(record._id);
    form.setFieldsValue({
      ...record,
      category: resolveNewsCategoryValue(record.category),
      excerpt: record.excerpt,
      is_featured: record.is_featured,
      is_published: record.is_published,
    });
    setImageUrl(record.image);
    setIsModalOpen(true);
  }

  function handleUpload(info) {
    const file = info.file.originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const nextImage = event.target?.result || "";
      setImageUrl(nextImage);
      form.setFieldsValue({ image: nextImage });
    };
    reader.readAsDataURL(file);
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa bài viết này?",
      content: "Bài viết sẽ bị gỡ khỏi danh sách tin tức ngoài landing page.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        const success = await deleteNews(record._id);
        if (!success) {
          message.error("Không xóa được bài viết.");
          return;
        }
        message.success("Đã xóa tin tức.");
        loadData();
      },
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const success = await saveNews({
        ...values,
        category: getNewsCategoryLabel(values.category),
        image: imageUrl || values.image,
      });

      if (!success) {
        message.error("Không lưu được bài viết.");
        return;
      }

      message.success(values._id ? "Đã cập nhật bài viết." : "Đã tạo bài viết mới.");
      setIsModalOpen(false);
      form.resetFields();
      setImageUrl("");
      loadData();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setSaving(false);
    }
  }

  const filteredData = data.filter((item) => {
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      keyword.length === 0 ||
      item.title?.toLowerCase().includes(keyword) ||
      item.excerpt?.toLowerCase().includes(keyword) ||
      item.content?.toLowerCase().includes(keyword);
    return matchesSearch;
  });

  const featuredCount = data.filter((item) => item.is_featured).length;
  const publishedCount = data.filter((item) => item.is_published).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]"><div className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Tổng số bài viết</div><div className="mt-2 text-2xl font-bold text-slate-950">{data.length}</div></Card>
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]"><div className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Bài nổi bật</div><div className="mt-2 text-2xl font-bold text-slate-950">{featuredCount}</div></Card>
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]"><div className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">Đang công khai</div><div className="mt-2 text-2xl font-bold text-slate-950">{publishedCount}</div></Card>
      </div>

      <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_240px]">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} prefix={<SearchOutlined className="text-slate-400" />} placeholder="Tìm theo tiêu đề hoặc nội dung" className="h-9 rounded-xl" />
            {/* Category filter removed as requested */}
        </div>

        <Table rowKey="_id" loading={loading} dataSource={filteredData} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 980 }} columns={[
          { title: "Ảnh bìa", dataIndex: "image", key: "image", width: 100, render: (value) => <Image src={value} alt="Ảnh bài viết" preview={false} width={64} height={44} className="rounded-lg object-cover" /> },
          { title: "Bài viết", key: "title", render: (_, record) => <div className="min-w-[260px]"><div className="font-semibold text-slate-900">{record.title}</div><div className="mt-1 line-clamp-2 text-xs leading-6 text-slate-500">{record.excerpt || record.content}</div></div> },
          { title: "Chuyên mục", dataIndex: "category", key: "category", width: 150, render: (value) => <Tag color="blue">{value}</Tag> },
          { title: "Trạng thái", key: "status", width: 170, render: (_, record) => <Flex vertical gap={6}><Tag color={record.is_published ? "green" : "default"}>{record.is_published ? "Đang hiển thị" : "Bản nháp"}</Tag>{record.is_featured ? <Tag color="gold">Nổi bật</Tag> : null}</Flex> },
          { title: "Ngày đăng", dataIndex: "date", key: "date", width: 120 },
          { title: "Thao tác", key: "action", width: 140, render: (_, record) => <Flex gap={8}><Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} /><Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} /></Flex> },
        ]} />

        <div className="mt-5 flex justify-center border-t border-slate-50 pt-5">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className="h-9 rounded-xl bg-slate-900 border-none px-7 font-bold shadow-md hover:!bg-blue-600 uppercase tracking-widest text-[11px]"
          >
            Đăng tin mới
          </Button>
        </div>
      </Card>

      <Modal title={editingId ? "Cập nhật bài viết" : "Tạo bài viết mới"} open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)} okText="Lưu bài viết" cancelText="Hủy" confirmLoading={saving} width={900}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="_id" hidden><Input /></Form.Item>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}><Input placeholder="Nhập tiêu đề bài viết" /></Form.Item>
            <Form.Item name="category" label="Chuyên mục" initialValue="Tin hoạt động">
              <Select options={NEWS_CATEGORY_OPTIONS} />
            </Form.Item>
          </div>
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <Form.Item label="Ảnh bìa">
              <Input type="file" accept="image/*" onChange={(event) => handleUpload({ file: { originFileObj: event.target.files?.[0] } })} />
              {imageUrl ? <Image src={imageUrl} alt="preview" preview={false} className="mt-4 rounded-2xl object-cover" /> : null}
            </Form.Item>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="date" label="Ngày đăng" rules={[{ required: true, message: "Vui lòng nhập ngày đăng." }]}><Input placeholder="Ví dụ: 16/04/2026" /></Form.Item>
                <Form.Item name="excerpt" label="Mô tả ngắn"><Input.TextArea rows={3} placeholder="Đoạn mô tả ngắn dùng cho bảng admin và danh sách tin." /></Form.Item>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="is_featured" label="Đánh dấu nổi bật" valuePropName="checked"><Switch /></Form.Item>
                <Form.Item name="is_published" label="Cho phép hiển thị" valuePropName="checked"><Switch /></Form.Item>
              </div>
            </div>
          </div>
          <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: "Vui lòng nhập nội dung." }]}><Input.TextArea rows={10} placeholder="Nhập nội dung bài viết hiển thị ngoài website." /></Form.Item>
          <Form.Item name="image" hidden><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
