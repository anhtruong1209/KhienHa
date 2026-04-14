"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Tag, Image, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { getNews } from "@/services/api";

const { Title, Text } = Typography;

export default function NewsManager() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");

  const loadData = async () => {
    setLoading(true);
    const news = await getNews();
    setData(news || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = (info) => {
    if (info.file.status === 'done' || info.file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        form.setFieldsValue({ image: e.target.result });
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleDelete = async (record) => {
    modalConfirm(record._id);
  };

  const modalConfirm = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa tin này?',
      content: 'Hành động này sẽ xóa vĩnh viễn dữ liệu khỏi MongoDB.',
      okText: 'Xóa ngay',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
            message.success("Đã xóa tin tức");
            loadData();
          }
        } catch (e) {
          message.error("Lỗi khi xóa");
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, image: imageUrl || values.image };
      
      const method = values._id ? 'PUT' : 'POST';
      const res = await fetch('/api/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success(values._id ? "Cập nhật thành công" : "Đăng tin thành công");
        setIsModalOpen(false);
        loadData();
      }
    } catch (e) {
      message.error("Lỗi hệ thống");
    }
  };

  const columns = [
    { 
      title: "Ảnh bìa", 
      dataIndex: "image", 
      key: "image", 
      width: 120,
      render: (img) => <Image src={img} width={80} className="rounded object-cover h-14" />
    },
    { title: "Ngày", dataIndex: "date", key: "date", width: 120 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
    { 
      title: "Loại tin", 
      dataIndex: "category", 
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => { 
            form.setFieldsValue(record); 
            setImageUrl(record.image);
            setIsModalOpen(true); 
          }} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Space direction="vertical">
          <Title level={4} className="!m-0 flex items-center gap-2">
             <FileTextOutlined className="text-primary" /> Quản Lý Tin Tức (MongoDB Live)
          </Title>
          <Text type="secondary" className="text-xs">Dữ liệu được lưu trữ và đồng bộ hóa trực tiếp trên Cloud.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setImageUrl(""); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Đăng tin mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="_id" loading={loading} />
      </Card>

      <Modal
        title={form.getFieldValue("_id") ? "Chỉnh sửa bài viết" : "Đăng tin tức mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="_id" hidden><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
               <Input placeholder="Nhập tiêu đề..." />
            </Form.Item>
            <Form.Item name="category" label="Chuyên mục" initialValue="SẢN XUẤT">
               <Input placeholder="Vd: VẬN TẢI, SẢN XUẤT..." />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Form.Item label="Upload Ảnh bìa">
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
                     <div className="mt-2 text-xs">Tải ảnh lên</div>
                   </div>
                 )}
               </Upload>
            </Form.Item>
            <Form.Item name="date" label="Ngày đăng" rules={[{ required: true }]} initialValue={new Date().toLocaleDateString('vi-VN')}>
               <Input placeholder="Vd: 14/04/2026" />
            </Form.Item>
          </div>
          <Form.Item name="content" label="Nội dung tóm tắt" rules={[{ required: true }]}>
             <Input.TextArea rows={4} placeholder="Nhập nội dung hiển thị..." />
          </Form.Item>
          <Form.Item name="image" hidden><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
