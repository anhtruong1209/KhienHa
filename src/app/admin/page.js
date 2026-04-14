"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Typography, Space, List, Tag, Table } from "antd";
import { 
  FileTextOutlined, 
  PictureOutlined, 
  HistoryOutlined, 
  ThunderboltOutlined, 
  DashboardOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { getNews, getSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    bannerCount: 0,
    capacityCount: 0,
    historyCount: 0
  });
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function load() {
      const newsData = await getNews();
      const siteData = await getSiteContent();
      
      setStats({
        newsCount: newsData?.length || 0,
        bannerCount: siteData?.banners?.length || 0,
        capacityCount: siteData?.capacity?.length || 0,
        historyCount: siteData?.history?.length || 0
      });
      setNews((newsData || []).slice(0, 5));
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Title level={4} className="!m-0 flex items-center gap-2">
           <DashboardOutlined className="text-primary" /> Tổng Quan Hệ Thống
        </Title>
        <Text type="secondary" className="text-xs">Theo dõi và quản lý toàn bộ dữ liệu của website Khiên Hà.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title={<span className="text-[11px] font-bold uppercase text-gray-400">Tin tức hoạt động</span>}
              value={stats.newsCount}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ fontSize: '24px', fontWeight: '900' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title={<span className="text-[11px] font-bold uppercase text-gray-400">Banner Slider</span>}
              value={stats.bannerCount}
              prefix={<PictureOutlined className="text-purple-500 mr-2" />}
              valueStyle={{ fontSize: '24px', fontWeight: '900' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title={<span className="text-[11px] font-bold uppercase text-gray-400">Năng lực cốt lõi</span>}
              value={stats.capacityCount}
              prefix={<ThunderboltOutlined className="text-orange-500 mr-2" />}
              valueStyle={{ fontSize: '24px', fontWeight: '900' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic 
              title={<span className="text-[11px] font-bold uppercase text-gray-400">Trạng thái MongoDB</span>}
              value="Connected"
              prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
              valueStyle={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col lg={16} xs={24}>
          <Card 
            title={<span className="text-xs font-black uppercase">Tin tức mới cập nhật</span>} 
            bordered={false} 
            className="shadow-sm"
            extra={<a href="/admin/news" className="text-[11px] font-bold">Quản lý</a>}
          >
            <Table 
              size="small"
              pagination={false}
              dataSource={news}
              rowKey="id"
              columns={[
                { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
                { title: 'Ngày', dataIndex: 'date', key: 'date', width: 120 },
                { title: 'Loại', dataIndex: 'category', key: 'category', render: (c) => <Tag color="blue" className="text-[10px]">{c}</Tag> }
              ]}
            />
          </Card>
        </Col>
        <Col lg={8} xs={24}>
          <Card 
             title={<span className="text-xs font-black uppercase">Cột mốc lịch sử</span>} 
             bordered={false} 
             className="shadow-sm"
          >
             <List
                size="small"
                dataSource={Array.from({ length: stats.historyCount })}
                renderItem={(_, i) => (
                  <List.Item className="text-xs font-medium">
                    <Space><HistoryOutlined className="text-gray-300" /> Bản ghi lịch sử #{i+1}</Space>
                  </List.Item>
                )}
             />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
