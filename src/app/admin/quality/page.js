"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { siteContent } from "@/data/site-content";

const { Title, Text } = Typography;

export default function QualityManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const [data, setData] = useState([
    { id: 1, step: "Bước 1", title: "Khảo sát & Thiết kế", status: "Active" },
    { id: 2, step: "Bước 2", title: "Cắt tôn CNC", status: "Active" },
    { id: 3, step: "Bước 3", title: "Lắp ráp phân đoạn", status: "Active" },
  ]);

  const columns = [
    { title: "Giai đoạn", dataIndex: "step", key: "step", width: 150 },
    { title: "Tên quy trình / Bước thực hiện", dataIndex: "title", key: "title" },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => <Tag color="green">{status.toUpperCase()}</Tag>
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setIsModalOpen(true); }} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => { setData(data.filter(i => i.id !== record.id)); message.success("Đã xóa"); }} />
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then(values => {
      if (values.id) {
        setData(data.map(item => item.id === values.id ? { ...item, ...values } : item));
      } else {
        setData([...data, { ...values, id: Date.now(), status: "Active" }]);
      }
      setIsModalOpen(false);
      message.success("Lưu dữ liệu thành công");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
             <SafetyCertificateOutlined className="text-primary" /> Quản lý Quy trình Chất lượng
          </Title>
          <Text type="secondary" className="text-xs">Quản lý các bước trong quy trình kiểm soát chất lượng đóng tàu.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Thêm quy trình
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Modal
        title="Thông tin quy trình chất lượng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="step" label="Giai đoạn / Bước số" rules={[{ required: true }]}>
             <Input placeholder="Vd: Bước 1, Giai đoạn thiết kế..." />
          </Form.Item>
          <Form.Item name="title" label="Mô tả công việc" rules={[{ required: true }]}>
             <Input placeholder="Nhập mô tả quy trình..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
