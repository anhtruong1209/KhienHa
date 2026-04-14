"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import { bannerImages } from "@/data/site-content";

const { Title, Text } = Typography;

export default function BannerManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const [data, setData] = useState(bannerImages.map((url, index) => ({
    id: index + 1,
    url: url,
    title: `Banner ${index + 1}`,
    status: "Active"
  })));

  const columns = [
    { 
      title: "Hình ảnh", 
      dataIndex: "url", 
      key: "url", 
      width: 200,
      render: (url) => <Image src={url} width={150} className="rounded-lg shadow-sm" />
    },
    { title: "Tên Banner", dataIndex: "title", key: "title" },
    { title: "Đường dẫn (URL)", dataIndex: "url", key: "url_text", ellipsis: true },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
    message.success("Đã xóa banner thành công");
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (values.id) {
        setData(data.map(item => item.id === values.id ? { ...item, ...values } : item));
        message.success("Cập nhật thành công");
      } else {
        setData([...data, { ...values, id: Date.now(), status: "Active" }]);
        message.success("Thêm mới thành công");
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
             <PictureOutlined className="text-primary" /> Quản Lý Banner Trang Chủ
          </Title>
          <Text type="secondary">Thay đổi hình ảnh slider chạy ở đầu trang chủ.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Thêm Banner mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Tên gợi nhớ" rules={[{ required: true }]}>
             <Input placeholder="Vd: Banner Hạ thủy tàu 2024" />
          </Form.Item>
          <Form.Item name="url" label="Đường dẫn ảnh trực tiếp (URL)" rules={[{ required: true, type: 'url' }]}>
             <Input placeholder="https://khienha.vn/uploads/..." />
          </Form.Item>
          <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-600 mb-6 font-medium">
             Mẹo: Bạn có thể copy link ảnh từ trang khienha.vn hiện tại và dán vào đây để thay đổi Banner.
          </div>
        </Form>
      </Modal>
    </div>
  );
}
