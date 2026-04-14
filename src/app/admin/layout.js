"use client";
import React, { useState } from "react";
import { Layout, Menu, Button, theme, ConfigProvider } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PictureOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  FlagOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Tổng quan</Link>,
    },
    {
      key: "/admin/banners",
      icon: <PictureOutlined />,
      label: <Link href="/admin/banners">Banner Slider</Link>,
    },
    {
      key: "/admin/news",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/news">Tin tức hoạt động</Link>,
    },
    {
      key: "/admin/history",
      icon: <HistoryOutlined />,
      label: <Link href="/admin/history">Lịch sử phát triển</Link>,
    },
    {
      key: "/admin/capacity",
      icon: <ThunderboltOutlined />,
      label: <Link href="/admin/capacity">Năng lực hoạt động</Link>,
    },
    {
      key: "/admin/quality",
      icon: <SafetyCertificateOutlined />,
      label: <Link href="/admin/quality">Quy trình chất lượng</Link>,
    },
    {
      key: "/admin/goals",
      icon: <FlagOutlined />,
      label: <Link href="/admin/goals">Mục tiêu chiến lược</Link>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0ea5e9",
          borderRadius: 6,
          fontSize: 13, // Smaller base font for compact feel
        },
      }}
    >
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="shadow-xl z-20" width={240}>
          <div className="p-6 flex items-center gap-3 mb-4 border-b border-gray-50">
             <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
             {!collapsed && (
               <div className="flex flex-col">
                 <span className="font-black text-[14px] leading-tight tracking-tighter">KHIÊN HÀ</span>
                 <span className="text-[9px] font-bold text-primary uppercase tracking-widest">ADMIN</span>
               </div>
             )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            className="border-none px-2"
          />
          <div className="absolute bottom-6 left-0 w-full px-6">
             <Button 
                type="text" 
                danger 
                icon={<LogoutOutlined />} 
                block 
                className="flex items-center justify-start h-10 font-bold text-xs"
             >
                {!collapsed && "Đăng xuất"}
             </Button>
          </div>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} className="flex items-center justify-between px-6 border-b border-gray-100 h-16">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 48, height: 48 }}
            />
            <div className="flex items-center gap-4">
               <Link href="/">
                  <Button icon={<HomeOutlined />} size="small" className="text-xs font-bold">Xem Website</Button>
               </Link>
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">AD</div>
            </div>
          </Header>
          <Content
            style={{
              margin: "20px 20px",
              padding: 20,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: 12,
            }}
            className="shadow-sm overflow-auto"
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
