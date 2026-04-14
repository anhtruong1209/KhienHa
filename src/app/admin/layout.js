"use client";
import React from "react";
import { Layout, Menu, Button, Space, Avatar, ConfigProvider } from "antd";
import {
  MenuUnfoldOutlined,
  PictureOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  FlagOutlined,
  DashboardOutlined,
  LogoutOutlined,
  GlobalOutlined,
  UserOutlined
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Tổng quan" },
    { key: "/admin/banners", icon: <PictureOutlined />, label: "Banner Slider" },
    { key: "/admin/news", icon: <FileTextOutlined />, label: "Tin tức hoạt động" },
    { key: "/admin/history", icon: <HistoryOutlined />, label: "Lịch sử phát triển" },
    { key: "/admin/capacity", icon: <ThunderboltOutlined />, label: "Năng lực hoạt động" },
    { key: "/admin/quality", icon: <SafetyCertificateOutlined />, label: "Quy trình chất lượng" },
    { key: "/admin/goals", icon: <FlagOutlined />, label: "Mục tiêu chiến lược" },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0ea5e9",
          borderRadius: 8,
          fontSize: 13,
        },
      }}
    >
      <Layout className="min-h-screen bg-[#f8fafc]">
        <Sider 
          width={240} 
          theme="light" 
          className="border-r border-gray-100 hidden lg:block sticky top-0 h-screen"
        >
          <div className="p-6 flex flex-col items-center justify-center border-b border-gray-50 bg-[#0f172a]">
            <img src="/logo.png" alt="Khiên Hà" className="w-10 h-10 object-contain mb-3 brightness-0 invert" />
            <div className="text-center">
               <div className="text-white text-[11px] font-black uppercase tracking-widest leading-none">KHIÊN HÀ</div>
               <div className="text-primary text-[9px] font-bold uppercase mt-1">ADMIN CONTROL</div>
            </div>
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            className="border-none mt-4 font-medium px-2"
            items={menuItems.map(item => ({
              ...item,
              onClick: () => { window.location.href = item.key },
              className: `rounded-xl mb-1 ${pathname === item.key ? '!bg-primary/5 !text-primary' : ''}`
            }))}
          />

          <div className="absolute bottom-6 left-0 right-0 px-6">
             <Button 
               block 
               danger 
               type="text"
               icon={<LogoutOutlined />} 
               className="h-9 rounded-xl text-[12px] font-bold flex items-center justify-center"
             >
               Đăng xuất
             </Button>
          </div>
        </Sider>

        <Layout>
          <Header className="bg-white px-6 h-14 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
            <Space>
               <MenuUnfoldOutlined className="text-gray-400 cursor-pointer lg:hidden" />
               <div className="lg:hidden px-2">
                  <img src="/logo.png" className="h-6" />
               </div>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2 hidden sm:block">Shipbuilding Management System</span>
            </Space>
            
            <Space size="large">
               <Button 
                 icon={<GlobalOutlined />} 
                 type="text" 
                 className="text-[12px] font-bold hover:text-primary h-9 rounded-lg"
                 onClick={() => window.open('/', '_blank')}
               >
                 Xem Website
               </Button>
               <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                  <div className="text-right hidden sm:block">
                     <div className="text-[11px] font-black leading-none">TRƯƠNG NCPT</div>
                     <div className="text-[9px] font-bold text-primary uppercase mt-1">Administrator</div>
                  </div>
                  <Avatar icon={<UserOutlined />} className="bg-[#0f172a]" />
               </div>
            </Space>
          </Header>

          <Content className="p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
