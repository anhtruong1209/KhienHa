"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FlagOutlined } from "@ant-design/icons";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function GoalsManager() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [originalContent, setOriginalContent] = useState({});

  const loadData = async () => {
    setLoading(true);
    const content = await getSiteContent();
    if (content) {
      setOriginalContent(content);
      setData(content.goals || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const syncToDB = async (currentData) => {
    const updatedContent = { ...originalContent, goals: currentData };
    const success = await updateSiteContent(updatedContent);
    if (success) {
      message.success("Đã đồng bộ Cloud");
      loadData();
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa mục tiêu?',
      onOk: () => {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        syncToDB(newData);
      }
    });
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    let newData;
    if (values.id) {
       newData = data.map(item => item.id === values.id ? { ...item, ...values } : item);
    } else {
       newData = [...data, { ...values, id: Date.now() }];
    }
    setData(newData);
    await syncToDB(newData);
    setIsModalOpen(false);
  };

  const columns = [
    { title: "Tên mục tiêu", dataIndex: "title", key: "title", width: 200 },
    { title: "Nội dung chi tiết", dataIndex: "content", key: "content" },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setIsModalOpen(true); }} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
             <FlagOutlined className="text-primary" /> Mục Tiêu Chiến Lược
          </Title>
          <Text type="secondary" className="text-xs">Quản lý định hướng phát triển của Khiên Hà.</Text>
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
        <Table columns={columns} dataSource={data} rowKey="id" size="small" loading={loading} />
      </Card>

      <Modal
        title="Thông tin mục tiêu"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Tiêu đề (Vd: Tầm nhìn 2030)" rules={[{ required: true }]}>
             <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
             <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
