"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Card, Typography, Modal, Form, Input, message, Image, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import { getSiteContent, updateSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function BannerManager() {
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
      const banners = (content.banners || []).map((url, index) => ({
        id: index + 1,
        url: url,
        title: `Banner ${index + 1}`
      }));
      setData(banners);
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
      form.setFieldsValue({ url: e.target.result });
    };
    reader.readAsDataURL(info.file.originFileObj);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xóa Banner?',
      content: 'Lưu ý: Bạn cần nhấn "Lưu thay đổi" sau khi xóa để cập nhật lên hệ thống.',
      onOk: () => {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
        syncToDB(newData);
      }
    });
  };

  const syncToDB = async (currentData) => {
    const bannerUrls = currentData.map(item => item.url);
    const updatedContent = { ...originalContent, banners: bannerUrls };
    const success = await updateSiteContent(updatedContent);
    if (success) {
      message.success("Đã đồng bộ dữ liệu với Cloud");
      loadData();
    }
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
      title: "Hình ảnh", 
      dataIndex: "url", 
      key: "url", 
      width: 200,
      render: (url) => <Image src={url} width={150} className="rounded-lg shadow-sm h-24 object-cover" />
    },
    { title: "Tên Banner", dataIndex: "title", key: "title" },
    { title: "Dữ liệu", dataIndex: "url", key: "url_text", ellipsis: true },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => { 
            form.setFieldsValue(record); 
            setImageUrl(record.url);
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
             <PictureOutlined className="text-primary" /> Quản Lý Banner (Upload Ảnh)
          </Title>
          <Text type="secondary" className="text-xs">Tải ảnh lên để thay đổi Slider ngay lập tức.</Text>
        </Space>
        <Button 
           type="primary" 
           icon={<PlusOutlined />} 
           onClick={() => { form.resetFields(); setImageUrl(""); setIsModalOpen(true); }}
           className="h-10 rounded-lg"
        >
          Thêm Banner mới
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
      </Card>

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa Banner" : "Tải lên Banner mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="title" label="Ghi chú Banner" rules={[{ required: true }]}>
             <Input placeholder="Vd: Banner mới năm 2024" />
          </Form.Item>
          <Form.Item label="Chọn ảnh tải lên">
             <Upload 
                listType="picture-card" 
                maxCount={1} 
                beforeUpload={() => false} 
                onChange={handleUpload}
                showUploadList={false}
             >
               {imageUrl ? <img src={imageUrl} alt="preview" style={{ width: '100%', borderRadius: '8px' }} /> : (
                 <div className="flex flex-col items-center">
                   <PlusOutlined />
                   <div className="mt-2 text-xs">Tải ảnh lên</div>
                 </div>
               )}
             </Upload>
          </Form.Item>
          <Form.Item name="url" hidden><Input /></Form.Item>
          <div className="p-3 bg-gray-50 rounded-lg text-[11px] text-gray-500">
             Lưu ý: Ảnh sau khi upload sẽ được lưu vĩnh viễn trên Database Cloud.
          </div>
        </Form>
      </Modal>
    </div>
  );
}
