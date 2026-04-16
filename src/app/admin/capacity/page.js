"use client";

import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Select, Space, Table, Typography, Upload, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text } = Typography;

const iconOptions = [
  { label: "Users", value: "Users" },
  { label: "Building2", value: "Building2" },
  { label: "Cpu", value: "Cpu" },
  { label: "Wind", value: "Wind" },
];

export default function CapacityManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
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

      const capacities = siteContent?.capacity || [];
      startTransition(() => {
        setContent(siteContent || {});
        setData(capacities);
        setSelectedId(capacities[0]?.id || null);
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const filteredData = data.filter((item) => {
    const keyword = deferredSearch.trim().toLowerCase();
    if (!keyword) return true;
    return [item.category, item.title, item.detail, item.icon].some((value) => value?.toLowerCase().includes(keyword));
  });

  const selectedItem = filteredData.find((item) => item.id === selectedId) || filteredData[0] || null;
  const categoryCount = new Set(data.map((item) => item.category)).size;

  function openCreateModal() {
    form.resetFields();
    form.setFieldsValue({ icon: "Building2" });
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
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

  async function persist(nextData) {
    setSaving(true);
    const payload = { ...content, capacity: nextData };
    const success = await updateSiteContent(payload);

    if (!success) {
      message.error("Không lưu được dữ liệu năng lực.");
      setSaving(false);
      return false;
    }

    startTransition(() => {
      setContent(payload);
      setData(nextData);
      setSelectedId(nextData[0]?.id || null);
    });
    message.success("Đã cập nhật dữ liệu năng lực.");
    setSaving(false);
    return true;
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa mục năng lực này?",
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
        category: values.category,
        title: values.title,
        detail: values.detail,
        icon: values.icon,
        image: values.image,
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
      message.error("Vui lòng kiểm tra lại thông tin năng lực.");
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Capabilities"
        icon={<ThunderboltOutlined />}
        title="Năng lực hoạt động"
        description="Quản lý các khối năng lực hiển thị trên homepage: con người, hạ tầng, thiết bị và năng lực tổ chức thi công."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} className="h-11 rounded-2xl px-5 font-semibold" onClick={openCreateModal}>
            Thêm năng lực
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng hạng mục</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{data.length}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Nhóm nội dung</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{categoryCount}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Hiển thị ngoài FE</div>
          <div className="mt-4 text-2xl font-black">Cards + ảnh nền</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Giữ đúng tỉ lệ ảnh ngang để section ngoài trang chủ ít bị giật bố cục khi tải.</Text>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-5">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo nhóm, tiêu đề, mô tả hoặc icon"
              className="h-11 rounded-2xl"
            />
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
                dataIndex: "image",
                key: "image",
                width: 110,
                render: (value) => <Image src={value} alt="Capacity" width={72} height={48} className="rounded-2xl object-cover" />,
              },
              {
                title: "Nội dung",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{record.category}</div>
                    <div className="mt-1 font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 line-clamp-2 text-sm leading-7 text-slate-500">{record.detail}</div>
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
          <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Preview thẻ năng lực</Text>
          {selectedItem ? (
            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-[28px] bg-slate-100">
                <Image src={selectedItem.image} alt={selectedItem.title} preview={false} className="h-[240px] w-full object-cover" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{selectedItem.category}</div>
              <div className="text-xl font-black text-slate-900">{selectedItem.title}</div>
              <div className="text-sm leading-7 text-slate-500">{selectedItem.detail}</div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">Icon FE: {selectedItem.icon || "Building2"}</div>
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Không có mục năng lực phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </Card>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa năng lực" : "Thêm năng lực mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu năng lực"
        cancelText="Hủy"
        confirmLoading={saving}
        width={720}
      >
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="category" label="Nhóm nội dung" rules={[{ required: true, message: "Vui lòng nhập nhóm nội dung." }]}>
              <Input placeholder="Ví dụ: Hạ tầng" />
            </Form.Item>
            <Form.Item name="icon" label="Icon FE" rules={[{ required: true, message: "Vui lòng chọn icon." }]}>
              <Select options={iconOptions} />
            </Form.Item>
          </div>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}>
            <Input placeholder="Ví dụ: Nhà xưởng và triền tàu quy mô lớn" />
          </Form.Item>
          <Form.Item label="Ảnh minh họa">
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
          <Form.Item name="image" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh minh họa." }]}>
            <Input />
          </Form.Item>
          <Form.Item name="detail" label="Mô tả chi tiết" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}>
            <Input.TextArea rows={5} placeholder="Mô tả ngắn gọn năng lực này thể hiện điều gì trên website." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
