"use client";

import React, { startTransition, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Space, Table, Typography, Upload, message } from "antd";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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

  const previewItem = data.find((item) => item.id === previewId) || data[0] || null;

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

  async function persist(nextRows) {
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
      setPreviewId(nextRows[0]?.id || null);
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
        await persist(nextRows);
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

      const success = await persist(nextRows);
      if (!success) return;

      setIsModalOpen(false);
      setImageUrl("");
      form.resetFields();
      setPreviewId(nextRow.id);
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin banner.");
    }
  }

  const totalCount = data.length;
  const readyCount = data.filter((item) => item.url).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage slider"
        icon={<PictureOutlined />}
        title="Banner trang chủ"
        description="Quản lý slider ngoài landing page, thay ảnh nhanh và xem trước thứ tự hiển thị ngay trong màn hình admin."
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} className="h-11 rounded-2xl px-5 font-semibold" onClick={openCreateModal}>
            Thêm banner
          </Button>,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tổng số slide</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{totalCount}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Sẵn sàng hiển thị</div>
          <div className="mt-4 text-4xl font-black text-slate-900">{readyCount}</div>
        </Card>
        <Card bordered={false} className="rounded-[28px] bg-[#071b2f] text-white shadow-[0_18px_50px_rgba(7,27,47,0.18)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Nguồn dữ liệu</div>
          <div className="mt-4 text-2xl font-black">Laravel API + MySQL</div>
          <Text className="mt-3 block text-sm leading-7 text-slate-300">Thứ tự trong bảng là thứ tự xuất hiện trên slider trang chủ.</Text>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
        <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Table
            rowKey="id"
            loading={loading}
            dataSource={data}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            onRow={(record) => ({
              onClick: () => setPreviewId(record.id),
            })}
            columns={[
              {
                title: "Ảnh",
                dataIndex: "url",
                key: "url",
                width: 150,
                render: (value) => <Image src={value} alt="Banner" width={104} height={64} className="rounded-2xl object-cover" />,
              },
              {
                title: "Tiêu đề",
                dataIndex: "title",
                key: "title",
                render: (_, record) => (
                  <div>
                    <div className="font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{record.url?.startsWith("data:") ? "Ảnh mới chưa publish" : "Đang hiển thị từ dữ liệu đã lưu"}</div>
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
          <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Xem trước banner</Text>
          {previewItem ? (
            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-[28px] bg-slate-100">
                <Image src={previewItem.url} alt={previewItem.title} preview={false} className="h-[260px] w-full object-cover" />
              </div>
              <div>
                <Title level={5} className="!mb-1 !text-slate-900">
                  {previewItem.title}
                </Title>
                <Text className="text-sm leading-7 text-slate-500">
                  Banner được chọn sẽ giữ nguyên tỷ lệ ảnh đang lưu. Nên ưu tiên ảnh ngang chất lượng cao để slider hiển thị đều và ít vỡ hình.
                </Text>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Chưa có banner nào trong hệ thống.
            </div>
          )}
        </Card>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa banner" : "Thêm banner mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
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
          <Form.Item name="url" hidden rules={[{ required: true, message: "Vui lòng chọn ảnh banner." }]}>
            <Input />
          </Form.Item>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-500">
            Ảnh mới sẽ được gửi về backend Laravel để lưu trên máy local, sau đó frontend sẽ đọc lại từ API.
          </div>
        </Form>
      </Modal>
    </div>
  );
}
