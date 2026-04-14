"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Upload, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function CapacityManager() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [originalContent, setOriginalContent] = useState({});

  const loadData = async () => {
    setLoading(true);
    const content = await getSiteContent();
    if (content) {
      setOriginalContent(content);
      setData(content.capacity || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = (info) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      form.setFieldsValue({ image: e.target.result });
    };
    reader.readAsDataURL(info.file.originFileObj);
  };

  const syncToDB = async (currentData) => {
    const updatedContent = { ...originalContent, capacity: currentData };
    const success = await updateSiteContent(updatedContent);
    if (success) {
      message.success("Đã lưu vào Cloud");
      loadData();
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa năng lực này?',
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
    { 
      title: "Ảnh", 
      dataIndex: "image", 
      key: "image", 
      width: 100,
      render: (img) => <Image src={img} width={60} className="rounded-lg object-cover h-10" />
    },
    { title: "Phân loại", dataIndex: "category", key: "category", width: 120 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", width: 220 },
    { title: "Chi tiết", dataIndex: "detail", key: "detail", ellipsis: true },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => { 
            form.setFieldsValue(record); 
            setImageUrl(record.image);
            setIsModalOpen(true); 
          }} />
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
             <ThunderboltOutlined className="text-primary" /> Quản lý Năng lực (Hỗ trợ Upload)
          </Title>
          <Text type="secondary" className="text-xs">Chỉnh sửa nội dung và tải ảnh thực tế lên hệ thống.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setImageUrl(""); setIsModalOpen(true); }}
           className="h-10 rounded-lg text-xs"
        >
          Thêm năng lực
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" size="small" loading={loading} />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa năng lực" : "Thêm mới năng lực"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Phân loại" rules={[{ required: true }]}>
               <Input placeholder="Vd: Con người, Hạ tầng..." />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
               <Input />
            </Form.Item>
          </div>
          <Form.Item label="Tải ảnh minh họa">
             <Upload 
                listType="picture-card" 
                maxCount={1} 
                beforeUpload={() => false} 
                onChange={handleUpload}
                showUploadList={false}
             >
               {imageUrl ? <img src={imageUrl} alt="preview" style={{ width: '100%' }} /> : (
                 <div className="flex flex-col items-center">
                   <PlusOutlined />
                   <div className="mt-2 text-xs">Tải ảnh</div>
                 </div>
               )}
             </Upload>
          </Form.Item>
          <Form.Item name="image" hidden><Input /></Form.Item>
          <Form.Item name="detail" label="Mô tả kỹ thuật chi tiết" rules={[{ required: true }]}>
             <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="icon" label="Tên Icon (Users, Building2, Cpu, Wind)" initialValue="Building2">
             <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
