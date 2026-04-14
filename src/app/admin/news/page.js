"use client";
import React, { useState } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { newsData } from "@/data/news";

const { Title, Text } = Typography;

export default function NewsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const [data, setData] = useState(newsData);

  const columns = [
    { 
      title: "Ảnh đại diện", 
      dataIndex: "image", 
      key: "image", 
      width: 120,
      render: (img) => <Image src={img || "https://khienha.vn/uploads/anh/79371608532527Tau 9000T.jpg"} width={80} className="rounded object-cover" />
    },
    { title: "Ngày", dataIndex: "date", key: "date", width: 120 },
    { title: "Tiêu đề tin tức", dataIndex: "title", key: "title", ellipsis: true },
    { 
      title: "Loại tin", 
      dataIndex: "category", 
      key: "category",
      render: (cat) => <Tag color="blue">{cat || "HÀNG HẢI"}</Tag>
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
    message.success("Đã xóa tin tức thành công");
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (values.id) {
        setData(data.map(item => item.id === values.id ? { ...item, ...values } : item));
        message.success("Cập nhật tin tức thành công");
      } else {
        setData([{ ...values, id: Date.now() }, ...data]);
        message.success("Đăng tin mới thành công");
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
             <FileTextOutlined className="text-primary" /> Quản Lý Tin Tức & Hoạt Động
          </Title>
          <Text type="secondary">Đăng bài viết mới hoặc chỉnh sửa tin tức về nhà máy Khiên Hà.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Đăng tin mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa bài viết" : "Đăng tin tức mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu bài viết"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
               <Input placeholder="Nhập tiêu đề tin tức..." />
            </Form.Item>
            <Form.Item name="category" label="Chuyên mục" initialValue="SẢN XUẤT">
               <Input placeholder="Vd: VẬN TẢI, SẢN XUẤT..." />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="date" label="Ngày đăng" rules={[{ required: true }]} initialValue={new Date().toLocaleDateString('vi-VN')}>
               <Input placeholder="Vd: 14/04/2026" />
            </Form.Item>
            <Form.Item name="image" label="URL Ảnh bìa">
               <Input placeholder="Dán link ảnh tại đây..." />
            </Form.Item>
          </div>
          <Form.Item name="content" label="Nội dung tóm tắt" rules={[{ required: true }]}>
             <Input.TextArea rows={4} placeholder="Nhập nội dung hiển thị ngắn gọn ở trang chủ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
