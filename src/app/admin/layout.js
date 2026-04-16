"use client";

import React from "react";
import { Avatar, Button, ConfigProvider, Layout, Menu, Space } from "antd";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FlagOutlined,
  GlobalOutlined,
  HistoryOutlined,
  MailOutlined,
  MenuUnfoldOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Tổng quan" },
  { key: "/admin/site", icon: <AppstoreOutlined />, label: "Site content" },
  { key: "/admin/banners", icon: <PictureOutlined />, label: "Banner slider" },
  { key: "/admin/news", icon: <FileTextOutlined />, label: "Tin tức" },
  { key: "/admin/gallery", icon: <FileImageOutlined />, label: "Gallery dự án" },
  { key: "/admin/history", icon: <HistoryOutlined />, label: "Lịch sử phát triển" },
  { key: "/admin/capacity", icon: <ThunderboltOutlined />, label: "Năng lực hoạt động" },
  { key: "/admin/quality", icon: <SafetyCertificateOutlined />, label: "Quy trình chất lượng" },
  { key: "/admin/goals", icon: <FlagOutlined />, label: "Mục tiêu chiến lược" },
  { key: "/admin/messages", icon: <MailOutlined />, label: "Liên hệ khách hàng" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0ea5e9",
          borderRadius: 14,
          fontSize: 13,
        },
      }}
    >
      <Layout className="min-h-screen bg-[#f4f8fc]">
        <Sider width={250} theme="light" className="sticky top-0 hidden h-screen border-r border-slate-100 lg:block">
          <div className="border-b border-slate-100 bg-[#0f172a] px-6 py-7 text-center">
            <img src="/logo.png" alt="Khiên Hà" className="mx-auto mb-3 h-12 w-12 object-contain brightness-0 invert" />
            <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white">KHIÊN HÀ</div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-primary">CMS Dashboard</div>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            className="mt-4 border-none bg-transparent px-3"
            items={menuItems.map((item) => ({
              ...item,
              onClick: () => {
                window.location.href = item.key;
              },
              className: `mb-1 rounded-2xl ${pathname === item.key ? "!bg-primary/10 !text-primary" : ""}`,
            }))}
          />
        </Sider>

        <Layout>
          <Header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
            <Space>
              <MenuUnfoldOutlined className="cursor-pointer text-slate-400 lg:hidden" />
              <div className="hidden text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 sm:block">
                Khien Ha Shipyard Content Management
              </div>
            </Space>

            <Space size="large">
              <Button
                icon={<GlobalOutlined />}
                type="text"
                className="h-10 rounded-xl text-[12px] font-black"
                onClick={() => window.open("/", "_blank")}
              >
                Xem website
              </Button>
              <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <div className="hidden text-right sm:block">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0f172a]">Administrator</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Laravel CMS</div>
                </div>
                <Avatar icon={<UserOutlined />} className="bg-[#0f172a]" />
              </div>
            </Space>
          </Header>

          <Content className="p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
