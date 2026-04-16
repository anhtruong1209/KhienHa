"use client";

import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, FileImageOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Image, Input, Modal, Select, Space, Table, Tag, Typography, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";
import {
  GALLERY_CATEGORY_FILTER_OPTIONS,
  GALLERY_CATEGORY_OPTIONS,
  getGalleryCategoryLabel,
  resolveGalleryCategoryValue,
} from "@/data/category-options";

const { Text, Title } = Typography;

export default function GalleryManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const siteContent = await getSiteContent(true);
      if (!active) return;

      const gallery = siteContent?.gallery || [];
      startTransition(() => {
        setContent(siteContent || {});
        setData(gallery);
        setSelectedId(gallery[0]?.id || null);
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const categoryOptions = GALLERY_CATEGORY_FILTER_OPTIONS;

  const filteredData = data.filter((item) => {
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch = keyword.length === 0 || [item.title, item.category, item.url].some((value) => value?.toLowerCase().includes(keyword));
    return matchesSearch;
  });

  const selectedItem = useMemo(() => {
    const current = filteredData.find((item) => item.id === selectedId) || filteredData[0] || null;
    if (!current) return null;
    if (isModalOpen && editingId === current.id) {
      return {
        ...current,
        url: imageUrl || current.url,
        title: form.getFieldValue("title") || current.title,
        category: getGalleryCategoryLabel(form.getFieldValue("category") || current.category),
      };
    }
    return current;
  }, [filteredData, selectedId, isModalOpen, editingId, imageUrl, form]);

  const categoryCount = new Set(data.map((item) => item.category)).size;

  function openCreateModal() {
    form.resetFields();
    form.setFieldsValue({ category: GALLERY_CATEGORY_OPTIONS[0].value });
    setEditingId(null);
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue({
      ...record,
      category: resolveGalleryCategoryValue(record.category),
    });
    setEditingId(record.id);
    setImageUrl(record.url);
    setSelectedId(record.id);
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

  async function persist(nextData, nextSelectedId = nextData[0]?.id || null) {
    setSaving(true);
    const payload = { ...content, gallery: nextData };
    const success = await updateSiteContent(payload);

    if (!success) {
      message.error("Không lưu được gallery.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setData(nextData);
      setSelectedId(nextSelectedId);
    });
    message.success("Đã cập nhật gallery dự án.");
    setSaving(false);
    return true;
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa ảnh gallery này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        const nextData = data.filter((item) => item.id !== record.id);
        await persist(nextData, nextData[0]?.id || null);
      },
    });
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRecord = {
        id: values.id || Date.now(),
        title: values.title,
        category: getGalleryCategoryLabel(values.category),
        url: values.url,
      };

      const nextData = values.id
        ? data.map((item) => (item.id === values.id ? nextRecord : item))
        : [...data, nextRecord];

      const success = await persist(nextData, nextRecord.id);
      if (!success) return;

      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin gallery.");
    }
  }

  return (
    <div className="space-y-8">
      <div style={{ marginTop: "10px" }}>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="none" className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng ảnh</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Danh mục</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{categoryCount}</div>
        </Card>
        <Card variant="none" className="rounded-[28px] bg-slate-900 text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Hiển thị</div>
          <div className="mt-4 text-2xl font-black text-white">Public Gallery</div>
        </Card>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Card
          variant="none"
          className="rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
          title={<span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Thư viện dự án tiêu biểu</span>}
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo tiêu đề, danh mục..."
              className="h-12 flex-1 rounded-2xl bg-slate-50 border-none px-5"
            />
            {/* Category filter removed as requested */}
          </div>

          <Table
            rowKey="id"
            loading={loading}
            dataSource={filteredData}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            onRow={(record) => ({ onClick: () => setSelectedId(record.id) })}
            className="gallery-table"
            columns={[
              {
                title: "Ảnh",
                dataIndex: "url",
                key: "url",
                width: 100,
                render: (value) => <Image src={value} alt="Gallery" width={64} height={42} className="rounded-xl object-cover ring-1 ring-slate-100 shadow-sm" />
              },
              {
                title: "Thông tin công trình",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="text-sm font-bold text-slate-800">{record.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{record.category}</span>
                    </div>
                  </div>
                )
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
                )
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
              Thêm ảnh vào thư viện
            </Button>
            <p className="mt-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Nên dùng ảnh tỷ lệ 3:2 hoặc 16:9 để hiển thị tốt nhất
            </p>
          </div>
        </Card>

        <Card bordered={false} className="sticky top-8 overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <Text className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Xem trước hiển thị</Text>
          </div>
          {selectedItem ? (
            <div className="space-y-6">
              <div className="relative group overflow-hidden rounded-[28px] bg-slate-50 p-3 ring-1 ring-slate-100">
                <Image src={selectedItem.url} alt={selectedItem.title} preview={true} className="h-[280px] w-full rounded-[20px] object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <div className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {selectedItem.category}
                </div>
                <Title level={5} className="!mt-4 !mb-2 !text-slate-900 !font-bold">{selectedItem.title}</Title>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs leading-relaxed text-slate-500 italic">
                    "Hình ảnh này sẽ được đưa vào slider/gallery chính của website, thu hút khách hàng bằng chất lượng công trình thực tế."
                  </p>
                </div>
              </div>
            </div>
          ) : <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-400">Chọn một ảnh để xem chi tiết</div>}
        </Card>
      </div>

      <Modal title={editingId ? "Chỉnh sửa ảnh gallery" : "Thêm ảnh mới"} open={isModalOpen} onOk={handleSave} onCancel={closeModal} okText="Lưu ảnh" cancelText="Hủy" confirmLoading={saving}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề ảnh." }]}><Input placeholder="Ví dụ: Tàu hàng 9.000T" /></Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục." }]}>
            <Select options={GALLERY_CATEGORY_OPTIONS} />
          </Form.Item>
          <Form.Item label="Ảnh gallery">
            <Input type="file" accept="image/*" onChange={handleUpload} className="rounded-xl" />
            {imageUrl ? <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><Image preview={false} src={imageUrl} alt="Preview" className="h-[180px] w-full object-cover" /></div> : null}
          </Form.Item>
          <Form.Item name="url" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh." }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div >
  );
}
