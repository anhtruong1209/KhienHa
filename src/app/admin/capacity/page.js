"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { siteContent } from "@/data/site-content";

const { Title, Text } = Typography;

export default function CapacityManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const [data, setData] = useState(siteContent.capacity.map(item => ({ 
    ...item, 
    value: item.detail, 
    category: "Chung",
    status: "Active" 
  })));

  const columns = [
    { 
      title: "Ảnh", 
      dataIndex: "image", 
      key: "image", 
      width: 100,
      render: (img) => <img src={img} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
    },
    { title: "Phân loại", dataIndex: "category", key: "category", width: 120 },
    { title: "Năng lực / Thiết bị", dataIndex: "title", key: "title", width: 220 },
    { title: "Thông số chi tiết", dataIndex: "detail", key: "detail", ellipsis: true },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
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
    message.success("Đã xóa mục thành công");
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
             <ThunderboltOutlined className="text-primary" /> Quản lý Năng lực Hoạt động
          </Title>
          <Text type="secondary" className="text-xs">Quản lý cơ sở vật chất, nhân sự và trang thiết bị đóng tàu.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg text-xs"
        >
          Thêm năng lực mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" size="small" />
      </Card>

      <Modal
        title="Thông tin năng lực hoạt động"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Phân loại" rules={[{ required: true }]}>
               <Input placeholder="Vd: Con người, Hạ tầng..." />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề năng lực" rules={[{ required: true }]}>
               <Input placeholder="Vd: Đội ngũ nhân sự" />
            </Form.Item>
          </div>
          <Form.Item name="image" label="URL Hình ảnh trực tiếp" rules={[{ required: true }]}>
             <Input placeholder="https://khienha.vn/uploads/..." />
          </Form.Item>
          <Form.Item name="detail" label="Mô tả chi tiết" rules={[{ required: true }]}>
             <Input.TextArea rows={6} placeholder="Nhập nội dung mô tả chi tiết năng lực..." />
          </Form.Item>
          <Form.Item name="icon" label="Tên Icon (Lucide)" initialValue="Building2">
             <Input placeholder="Users, Building2, Cpu, Wind..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
