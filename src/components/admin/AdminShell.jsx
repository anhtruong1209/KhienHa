"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FlagOutlined,
  GlobalOutlined,
  HistoryOutlined,
  MenuOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, ConfigProvider, Drawer, Layout, Menu, Tag, Typography } from "antd";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const navItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Tổng quan", hint: "Các chỉ số và nội dung mới nhất" },
  { key: "/admin/site", icon: <AppstoreOutlined />, label: "Site content", hint: "Hero, giới thiệu, liên hệ" },
  { key: "/admin/banners", icon: <PictureOutlined />, label: "Banner trang chủ", hint: "Slider và ảnh nổi bật" },
  { key: "/admin/news", icon: <FileTextOutlined />, label: "Tin tức", hint: "Bài viết, trạng thái và hình ảnh" },
  { key: "/admin/gallery", icon: <FileImageOutlined />, label: "Gallery dự án", hint: "Ảnh công trình và sản phẩm" },
  { key: "/admin/history", icon: <HistoryOutlined />, label: "Lịch sử phát triển", hint: "Các cột mốc doanh nghiệp" },
  { key: "/admin/capacity", icon: <ThunderboltOutlined />, label: "Năng lực hoạt động", hint: "Con người, hạ tầng, thiết bị" },
  { key: "/admin/quality", icon: <SafetyCertificateOutlined />, label: "Quy trình chất lượng", hint: "Sơ đồ và các bước kiểm soát" },
  { key: "/admin/goals", icon: <FlagOutlined />, label: "Mục tiêu chiến lược", hint: "Tầm nhìn, sứ mệnh, cam kết" },
];

function normalizePath(pathname) {
  if (!pathname) return "/admin";
  if (pathname !== "/admin" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function SidebarMenu({ pathname, onNavigate }) {
  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      className="border-none bg-transparent"
      items={navItems.map((item) => ({
        key: item.key,
        icon: <span className="text-base">{item.icon}</span>,
        label: (
          <Link href={item.key} prefetch className="block py-1" onClick={onNavigate}>
            <span className="text-[14px] font-semibold">{item.label}</span>
          </Link>
        ),
      }))}
    />
  );
}

function SidebarCard() {
  return (
    <div className="rounded-[26px] bg-gradient-to-br from-[#0b6aa2] via-[#0f5f8c] to-[#1b2a41] p-5 text-white shadow-[0_18px_50px_rgba(11,106,162,0.22)]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img src="/logo.png" alt="Khiên Hà" className="h-10 w-10 object-contain" />
        </div>
        <div>
          <Title level={5} className="!mb-1 !text-white">
            Khiên Hà CMS
          </Title>
          <Text className="text-[13px] text-sky-100">Quản trị nội dung nội bộ</Text>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] bg-white/12 px-4 py-3 backdrop-blur">
        <Text className="block text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-100">Kết nối dữ liệu</Text>
        <div className="mt-2 flex items-center justify-between">
          <Text className="text-sm font-semibold !text-white">MySQL local</Text>
          <Tag color="cyan" variant="filled" className="!mr-0 rounded-full px-3 text-[11px] font-medium">
            Online
          </Tag>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  const pathname = normalizePath(usePathname());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeItem = navItems.find((item) => item.key === pathname) || {
    label: "Mục ẩn",
    hint: "Trang này không còn xuất hiện trong điều hướng chính.",
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0b6aa2",
          borderRadius: 16,
          fontSize: 14,
          colorTextBase: "#0f172a",
          colorBgLayout: "#f4f7fb",
        },
        components: {
          Layout: {
            headerBg: "transparent",
            siderBg: "transparent",
            bodyBg: "transparent",
          },
          Menu: {
            itemBg: "transparent",
            itemColor: "#334155",
            itemHoverColor: "#0f172a",
            itemHoverBg: "#eff6fb",
            itemSelectedBg: "#e3f0f8",
            itemSelectedColor: "#0b6aa2",
            itemBorderRadius: 16,
            itemMarginBlock: 6,
            itemHeight: 46,
          },
        },
      }}
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(11,106,162,0.10),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#f2f5f9_100%)]">
        <Layout className="min-h-screen bg-transparent">
          <Sider width={280} breakpoint="xl" collapsedWidth={0} trigger={null} className="hidden bg-transparent px-5 py-5 xl:block">
            <div className="flex h-full flex-col gap-5 rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <SidebarCard />

              <div className="flex-1 rounded-[26px] border border-slate-200 bg-slate-50/85 p-3">
                <Text className="px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Điều hướng</Text>
                <div className="mt-3">
                  <SidebarMenu pathname={pathname} />
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-[#f4f8fb] p-5">
                <Text className="block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Trạng thái</Text>
                <Title level={5} className="!mb-1 !mt-3 !text-slate-900">
                  Giao diện đã gọn lại
                </Title>
                <Text className="text-[13px] leading-6 text-slate-600">
                  Sidebar ngắn hơn, nội dung được mở rộng ra để các form và bảng không còn bị bó hẹp.
                </Text>
              </div>
            </div>
          </Sider>

          <Layout className="bg-transparent">
            <Header className="px-4 pb-0 pt-4 lg:px-6 xl:px-8">
              <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] xl:flex-row xl:items-center xl:justify-between xl:px-6">
                <div className="flex items-start gap-3">
                  <Button
                    type="text"
                    icon={<MenuOutlined className="text-lg" />}
                    className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 xl:hidden"
                    onClick={() => setDrawerOpen(true)}
                  />
                  <div>
                    <Text className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-500">Trang hiện tại</Text>
                    <Title level={3} className="!mb-1 !mt-2 !text-slate-900">
                      {activeItem.label}
                    </Title>
                    <Text className="text-sm text-slate-500">{activeItem.hint}</Text>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Tag color="blue" variant="filled" className="!mr-0 rounded-full px-3 py-1 text-[12px] font-medium">
                    API 127.0.0.1:8000
                  </Tag>
                  <Button
                    icon={<GlobalOutlined />}
                    type="default"
                    className="h-11 rounded-2xl border-slate-200 bg-white px-4 font-semibold"
                    onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
                  >
                    Xem website
                  </Button>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                    <Avatar icon={<UserOutlined />} className="bg-[#0b6aa2]" />
                    <div>
                      <Text className="block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Quản trị viên</Text>
                      <Text className="text-sm font-semibold text-slate-900">Khien Ha Admin</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Header>

            <Content className="px-4 pb-8 pt-5 lg:px-6 xl:px-8">
              {children}
            </Content>
          </Layout>
        </Layout>

        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={310}
          className="xl:hidden"
          styles={{
            body: {
              padding: 0,
              background: "#f8fbff",
            },
            header: {
              display: "none",
            },
          }}
        >
          <div className="flex h-full flex-col gap-5 p-5">
            <SidebarCard />
            <div className="flex-1 rounded-[24px] border border-slate-200 bg-white p-3">
              <SidebarMenu pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <Button
              block
              icon={<GlobalOutlined />}
              className="h-11 rounded-2xl border-slate-200 bg-white text-slate-900 hover:!border-[#0b6aa2] hover:!text-[#0b6aa2]"
              onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
            >
              Xem website
            </Button>
          </div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
