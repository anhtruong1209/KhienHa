"use client";

import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Button, Card, Form, Image, Input, Modal, Select, Space, Switch, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { deleteNews, getNews, saveNews } from "@/services/api";

export default function NewsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    form.resetFields();
    form.setFieldsValue({
      date: new Date().toLocaleDateString("vi-VN"),
      is_featured: false,
      is_published: true,
    });
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue({
      ...record,
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
    const matchesCategory = categoryFilter === "all" ? true : item.category === categoryFilter;
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      keyword.length === 0 ||
      item.title?.toLowerCase().includes(keyword) ||
      item.excerpt?.toLowerCase().includes(keyword) ||
      item.content?.toLowerCase().includes(keyword);
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(data.map((item) => item.category).filter(Boolean)));
  const featuredCount = data.filter((item) => item.is_featured).length;
  const publishedCount = data.filter((item) => item.is_published).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="News manager"
        icon={<FileTextOutlined />}
        title="Quản lý tin tức"
        description="Lọc nhanh, chỉnh bài và kiểm soát trạng thái hiển thị của danh sách tin trên website."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={openCreateModal} className="h-11 rounded-2xl px-5 font-semibold">
            Đăng tin mới
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng số bài viết</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Bài nổi bật</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{featuredCount}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Đang công khai</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{publishedCount}</div>
        </Card>
      </div>

      <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_240px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            className="h-11 rounded-2xl"
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="h-11"
            options={[
              { label: "Tất cả chuyên mục", value: "all" },
              ...categories.map((item) => ({ label: item, value: item })),
            ]}
          />
        </div>

        <Table
          rowKey="_id"
          loading={loading}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 980 }}
          columns={[
            {
              title: "Ảnh bìa",
              dataIndex: "image",
              key: "image",
              width: 120,
              render: (value) => (
                <Image
                  src={value}
                  alt="Ảnh bài viết"
                  preview={false}
                  width={76}
                  height={56}
                  className="rounded-2xl object-cover"
                />
              ),
            },
            {
              title: "Bài viết",
              key: "title",
              render: (_, record) => (
                <div className="min-w-[260px]">
                  <div className="font-semibold text-slate-900">{record.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs leading-6 text-slate-500">{record.excerpt || record.content}</div>
                </div>
              ),
            },
            {
              title: "Chuyên mục",
              dataIndex: "category",
              key: "category",
              width: 150,
              render: (value) => <Tag color="blue">{value}</Tag>,
            },
            {
              title: "Trạng thái",
              key: "status",
              width: 170,
              render: (_, record) => (
                <Space direction="vertical" size={6}>
                  <Tag color={record.is_published ? "green" : "default"}>{record.is_published ? "Đang hiển thị" : "Bản nháp"}</Tag>
                  {record.is_featured ? <Tag color="gold">Nổi bật</Tag> : null}
                </Space>
              ),
            },
            {
              title: "Ngày đăng",
              dataIndex: "date",
              key: "date",
              width: 120,
            },
            {
              title: "Thao tác",
              key: "action",
              width: 140,
              render: (_, record) => (
                <Space size="small">
                  <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={form.getFieldValue("_id") ? "Cập nhật bài viết" : "Tạo bài viết mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu bài viết"
        cancelText="Hủy"
        confirmLoading={saving}
        width={900}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>

          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>
            <Form.Item name="category" label="Chuyên mục" initialValue="Tin hoạt động">
              <Input placeholder="Ví dụ: Bàn giao, Hạ thủy, Đầu tư" />
            </Form.Item>
          </div>

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <Form.Item label="Ảnh bìa">
              <Input type="file" accept="image/*" onChange={(event) => handleUpload({ file: { originFileObj: event.target.files?.[0] } })} />
              {imageUrl ? (
                <Image src={imageUrl} alt="preview" preview={false} className="mt-4 rounded-2xl object-cover" />
              ) : null}
            </Form.Item>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="date" label="Ngày đăng" rules={[{ required: true, message: "Vui lòng nhập ngày đăng." }]}>
                  <Input placeholder="Ví dụ: 16/04/2026" />
                </Form.Item>
                <Form.Item name="excerpt" label="Mô tả ngắn">
                  <Input.TextArea rows={3} placeholder="Đoạn mô tả ngắn dùng cho bảng admin và danh sách tin." />
                </Form.Item>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="is_featured" label="Đánh dấu nổi bật" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name="is_published" label="Cho phép hiển thị" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </div>

          <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: "Vui lòng nhập nội dung." }]}>
            <Input.TextArea rows={10} placeholder="Nhập nội dung bài viết hiển thị ngoài website." />
          </Form.Item>

          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
