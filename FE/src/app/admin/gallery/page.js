"use client";

import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Modal, Table, Typography, message } from "antd";
import { getSiteContent, updateSiteContent, uploadImage } from "@/services/api";

const { Text, Title } = Typography;

function getGalleryImages(item) {
  if (!item) return [];

  const images = Array.isArray(item.images) ? item.images : [];
  return Array.from(new Set([item.url, ...images].filter((url) => typeof url === "string" && url.trim() !== "")));
}

function slugify(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "gallery";
}

function buildUniqueSlug(title, items, currentId) {
  const baseSlug = slugify(title);
  const usedSlugs = new Set(
    items
      .filter((item) => `${item.id}` !== `${currentId || ""}`)
      .map((item) => item.slug)
      .filter(Boolean)
  );

  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let index = 2;
  let nextSlug = `${baseSlug}-${index}`;
  while (usedSlugs.has(nextSlug)) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
}

export default function GalleryManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
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

  const filteredData = data.filter((item) => {
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch = keyword.length === 0 || [item.title, item.slug, item.url].some((value) => value?.toLowerCase().includes(keyword));
    return matchesSearch;
  });

  const selectedItem = useMemo(() => {
    const current = filteredData.find((item) => item.id === selectedId) || filteredData[0] || null;
    if (!current) return null;
    if (isModalOpen && editingId === current.id) {
      const modalImages = imageUrls.length > 0 ? imageUrls : getGalleryImages(current);

      return {
        ...current,
        url: modalImages[0] || current.url,
        images: modalImages,
        title: form.getFieldValue("title") || current.title,
        slug: buildUniqueSlug(form.getFieldValue("title") || current.title, data, current.id),
      };
    }
    return current;
  }, [filteredData, selectedId, isModalOpen, editingId, imageUrls, form, data]);

  const groupCount = data.length;
  const totalImageCount = data.reduce((count, item) => count + getGalleryImages(item).length, 0);
  const selectedItemImages = getGalleryImages(selectedItem);

  function openCreateModal() {
    form.resetFields();
    setEditingId(null);
    setImageUrls([]);
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    const images = getGalleryImages(record);

    form.setFieldsValue({
      ...record,
      url: images[0] || record.url,
    });
    setEditingId(record.id);
    setImageUrls(images);
    setSelectedId(record.id);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setImageUrls([]);
    setUploading(false);
    form.resetFields();
  }

  async function handleUpload(event) {
    const input = event.currentTarget;
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedImages = (await Promise.all(files.map((file) => uploadImage(file, "uploads/gallery"))))
        .filter((url) => typeof url === "string" && url.trim() !== "");

      if (uploadedImages.length === 0) {
        message.error("Không upload được ảnh. Vui lòng thử lại với ảnh nhỏ hơn 10MB.");
        return;
      }

      const nextImages = Array.from(new Set([...imageUrls, ...uploadedImages]));
      setImageUrls(nextImages);
      form.setFieldsValue({ url: nextImages[0] || "" });
      message.success(`Đã upload ${uploadedImages.length} ảnh.`);
    } finally {
      setUploading(false);
      if (input) input.value = "";
    }
  }

  function removeImage(imageIndex) {
    const nextImages = imageUrls.filter((_, index) => index !== imageIndex);

    setImageUrls(nextImages);
    form.setFieldsValue({ url: nextImages[0] || "" });
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
      const nextImages = Array.from(new Set(imageUrls.filter(Boolean)));

      if (nextImages.length === 0) {
        message.error("Vui lòng chọn ít nhất một ảnh gallery.");
        return;
      }

      const nextRecord = {
        id: values.id || Date.now(),
        title: values.title,
        slug: buildUniqueSlug(values.title, data, values.id),
        category: data.find((item) => `${item.id}` === `${values.id || ""}`)?.category || "Thư viện",
        url: nextImages[0],
        images: nextImages,
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
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card variant="none" className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Tổng ảnh</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalImageCount}</div>
        </Card>
        <Card bordered={false} className="rounded-2xl shadow-[0_4px_14px_rgba(15,23,42,0.05)] bg-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Nhóm ảnh</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{groupCount}</div>
        </Card>
        <Card variant="none" className="rounded-2xl bg-slate-900 text-white shadow-[0_6px_20px_rgba(7,27,47,0.14)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Hiển thị</div>
          <div className="mt-2 text-base font-bold text-white">Public Gallery</div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_340px]">
        <Card
          variant="none"
          className="rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
          title={<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Thư viện dự án tiêu biểu</span>}
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Tìm theo tiêu đề, slug..."
              className="h-9 flex-1 rounded-xl bg-slate-50 border-none px-4"
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
                render: (_, record) => {
                  const recordImages = getGalleryImages(record);

                  return (
                    <div className="relative w-fit">
                      <img src={recordImages[0]} alt="Gallery" className="h-[42px] w-16 rounded-xl object-cover shadow-sm ring-1 ring-slate-100" />
                      {recordImages.length > 1 ? (
                        <span className="absolute -right-2 -top-2 rounded-full bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {recordImages.length}
                        </span>
                      ) : null}
                    </div>
                  );
                }
              },
              {
                title: "Thông tin công trình",
                key: "content",
                render: (_, record) => (
                  <div>
                    <div className="text-sm font-bold text-slate-800">{record.title}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{record.slug || slugify(record.title)}</span>
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

          <div className="mt-5 flex flex-col items-center border-t border-slate-50 pt-5">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="h-9 rounded-xl bg-slate-900 px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md hover:bg-blue-600"
            >
              Thêm nhiều ảnh vào thư viện
            </Button>
            <p className="mt-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
              Nên dùng ảnh tỷ lệ 3:2 hoặc 16:9 để hiển thị tốt nhất
            </p>
          </div>
        </Card>

        <Card bordered={false} className="sticky top-4 overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
          <div className="mb-4">
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Xem trước hiển thị</Text>
          </div>
          {selectedItem ? (
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
                <img src={selectedItemImages[0] || selectedItem.url} alt={selectedItem.title} className="h-[160px] w-full rounded-lg object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <div className="inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedItem.slug || slugify(selectedItem.title)}
                </div>
                <Title level={5} className="!mt-3 !mb-1 !text-slate-900 !font-bold">{selectedItem.title}</Title>
                {selectedItemImages.length > 1 ? (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {selectedItemImages.slice(0, 8).map((imageUrl, imageIndex) => (
                      <div key={`${imageUrl}-${imageIndex}`} className="aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                        <img src={imageUrl} alt={`${selectedItem.title} ${imageIndex + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs leading-relaxed text-slate-500 italic">
                    Hình ảnh này sẽ được đưa vào slider/gallery chính của website, thu hút khách hàng bằng chất lượng công trình thực tế.
                  </p>
                </div>
              </div>
            </div>
          ) : <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-400">Chọn một ảnh để xem chi tiết</div>}
        </Card>
      </div>

      <Modal title={editingId ? "Chỉnh sửa nhóm ảnh gallery" : "Thêm nhóm ảnh mới"} open={isModalOpen} onOk={handleSave} onCancel={closeModal} okText="Lưu ảnh" cancelText="Hủy" confirmLoading={saving || uploading}>
        <Form form={form} layout="vertical" className="mt-5">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề ảnh." }]}><Input placeholder="Ví dụ: Tàu hàng 9.000T" /></Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() => (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-6 text-slate-500">
                Slug tự tạo: <span className="font-bold text-slate-800">{buildUniqueSlug(form.getFieldValue("title"), data, form.getFieldValue("id"))}</span>
              </div>
            )}
          </Form.Item>
          <Form.Item label="Ảnh gallery" extra="Có thể chọn nhiều file ảnh cùng lúc; ảnh đầu tiên sẽ làm cover.">
            <Input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="rounded-xl" />
            {imageUrls.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {imageUrls.map((imageUrl, imageIndex) => (
                  <div key={`${imageUrl}-${imageIndex}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={imageUrl} alt={`Preview ${imageIndex + 1}`} className="h-[120px] w-full object-cover" />
                    <Button
                      type="primary"
                      danger
                      size="small"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => removeImage(imageIndex)}
                      className="absolute right-2 top-2 opacity-95"
                    />
                    {imageIndex === 0 ? (
                      <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Cover
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Form.Item>
          <Form.Item name="url" hidden><Input /></Form.Item>
        </Form>
      </Modal>
    </div >
  );
}
