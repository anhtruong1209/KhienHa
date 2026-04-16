"use client";

import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, FileImageOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Space, Table, Typography, Upload, message } from "antd";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function GalleryManager() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [originalContent, setOriginalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [form] = Form.useForm();

  async function loadData() {
    const content = await getSiteContent();
    setOriginalContent(content || {});
    setData(content?.gallery || []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const content = await getSiteContent();
      if (!active) return;

      setOriginalContent(content || {});
      setData(content?.gallery || []);
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
      form.setFieldsValue({ url: event.target?.result || "" });
    };
    reader.readAsDataURL(file);
  }

  async function persist(nextData) {
    const success = await updateSiteContent({ ...originalContent, gallery: nextData });
    if (success) {
      message.success("Đã lưu gallery.");
      setData(nextData);
    } else {
      message.error("Không lưu được gallery.");
    }
  }

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "url",
      key: "url",
      width: 120,
      render: (url) => <Image src={url} width={72} className="rounded-lg object-cover" />,
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Danh mục", dataIndex: "category", key: "category", width: 180 },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setImageUrl(record.url);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const nextData = data.filter((item) => item.id !== record.id);
              persist(nextData);
            }}
          />
        </Space>
      ),
    },
  ];

  async function handleOk() {
    const values = await form.validateFields();
    const payload = { ...values, url: imageUrl || values.url };
    const nextData = values.id
      ? data.map((item) => (item.id === values.id ? payload : item))
      : [...data, { ...payload, id: Date.now() }];
    setIsModalOpen(false);
    setImageUrl("");
    persist(nextData);
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
            <FileImageOutlined className="text-primary" /> Gallery dự án
          </Title>
          <Text type="secondary" className="text-xs">
            Quản lý ảnh dự án, nhà xưởng và sản phẩm hiển thị trên landing page.
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setImageUrl("");
            setIsModalOpen(true);
          }}
          className="h-10 rounded-lg"
        >
          Thêm ảnh mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
      </Card>

      <Modal title="Thông tin gallery" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Lưu">
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Ảnh">
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
          <Form.Item name="url" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
