"use client";

import React, { startTransition, useEffect, useState } from "react";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import {
  DashboardOutlined,
  FileImageOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { getNews, getSiteContent } from "@/services/api";

const { Text, Title } = Typography;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState({
    newsCount: 0,
    bannerCount: 0,
    galleryCount: 0,
    qualityStepCount: 0,
    capacityCount: 0,
    historyCount: 0,
    goalCount: 0,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const [newsData, siteData] = await Promise.all([getNews(true), getSiteContent(true)]);
      if (!active) return;

      startTransition(() => {
        setNews((newsData || []).slice(0, 6));
        setStats({
          newsCount: newsData?.length || 0,
          bannerCount: siteData?.banners?.length || 0,
          galleryCount: siteData?.gallery?.length || 0,
          qualityStepCount: siteData?.quality?.steps?.length || 0,
          capacityCount: siteData?.capacity?.length || 0,
          historyCount: siteData?.history?.length || 0,
          goalCount: siteData?.goals?.length || 0,
        });
      });
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const overviewCards = [
    {
      key: "news",
      title: "Tin tức hiển thị",
      value: stats.newsCount,
      icon: <FileTextOutlined className="text-2xl text-sky-700" />,
      accent: "from-sky-50 to-white",
    },
    {
      key: "banners",
      title: "Banner trang chủ",
      value: stats.bannerCount,
      icon: <FileImageOutlined className="text-2xl text-cyan-700" />,
      accent: "from-cyan-50 to-white",
    },
    {
      key: "quality",
      title: "Bước chất lượng",
      value: stats.qualityStepCount,
      icon: <SafetyCertificateOutlined className="text-2xl text-emerald-700" />,
      accent: "from-emerald-50 to-white",
    },
    {
      key: "history",
      title: "Phát triển",
      value: stats.historyCount,
      icon: <HistoryOutlined className="text-2xl text-amber-600" />,
      accent: "from-amber-50 to-white",
    },
  ];

  const contentSummary = [
    {
      label: "Năng lực hoạt động",
      value: stats.capacityCount,
      icon: <ThunderboltOutlined className="text-[#0b6aa2]" />,
    },
    {
      label: "Gallery dự án",
      value: stats.galleryCount,
      icon: <FileImageOutlined className="text-[#0b6aa2]" />,
    },
    {
      label: "Mục tiêu chiến lược",
      value: stats.goalCount,
      icon: <DashboardOutlined className="text-[#0b6aa2]" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div style={{ marginTop: "10px" }}>
      </div>

      <Row gutter={[18, 18]}>
        {overviewCards.map((item) => (
          <Col key={item.key} xs={24} md={12} xl={6}>
            <Card bordered={false} loading={loading} className={`rounded-[28px] bg-gradient-to-br ${item.accent} shadow-[0_18px_50px_rgba(15,23,42,0.06)]`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Text className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">{item.title}</Text>
                  <div className="mt-4 text-[34px] font-black leading-none text-slate-900">{item.value}</div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">{item.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={15}>
          <Card
            bordered={false}
            className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            title={<span className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">Tin tức cập nhật gần đây</span>}
          >
            <Table
              size="middle"
              pagination={false}
              rowKey="_id"
              loading={loading}
              dataSource={news}
              columns={[
                {
                  title: "Tiêu đề",
                  dataIndex: "title",
                  key: "title",
                  render: (_, record) => (
                    <div>
                      <div className="font-semibold text-slate-900">{record.title}</div>
                      <div className="mt-1 line-clamp-2 text-xs text-slate-500">{record.excerpt}</div>
                    </div>
                  ),
                },
                {
                  title: "Chuyên mục",
                  dataIndex: "category",
                  key: "category",
                  width: 160,
                  render: (value) => <Tag color="blue">{value}</Tag>,
                },
                {
                  title: "Ngày đăng",
                  dataIndex: "date",
                  key: "date",
                  width: 120,
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card
            bordered={false}
            className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            title={<span className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">Tình trạng nội dung website</span>}
          >
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[#0b6aa2] px-5 py-4 text-white">
                <Text className="text-sm !text-sky-100">Dashboard chỉ còn các nhóm nội dung đang dùng thực tế, bỏ phần khách hàng theo yêu cầu của bạn.</Text>
              </div>

              {contentSummary.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{item.label}</div>
                      <div className="text-xl font-black text-slate-900">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
