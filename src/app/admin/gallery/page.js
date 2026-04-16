"use client";

import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, FileImageOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Select, Space, Table, Typography, Upload, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function GalleryManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
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

  const categoryOptions = [
    { label: "Tất cả danh mục", value: "all" },
    ...Array.from(new Set(data.map((item) => item.category))).map((category) => ({
      label: category,
      value: category,
    })),
  ];

  const filteredData = data.filter((item) => {
    const matchesCategory = categoryFilter === "all" ? true : item.category === categoryFilter;
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      keyword.length === 0 || [item.title, item.category, item.url].some((value) => value?.toLowerCase().includes(keyword));
    return matchesCategory && matchesSearch;
  });

  const selectedItem = filteredData.find((item) => item.id === selectedId) || filteredData[0] || null;
  const categoryCount = new Set(data.map((item) => item.category)).size;

  function openCreateModal() {
    form.resetFields();
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
    setImageUrl(record.url);
    setIsModalOpen(true);
  }

  function handleUpload(info) {
    const file = info.file.originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const nextImage = event.target?.result || "";
      setImageUrl(nextImage);
      form.setFieldsValue({ url: nextImage });
    };
    reader.readAsDataURL(file);
  }

  async function persist(nextData) {
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
      setSelectedId(nextData[0]?.id || null);
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
        category: values.category,
        url: values.url,
      };

      const nextData = values.id
        ? data.map((item) => (item.id === values.id ? nextRecord : item))
        : [...data, nextRecord];

      const success = await persist(nextData);
      if (!success) return;

      setIsModalOpen(false);
      setImageUrl("");
      setSelectedId(nextRecord.id);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin gallery.");
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Project gallery"
        icon={<FileImageOutlined />}
        title="Gallery dự án"
        description="Quản lý ảnh công trình, nhà xưởng và sản phẩm để phần gallery ngoài website sinh động và đầy dữ liệu hơn."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} className="h-11 rounded-2xl px-5 font-semibold" onClick={openCreateModal}>
            Thêm ảnh
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng ảnh</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Danh mục</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{categoryCount}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Hiển thị ngoài FE</div>
          <div className="mt-4 text-2xl font-black">Grid ảnh + filter</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Ưu tiên ảnh rõ chủ thể và cùng tông để section gallery nhìn gọn và chuyên nghiệp hơn.</Text>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_220px]">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo tiêu đề hoặc danh mục"
              className="h-11 rounded-2xl"
            />
            <Select value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} className="h-11" />
          </div>

          <Table
            rowKey="id"
            loading={loading}
            dataSource={filteredData}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            onRow={(record) => ({
              onClick: () => setSelectedId(record.id),
            })}
            columns={[
              {
                title: "Ảnh",
                dataIndex: "url",
                key: "url",
                width: 110,
                render: (value) => <Image src={value} alt="Gallery" width={72} height={48} className="rounded-2xl object-cover" />,
              },
              {
                title: "Nội dung",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{record.category}</div>
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

        <Card bordered={false} className="overflow-hidden rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Ảnh đang chọn</Text>
          {selectedItem ? (
            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-[28px] bg-slate-100">
                <Image src={selectedItem.url} alt={selectedItem.title} preview={false} className="h-[260px] w-full object-cover" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{selectedItem.category}</div>
              <Title level={5} className="!mb-1 !text-slate-900">
                {selectedItem.title}
              </Title>
              <Text className="text-sm leading-7 text-slate-500">Hình ảnh này sẽ được đưa vào gallery công trình trên frontend sau khi lưu thành công.</Text>
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Không có ảnh nào khớp bộ lọc hiện tại.
            </div>
          )}
        </Card>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa ảnh gallery" : "Thêm ảnh mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu ảnh"
        cancelText="Hủy"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề ảnh." }]}>
            <Input placeholder="Ví dụ: Tàu hàng 9.000T" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: "Vui lòng nhập danh mục." }]}>
            <Input placeholder="Ví dụ: Đóng mới" />
          </Form.Item>
          <Form.Item label="Ảnh gallery">
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
              {imageUrl ? (
                <Image preview={false} src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <PlusOutlined />
                  <div className="mt-2 text-xs">Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item name="url" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh." }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
