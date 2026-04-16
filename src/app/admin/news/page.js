"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Form, Image, Input, Modal, Space, Table, Tag, Typography, Upload, message } from "antd";
import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { deleteNews, getNews, saveNews } from "@/services/api";

const { Title, Text } = Typography;

export default function NewsManager() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");

  async function loadData() {
    const news = await getNews(true);
    setData(news || []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const news = await getNews(true);
      if (!active) return;

      setData(news || []);
      setLoading(false);
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  function handleUpload(info) {
    const file = info.file.originFileObj;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result || "");
      form.setFieldsValue({ image: event.target?.result || "" });
    };
    reader.readAsDataURL(file);
  }

  function handleDelete(record) {
    Modal.confirm({
      title: "Xóa bài viết này?",
      content: "Bài viết sẽ bị xóa khỏi danh sách tin tức trên landing page.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        const success = await deleteNews(record._id);
        if (success) {
          message.success("Đã xóa tin tức.");
          loadData();
        } else {
          message.error("Không xóa được bài viết.");
        }
      },
    });
  }

  async function handleOk() {
    try {
      const values = await form.validateFields();
      const success = await saveNews({
        ...values,
        image: imageUrl || values.image,
      });

      if (success) {
        message.success(values._id ? "Đã cập nhật bài viết." : "Đã tạo bài viết mới.");
        setIsModalOpen(false);
        form.resetFields();
        setImageUrl("");
        loadData();
      } else {
        message.error("Không lưu được bài viết.");
      }
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại dữ liệu.");
    }
  }

  const columns = [
    {
      title: "Ảnh bìa",
      dataIndex: "image",
      key: "image",
      width: 130,
      render: (img) => <Image src={img} width={88} className="rounded-lg object-cover" />,
    },
    { title: "Ngày", dataIndex: "date", key: "date", width: 120 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setImageUrl(record.image);
              setIsModalOpen(true);
            }}
          />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
            <FileTextOutlined className="text-primary" /> Quản lý tin tức
          </Title>
          <Text type="secondary" className="text-xs">
            Nội dung sẽ được lưu vào backend Laravel/MySQL và hiển thị trực tiếp ngoài landing page.
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            form.setFieldsValue({ date: new Date().toLocaleDateString("vi-VN") });
            setImageUrl("");
            setIsModalOpen(true);
          }}
          className="h-10 rounded-lg"
        >
          Đăng tin mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="_id" loading={loading} />
      </Card>

      <Modal
        title={form.getFieldValue("_id") ? "Chỉnh sửa bài viết" : "Đăng tin tức mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        width={820}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
              <Input placeholder="Nhập tiêu đề..." />
            </Form.Item>
            <Form.Item name="category" label="Chuyên mục" initialValue="Tin hoạt động">
              <Input placeholder="Ví dụ: Hạ thủy, Đầu tư..." />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <Form.Item label="Ảnh bìa">
              <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" style={{ width: "100%" }} />
                ) : (
                  <div className="flex flex-col items-center">
                    <PlusOutlined />
                    <div className="mt-2 text-xs">Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item name="date" label="Ngày đăng" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: 16/04/2026" />
            </Form.Item>
          </div>

          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={8} placeholder="Nhập nội dung hiển thị..." />
          </Form.Item>

          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
