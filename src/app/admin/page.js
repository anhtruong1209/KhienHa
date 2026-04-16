"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import {
  DashboardOutlined,
  FileImageOutlined,
  FileTextOutlined,
  MailOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { getContactMessages, getNews, getSiteContent } from "@/services/api";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    bannerCount: 0,
    capacityCount: 0,
    messageCount: 0,
    galleryCount: 0,
  });
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function load() {
      const [newsData, siteData, messages] = await Promise.all([getNews(), getSiteContent(), getContactMessages()]);

      setStats({
        newsCount: newsData?.length || 0,
        bannerCount: siteData?.banners?.length || 0,
        capacityCount: siteData?.capacity?.length || 0,
        messageCount: messages?.length || 0,
        galleryCount: siteData?.gallery?.length || 0,
      });
      setNews((newsData || []).slice(0, 5));
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={4} className="!m-0 flex items-center gap-2">
          <DashboardOutlined className="text-primary" /> Tổng quan hệ thống
        </Title>
        <Text type="secondary" className="text-xs">
          Theo dõi nhanh nội dung landing page, bài viết, gallery và yêu cầu tư vấn gửi từ biểu mẫu liên hệ.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<span className="text-[11px] font-black uppercase text-slate-400">Tin tức</span>}
              value={stats.newsCount}
              prefix={<FileTextOutlined className="mr-2 text-blue-500" />}
              valueStyle={{ fontSize: 24, fontWeight: 900 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<span className="text-[11px] font-black uppercase text-slate-400">Banner</span>}
              value={stats.bannerCount}
              prefix={<FileImageOutlined className="mr-2 text-cyan-500" />}
              valueStyle={{ fontSize: 24, fontWeight: 900 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<span className="text-[11px] font-black uppercase text-slate-400">Năng lực</span>}
              value={stats.capacityCount}
              prefix={<ThunderboltOutlined className="mr-2 text-orange-500" />}
              valueStyle={{ fontSize: 24, fontWeight: 900 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title={<span className="text-[11px] font-black uppercase text-slate-400">Liên hệ mới</span>}
              value={stats.messageCount}
              prefix={<MailOutlined className="mr-2 text-emerald-500" />}
              valueStyle={{ fontSize: 24, fontWeight: 900 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={<span className="text-xs font-black uppercase">Tin tức mới cập nhật</span>}
        bordered={false}
        className="shadow-sm"
      >
        <Table
          size="small"
          pagination={false}
          dataSource={news}
          rowKey="_id"
          columns={[
            { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
            { title: "Ngày", dataIndex: "date", key: "date", width: 120 },
            {
              title: "Loại",
              dataIndex: "category",
              key: "category",
              width: 140,
              render: (category) => <Tag color="blue">{category}</Tag>,
            },
          ]}
        />
        <div className="mt-4 text-xs text-slate-400">Gallery hiện có {stats.galleryCount} ảnh/dự án được hiển thị ngoài landing page.</div>
      </Card>
    </div>
  );
}
