"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Upload, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyCertificateOutlined, UploadOutlined } from "@ant-design/icons";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function QualityManager() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [processImage, setProcessImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [originalContent, setOriginalContent] = useState({});

  const loadData = async () => {
    setLoading(true);
    const content = await getSiteContent();
    if (content) {
      setOriginalContent(content);
      setData(content.quality?.steps || []);
      setProcessImage(content.quality?.mainImage || "");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMainImageUpload = (info) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result;
      setProcessImage(b64);
      const updatedContent = { 
        ...originalContent, 
        quality: { ...originalContent.quality, mainImage: b64 } 
      };
      const success = await updateSiteContent(updatedContent);
      if (success) message.success("Đã cập nhật ảnh sơ đồ quy trình");
    };
    reader.readAsDataURL(info.file.originFileObj);
  };

  const syncToDB = async (steps) => {
    const updatedContent = { 
      ...originalContent, 
      quality: { ...originalContent.quality, steps } 
    };
    const success = await updateSiteContent(updatedContent);
    if (success) {
      message.success("Đã đồng bộ Cloud");
      loadData();
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa bước này?',
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
    { title: "Giai đoạn", dataIndex: "step", key: "step", width: 150 },
    { title: "Tên quy trình / Bước thực hiện", dataIndex: "title", key: "title" },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
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
             <SafetyCertificateOutlined className="text-primary" /> Quản lý Quy trình Chất lượng
          </Title>
          <Text type="secondary" className="text-xs">Cấu hình sơ đồ và các bước kiểm soát chất lượng đóng tàu.</Text>
        </Space>
      </div>

      <Card 
        title={<span className="text-[11px] font-black uppercase">Ảnh Sơ đồ Quy trình (Main Flowchart)</span>}
        bordered={false} 
        className="shadow-sm mb-6"
        extra={
          <Upload showUploadList={false} beforeUpload={() => false} onChange={handleMainImageUpload}>
             <Button icon={<UploadOutlined />} size="small" type="primary" className="text-[10px] h-8 rounded-lg">Tải ảnh sơ đồ lên</Button>
          </Upload>
        }
      >
        <div className="flex justify-center bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-100 min-h-[200px] items-center">
           {processImage ? (
             <Image src={processImage} className="max-h-[400px] object-contain rounded-lg shadow-lg" />
           ) : (
             <Text type="secondary" className="text-xs">Chưa có ảnh sơ đồ quy trình. VUI LÒNG TẢI LÊN.</Text>
           )}
        </div>
      </Card>

      <Card 
        title={<span className="text-[11px] font-black uppercase">Chi tiết các bước thực hiện</span>}
        bordered={false} 
        className="shadow-sm"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalOpen(true); }} className="text-[10px] h-8 rounded-lg">Thêm bước</Button>
        }
      >
        <Table columns={columns} dataSource={data} rowKey="id" size="small" loading={loading} pagination={false} />
      </Card>

      <Modal title="Thêm/Sửa bước quy trình" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Lưu bước">
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="step" label="Số thứ tự / Giai đoạn" rules={[{ required: true }]}>
             <Input placeholder="Vd: Bước 1" />
          </Form.Item>
          <Form.Item name="title" label="Nội dung kiểm soát" rules={[{ required: true }]}>
             <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
