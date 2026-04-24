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
  MenuOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Avatar, Button, ConfigProvider, Drawer, Layout, Menu, Typography } from "antd";
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
        icon: <span className="text-[15px]">{item.icon}</span>,
        label: <span className="block py-0.5 text-[13px] font-medium">{item.label}</span>,
      }))}
    />
  );
}

function BrandCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b6aa2]">
          <img src="/logo.png" alt="Khiên Hà" className="h-8 w-8 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[18px] font-semibold text-slate-900">Khiên Hà CMS</div>
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
          borderRadius: 12,
          fontSize: 13,
          colorTextBase: "#0f172a",
          colorBgLayout: "#f6f8fb",
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
            itemHoverBg: "#f1f5f9",
            itemSelectedBg: "#e8f2f9",
            itemSelectedColor: "#0b6aa2",
            itemBorderRadius: 12,
            itemMarginBlock: 2,
            itemHeight: 40,
            itemPaddingInline: 12,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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
          <Sider width={280} breakpoint="xl" collapsedWidth={0} trigger={null} className="hidden bg-transparent px-4 py-4 xl:block">
            <div className="flex h-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <BrandCard />

              <div className="min-h-0 flex-1">
                <Text className="px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Điều hướng</Text>
                <div className="mt-2">
                  <SidebarMenu pathname={pathname} />
                </div>
              </div>
            </div>
          </Sider>

          <Layout className="bg-transparent">
            <Header className="px-4 pb-0 pt-4 lg:px-5 xl:px-6">
              <div className="flex flex-col gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="text"
                    icon={<MenuOutlined className="text-base" />}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 xl:hidden"
                    onClick={() => setDrawerOpen(true)}
                  />
                  <div className="flex items-center gap-2 text-[13px] text-slate-500">
                    <span className="font-medium uppercase tracking-[0.14em]">Trang hiện tại</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-semibold text-slate-950">{activeItem.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    icon={<GlobalOutlined />}
                    type="default"
                    className="h-10 rounded-xl border-slate-200 bg-white px-3.5 font-medium shadow-none"
                    onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
                  >
                    Xem website
                  </Button>
                  <Button
                    icon={<LogoutOutlined />}
                    loading={loggingOut}
                    className="h-10 rounded-xl border-slate-200 bg-white px-3.5 font-medium shadow-none"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                  <div className="flex items-center gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-2">
                    <Avatar size={34} icon={<UserOutlined />} className="bg-[#0b6aa2]" />
                  </div>
                </div>
              </div>
            </Header>

            <Content className="px-4 pb-8 pt-5 lg:px-5 xl:px-6">
              <div className="mx-auto w-full max-w-[1560px]">{children}</div>
            </Content>
          </Layout>
        </Layout>

        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size={300}
          className="xl:hidden"
          styles={{
            body: {
              padding: 0,
              background: "#f6f8fb",
            },
            header: {
              display: "none",
            },
          }}
        >
          <div className="flex h-full flex-col gap-4 p-4">
            <BrandCard />
            <div className="flex-1 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <SidebarMenu pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <Button
              block
              icon={<GlobalOutlined />}
              className="h-10 rounded-xl border-slate-200 bg-white text-slate-900 hover:!border-[#0b6aa2] hover:!text-[#0b6aa2]"
              onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
            >
              Xem website
            </Button>
            <Button
              block
              icon={<LogoutOutlined />}
              loading={loggingOut}
              className="h-10 rounded-xl border-slate-200 bg-white text-slate-900 hover:!border-[#0b6aa2] hover:!text-[#0b6aa2]"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </Drawer>
      </div>
    </AdminTheme>
  );
}
