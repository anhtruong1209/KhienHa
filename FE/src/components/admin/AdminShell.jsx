"use client";

import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FlagOutlined,
  GlobalOutlined,
  HistoryOutlined,
  LogoutOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Avatar, Button, ConfigProvider, Layout, Menu, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { getAdminSession, logoutAdmin } from "@/lib/admin-session";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const navItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Tổng quan" },
  { key: "/admin/site", icon: <AppstoreOutlined />, label: "Nội dung trang" },
  { key: "/admin/banners", icon: <PictureOutlined />, label: "Ảnh bìa" },
  { key: "/admin/news", icon: <FileTextOutlined />, label: "Tin tức" },
  { key: "/admin/gallery", icon: <FileImageOutlined />, label: "Thư viện" },
  { key: "/admin/history", icon: <HistoryOutlined />, label: "Lịch sử" },
  { key: "/admin/capacity", icon: <ThunderboltOutlined />, label: "Năng lực" },
  { key: "/admin/quality", icon: <SafetyCertificateOutlined />, label: "Chất lượng" },
  { key: "/admin/goals", icon: <FlagOutlined />, label: "Mục tiêu" },
];

function normalizePath(pathname) {
  if (!pathname) return "/admin";
  if (pathname !== "/admin" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function adminHref(pathname) {
  if (!pathname || pathname === "/admin") {
    return "/admin/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function SidebarMenu({ pathname, onNavigate }) {
  function handleMenuClick({ key }) {
    const nextPath = `${key || ""}`;

    onNavigate?.();

    if (typeof window === "undefined") {
      return;
    }

    if (normalizePath(window.location.pathname) === nextPath) {
      return;
    }

    window.location.assign(adminHref(nextPath));
  }

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      onClick={handleMenuClick}
      className="border-none bg-transparent"
      items={navItems.map((item) => ({
        key: item.key,
        icon: <span className="text-[13px]">{item.icon}</span>,
        label: <span className="block py-0.5 text-[12px] font-medium">{item.label}</span>,
      }))}
    />
  );
}

function BrandCard() {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-2.5 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b6aa2]">
          <img src="/logo.png" alt="Khiên Hà" className="h-6 w-6 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-slate-900">Khiên Hà CMS</div>
        </div>
      </div>
    </div>
  );
}

function AdminTheme({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0b6aa2",
          borderRadius: 10,
          fontSize: 12,
          colorTextBase: "#0f172a",
          colorBgLayout: "#f6f8fb",
        },
        components: {
          Layout: {
            headerBg: "transparent",
            headerHeight: 48,
            siderBg: "transparent",
            bodyBg: "transparent",
          },
          Menu: {
            itemBg: "transparent",
            itemColor: "#334155",
            itemHoverColor: "#0f172a",
            itemHoverBg: "#f1f5f9",
            itemSelectedBg: "#e8f2f9",
            itemSelectedColor: "#0b6aa2",
            itemBorderRadius: 10,
            itemMarginBlock: 1,
            itemHeight: 34,
            itemPaddingInline: 10,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}

export default function AdminShell({ children }) {
  const pathname = normalizePath(usePathname());
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isLoginPage = pathname === "/admin/login";
  const activeItem = navItems.find((item) => item.key === pathname) || {
    label: "Ẩn",
  };

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const session = await getAdminSession().catch(() => null);

      if (!active) {
        return;
      }

      const authenticated = Boolean(session?.authenticated);
      setIsAuthenticated(authenticated);
      setAuthChecked(true);

      if (isLoginPage && authenticated) {
        router.replace("/admin");
        return;
      }

      if (!isLoginPage && !authenticated) {
        const nextPath = pathname && pathname !== "/admin/login" ? `?next=${encodeURIComponent(pathname)}` : "";
        router.replace(`/admin/login${nextPath}`);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutAdmin();
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
      router.replace("/admin/login");
    }
  }

  if (!authChecked) {
    return (
      <AdminTheme>
        <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </AdminTheme>
    );
  }

  if (isLoginPage) {
    return (
      <AdminTheme>
        <div className="min-h-screen bg-[#f6f8fb]">{children}</div>
      </AdminTheme>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminTheme>
      <div className="min-h-screen bg-[#f6f8fb]">
        <Layout className="min-h-screen bg-transparent">
          <Sider width={210} trigger={null} className="bg-transparent px-3 py-3">
            <div className="flex h-full flex-col gap-3 rounded-[18px] border border-slate-200 bg-white/90 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <BrandCard />

              <div className="min-h-0 flex-1">
                <Text className="px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Điều hướng</Text>
                <div className="mt-1.5">
                  <SidebarMenu pathname={pathname} />
                </div>
              </div>
            </div>
          </Sider>

          <Layout className="bg-transparent">
            <Header className="px-3 pb-0 pt-3">
              <div className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-white px-3 py-2 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                  <span className="font-medium uppercase tracking-[0.12em]">Trang hiện tại</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-950">{activeItem.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    icon={<GlobalOutlined />}
                    size="small"
                    className="rounded-lg border-slate-200 bg-white font-medium shadow-none"
                    onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
                  >
                    Xem website
                  </Button>
                  <Button
                    icon={<LogoutOutlined />}
                    loading={loggingOut}
                    size="small"
                    className="rounded-lg border-slate-200 bg-white font-medium shadow-none"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                  <Avatar size={26} icon={<UserOutlined />} className="bg-[#0b6aa2]" />
                </div>
              </div>
            </Header>

            <Content className="px-3 pb-6 pt-3 lg:px-4">
              <div className="mx-auto w-full max-w-[1560px]">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </AdminTheme>
  );
}
