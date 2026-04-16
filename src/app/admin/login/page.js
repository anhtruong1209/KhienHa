"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { ArrowLeftOutlined, LockOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";

const { Text, Title } = Typography;

function sanitizeNextPath(value) {
  if (!value || !value.startsWith("/admin")) return "/admin";
  return value;
}

export default function AdminLoginPage() {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  async function handleSubmit(values) {
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Đăng nhập thất bại.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (submitError) {
      console.error(submitError);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(11,106,162,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_28%)]" />
      <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#0b6aa2]/10 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-[#071b2f]/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="overflow-hidden rounded-[32px] bg-[#071b2f] p-8 text-white shadow-[0_28px_90px_rgba(7,27,47,0.22)]">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <SafetyCertificateOutlined />
            Admin Access
          </div>

          <Title level={1} className="!mb-0 !mt-8 !text-[38px] !font-black !leading-tight !text-white">
            Đăng nhập quản trị
          </Title>
          <Text className="mt-4 block text-base leading-8 text-slate-300">
            Khu vực này chỉ dành cho người quản trị nội dung. Bạn cần nhập tài khoản và mật khẩu để vào CMS, không còn kiểu bấm là vào.
          </Text>

          <div className="mt-8 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Quản lý nội dung</div>
              <div className="mt-3 text-sm leading-7 text-slate-200">
                Chỉnh sửa banner, giới thiệu, tin tức, gallery và toàn bộ các khối nội dung hiển thị trên landing page.
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Phiên đăng nhập</div>
              <div className="mt-3 text-sm leading-7 text-slate-200">
                Sau khi xác thực thành công, hệ thống sẽ lưu phiên bằng cookie và tự chặn truy cập admin nếu chưa đăng nhập.
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
          >
            <ArrowLeftOutlined />
            Quay lại landing page
          </Link>
        </div>

        <Card bordered={false} className="rounded-[32px] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="px-1 py-2">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-slate-400">Welcome Back</div>
            <Title level={3} className="!mb-1 !mt-4 !text-slate-950">
              Nhập thông tin đăng nhập
            </Title>
            <Text className="text-sm leading-7 text-slate-500">
              Nếu bạn chưa đổi cấu hình, hệ thống đang dùng tài khoản mặc định trong server.
            </Text>

            <Form
              form={form}
              layout="vertical"
              className="mt-8"
              size="large"
              autoComplete="on"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập." }]}
              >
                <Input prefix={<UserOutlined className="text-slate-400" />} autoComplete="username" placeholder="admin" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
              >
                <Input.Password prefix={<LockOutlined className="text-slate-400" />} autoComplete="current-password" placeholder="Nhập mật khẩu quản trị" />
              </Form.Item>

              {error ? <Alert type="error" showIcon message={error} className="mb-5" /> : null}

              <Button type="primary" htmlType="submit" loading={saving} className="h-11 w-full rounded-2xl font-semibold">
                Đăng nhập admin
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
