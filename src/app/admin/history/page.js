"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from "@ant-design/icons";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function HistoryManager() {
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
      setData(content.history || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const syncToDB = async (currentData) => {
    const updatedContent = { ...originalContent, history: currentData };
    const success = await updateSiteContent(updatedContent);
    if (success) {
      message.success("Đã lưu thay đổi vào MongoDB");
      loadData();
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa cột mốc này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
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
    { title: "Năm", dataIndex: "year", key: "year", width: 100 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", width: 250 },
    { title: "Nội dung", dataIndex: "content", key: "content" },
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
             <HistoryOutlined className="text-primary" /> Quản Lý Lịch Sử (Live persistence)
          </Title>
          <Text type="secondary" className="text-xs">Dữ liệu được lưu trữ chuyên nghiệp trên Cloud.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg text-xs"
        >
          Thêm cột mốc
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} size="small" />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true }]}>
             <Input placeholder="Vd: 2024" />
          </Form.Item>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
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
