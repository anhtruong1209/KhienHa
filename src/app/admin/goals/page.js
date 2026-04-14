"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FlagOutlined } from "@ant-design/icons";
import { siteContent } from "@/data/site-content";

const { Title, Text } = Typography;

export default function GoalsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const [data, setData] = useState(siteContent.goals.map(g => ({
    ...g,
    type: g.title.includes("Tầm nhìn") ? "Dài hạn" : "Sứ mệnh",
    status: "Active"
  })));

  const columns = [
    { 
      title: "Loại mục tiêu", 
      dataIndex: "type", 
      key: "type", 
      width: 150,
      render: (type) => <Tag color={type === "Dài hạn" ? "purple" : "blue"}>{type}</Tag>
    },
    { title: "Nội dung chiến lược", dataIndex: "content", key: "content" },
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
    message.success("Đã xóa mục tiêu");
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
             <FlagOutlined className="text-primary" /> Quản lý Mục tiêu chiến lược
          </Title>
          <Text type="secondary" className="text-xs">Quản lý các mục tiêu và kế hoạch phát triển chiến lược của công ty.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg text-xs"
        >
          Thêm mục tiêu
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" size="small" />
      </Card>

      <Modal
        title="Thông tin mục tiêu chiến lược"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="type" label="Loại mục tiêu" initialValue="Dài hạn">
             <Input placeholder="Vd: Ngắn hạn, Dài hạn, Sứ mệnh..." />
          </Form.Item>
          <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true }]}>
             <Input.TextArea rows={4} placeholder="Nhập nội dung chiến lược..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
