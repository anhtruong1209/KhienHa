"use client";
import React from "react";
import { Row, Col, Card, Statistic, List, Badge, Typography, Space } from "antd";
import { 
  HistoryOutlined, 
  ThunderboltOutlined, 
  SafetyCertificateOutlined, 
  FlagOutlined,
  EyeOutlined,
  EditOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const stats = [
    { title: "Lịch sử", value: 12, icon: <HistoryOutlined className="text-blue-500" /> },
    { title: "Năng lực", value: 45, icon: <ThunderboltOutlined className="text-yellow-500" /> },
    { title: "Quy trình", value: 8, icon: <SafetyCertificateOutlined className="text-green-500" /> },
    { title: "Mục tiêu", value: 5, icon: <FlagOutlined className="text-red-500" /> },
  ];

  const recentActivities = [
    { type: "Cập nhật", module: "Năng lực hoạt động", time: "2 giờ trước", user: "Admin" },
    { type: "Thêm mới", module: "Lịch sử phát triển", time: "5 giờ trước", user: "Admin" },
    { type: "Chỉnh sửa", module: "Mục tiêu chiến lược", time: "Hôm qua", user: "Manager" },
  ];

  return (
    <div>
      <Title level={3}>Trang Quản Trị Hệ Thống</Title>
      <Text type="secondary">Chào mừng bạn trở lại! Dưới đây là tóm tắt dữ liệu hiện tại của nhà máy.</Text>
      
      <Row gutter={[16, 16]} className="mt-8">
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                prefix={stat.icon} 
                valueStyle={{ fontWeight: "bold" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-8">
        <Col span={16}>
          <Card 
            title="Quản lý 4 mục nội dung cốt lõi" 
            bordered={false} 
            className="shadow-sm"
            extra={<Space><EyeOutlined /> <EditOutlined /></Space>}
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: "Lịch sử phát triển nhà máy", status: "Đang hoạt động", color: "green" },
                { title: "Năng lực hoạt động", status: "Đang hoạt động", color: "green" },
                { title: "Quy trình quản lý chất lượng", status: "Bản nháp", color: "orange" },
                { title: "Mục tiêu", status: "Đang hoạt động", color: "green" },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[<a key="edit">Sửa</a>, <a key="view">Xem</a>]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={<Badge status="processing" color={item.color} text={item.status} />}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Hoạt động gần đây" bordered={false} className="shadow-sm">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex flex-col gap-1">
                    <Text strong>{item.type} {item.module}</Text>
                    <Space split={<div className="w-1 h-1 rounded-full bg-gray-300" />}>
                       <Text type="secondary" size="small">{item.time}</Text>
                       <Text type="secondary" size="small">bởi {item.user}</Text>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
