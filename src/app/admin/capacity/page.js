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
    { title: "Phân loại", dataIndex: "category", key: "category", width: 150 },
    { title: "Năng lực / Thiết bị", dataIndex: "title", key: "title", width: 250 },
    { title: "Thông số kỹ thuật", dataIndex: "value", key: "value" },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => <Tag color="blue">{status.toUpperCase()}</Tag>
    },
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
             <ThunderboltOutlined className="text-yellow-500" /> Quản Lý Năng Lực Hoạt Động
          </Title>
          <Text type="secondary">Quản lý cơ sở vật chất và năng lực đóng tàu của nhà máy.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Thêm năng lực mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Modal
        title="Quản lý thông tin năng lực"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="category" label="Phân loại" rules={[{ required: true }]}>
             <Input placeholder="Vd: Hạ tầng, Thiết bị, Nhân lực..." />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề năng lực" rules={[{ required: true }]}>
             <Input placeholder="Vd: Cẩu trục 100 tấn" />
          </Form.Item>
          <Form.Item name="value" label="Thông số chi tiết" rules={[{ required: true }]}>
             <Input placeholder="Vd: Tàu 25,000 tấn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
