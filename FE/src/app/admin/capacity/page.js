"use client";

import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Image, Input, Modal, Select, Table, Typography, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Text, Title } = Typography;

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

  const selectedItem = useMemo(() => {
    const current = filteredData.find((item) => item.id === selectedId) || filteredData[0] || null;
    if (!current) return null;
    if (isModalOpen && editingId === current.id && imageUrl) {
      return { ...current, image: imageUrl, title: form.getFieldValue("title") || current.title, category: form.getFieldValue("category") || current.category, detail: form.getFieldValue("detail") || current.detail, icon: form.getFieldValue("icon") || current.icon };
    }
    return current;
  }, [filteredData, selectedId, isModalOpen, editingId, imageUrl, form]);

  const categoryCount = new Set(data.map((item) => item.category)).size;

  function openCreateModal() {
    form.resetFields();
    form.setFieldsValue({ icon: "Building2" });
    setEditingId(null);
    setImageUrl("");
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setImageUrl(record.image);
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
      form.setFieldsValue({ image: nextImage });
    };
    reader.readAsDataURL(file);
  }

  async function persist(nextData, nextSelectedId = nextData[0]?.id || null) {
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
      setSelectedId(nextSelectedId);
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
        const nextData = data.filter((item) => item.id !== record.id);
        await persist(nextData, nextData[0]?.id || null);
      },
    });
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      const nextRecord = { id: values.id || Date.now(), category: values.category, title: values.title, detail: values.detail, icon: values.icon, image: values.image };
      const nextData = values.id ? data.map((item) => (item.id === values.id ? nextRecord : item)) : [...data, nextRecord];
      const success = await persist(nextData, nextRecord.id);
      if (!success) return;
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin năng lực.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tổng hạng mục</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{data.length}</div>
        </Card>
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Nhóm nội dung</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{categoryCount}</div>
        </Card>
        <Card variant="none" className="rounded-2xl bg-slate-900 text-white shadow-[0_6px_20px_rgba(7,27,47,0.14)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Trạng thái</div>
          <div className="mt-2 text-base font-bold text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            Đang hiển thị
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_340px]">
        <Card
          variant="none"
          className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
          title={<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Danh sách năng lực cốt lõi</span>}
        >
          <div className="mb-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo nhóm, tiêu đề hoặc mô tả..."
              className="h-9 rounded-xl bg-slate-50 border-none px-4"
            />
          </div>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={filteredData}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            onRow={(record) => ({ onClick: () => setSelectedId(record.id) })}
            columns={[
              {
                title: "Ảnh",
                dataIndex: "image",
                key: "image",
                width: 100,
                render: (value) => <Image src={value} alt="Capacity" width={64} height={42} className="rounded-xl object-cover ring-1 ring-slate-100" />
              },
              {
                title: "Nội dung",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500">{record.category}</div>
                    <div className="mt-1 font-bold text-slate-800">{record.title}</div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-400">{record.detail}</div>
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

          <div className="mt-5 flex flex-col items-center border-t border-slate-50 pt-5">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="h-9 rounded-xl bg-slate-900 px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md hover:bg-blue-600"
            >
              Thêm năng lực mới
            </Button>
            <p className="mt-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-center">
              Nhấn vào dòng trong bảng để xem preview chi tiết bên phải
            </p>
          </div>
        </Card>

        <Card variant="none" className="sticky top-4 overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Preview chi tiết</Text>
            {selectedItem && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <ThunderboltOutlined />
              </div>
            )}
          </div>
          {selectedItem ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
                <Image src={selectedItem.image} alt={selectedItem.title} preview={true} className="h-[150px] w-full rounded-lg object-cover shadow-sm" />
              </div>
              <div>
                <div className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  {selectedItem.category}
                </div>
                <div className="mt-2 text-base font-bold leading-tight text-slate-900">{selectedItem.title}</div>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">{selectedItem.detail}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400">
                    <PlusOutlined style={{ fontSize: '11px' }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Icon đại diện</div>
                    <div className="text-xs font-bold text-slate-700">{selectedItem.icon}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-400">Chọn một mục để xem trước</div>}
        </Card>
      </div>

      <Modal title={editingId ? "Chỉnh sửa năng lực" : "Thêm năng lực mới"} open={isModalOpen} onOk={handleSave} onCancel={closeModal} okText="Lưu năng lực" cancelText="Hủy" confirmLoading={saving} width={720}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item name="category" label="Nhóm nội dung" rules={[{ required: true, message: "Vui lòng nhập nhóm nội dung." }]}><Input placeholder="Ví dụ: Hạ tầng" /></Form.Item>
            <Form.Item name="icon" label="Icon FE" rules={[{ required: true, message: "Vui lòng chọn icon." }]}><Select options={iconOptions} /></Form.Item>
          </div>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}><Input placeholder="Ví dụ: Nhà xưởng và triền tàu quy mô lớn" /></Form.Item>
          <Form.Item label="Ảnh minh họa">
            <Input type="file" accept="image/*" onChange={handleUpload} className="rounded-xl" />
            {imageUrl ? <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><Image preview={false} src={imageUrl} alt="Preview" className="h-[180px] w-full object-cover" /></div> : null}
          </Form.Item>
          <Form.Item name="image" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh minh họa." }]}><Input /></Form.Item>
          <Form.Item name="detail" label="Mô tả chi tiết" rules={[{ required: true, message: "Vui lòng nhập mô tả." }]}><Input.TextArea rows={5} placeholder="Mô tả ngắn gọn năng lực này thể hiện điều gì trên website." /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
