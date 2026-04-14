"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from "@ant-design/icons";

import { siteContent } from "@/data/site-content";

const { Title, Text } = Typography;

export default function HistoryManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Seeding from shared data store
  const [data, setData] = useState(siteContent.history.map(item => ({ ...item, status: "Active" })));

  const columns = [
    { title: "Năm", dataIndex: "year", key: "year", width: 100 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", width: 250 },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => <Tag color={status === "Active" ? "green" : "orange"}>{status.toUpperCase()}</Tag>
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

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
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
             <HistoryOutlined className="text-primary" /> Quản Lý Lịch Sử Phát Triển Nhà Máy
          </Title>
          <Text type="secondary">Cập nhật các cột mốc lịch sử phát triển của nhà máy Khiên Hà.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={handleAdd}
           className="h-10 rounded-lg"
        >
          Thêm cột mốc mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa cột mốc" : "Thêm cột mốc lịch sử"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="year" label="Năm mốc thời gian" rules={[{ required: true }]}>
             <Input placeholder="Vd: 2023" />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
             <Input placeholder="Nhập tiêu đề ngắn gọn..." />
          </Form.Item>
          <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true }]}>
             <Input.TextArea rows={4} placeholder="Nhập nội dung mô tả..." />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="Active">
             <Tag.CheckableTag checked>Hiển thị trên website</Tag.CheckableTag>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
