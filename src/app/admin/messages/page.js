"use client";

import React, { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Button, Card, Form, Input, Modal, Select, Table, Tag, message } from "antd";
import { EditOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getContactMessages, updateContactMessage } from "@/services/api";

const statusOptions = [
  { label: "Mới", value: "new" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Hoàn tất", value: "done" },
];

const statusColors = {
  new: "blue",
  in_progress: "gold",
  done: "green",
};

const statusLabels = {
  new: "Mới",
  in_progress: "Đang xử lý",
  done: "Hoàn tất",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

export default function MessageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const deferredSearch = useDeferredValue(search);

  async function loadData() {
    setLoading(true);
    const messages = await getContactMessages();
    startTransition(() => {
      setData(messages || []);
    });
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openEditor(record) {
    setSelectedMessage(record);
    form.setFieldsValue({
      status: record.status,
      notes: record.notes,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!selectedMessage) return;

    try {
      setSaving(true);
      const values = await form.validateFields();
      const success = await updateContactMessage(selectedMessage.id, values);
      if (!success) {
        message.error("Không cập nhật được yêu cầu.");
        return;
      }

      startTransition(() => {
        setData((current) =>
          current.map((item) =>
            item.id === selectedMessage.id
              ? {
                  ...item,
                  ...values,
                }
              : item
          )
        );
      });

      message.success("Đã cập nhật yêu cầu khách hàng.");
      setIsModalOpen(false);
      setSelectedMessage(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Vui lòng kiểm tra lại thông tin cập nhật.");
    } finally {
      setSaving(false);
    }
  }

  const filteredData = data.filter((item) => {
    const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
    const keyword = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      keyword.length === 0 ||
      item.name?.toLowerCase().includes(keyword) ||
      item.company?.toLowerCase().includes(keyword) ||
      item.email?.toLowerCase().includes(keyword) ||
      item.phone?.toLowerCase().includes(keyword) ||
      item.message?.toLowerCase().includes(keyword);
    return matchesStatus && matchesSearch;
  });

  const totalCount = data.length;
  const newCount = data.filter((item) => item.status === "new").length;
  const progressCount = data.filter((item) => item.status === "in_progress").length;
  const doneCount = data.filter((item) => item.status === "done").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Customer inbox"
        icon={<MailOutlined />}
        title="Liên hệ khách hàng"
        description="Quản lý lead từ form liên hệ, cập nhật trạng thái xử lý và ghi chú nội bộ ngay trên bảng admin."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Tổng yêu cầu", value: totalCount },
          { label: "Mới", value: newCount },
          { label: "Đang xử lý", value: progressCount },
          { label: "Hoàn tất", value: doneCount },
        ].map((item) => (
          <Card key={item.label} bordered={false} className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
            <div className="mt-4 text-4xl font-black text-slate-900">{item.value}</div>
          </Card>
        ))}
      </div>

      <Card bordered={false} className="rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Tìm theo tên, công ty, email, điện thoại hoặc nội dung"
            className="h-11 rounded-2xl"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="h-11"
            options={[{ label: "Tất cả trạng thái", value: "all" }, ...statusOptions]}
          />
        </div>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredData}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 1100 }}
          columns={[
            {
              title: "Khách hàng",
              key: "customer",
              width: 230,
              render: (_, record) => (
                <div>
                  <div className="font-semibold text-slate-900">{record.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.company || "Khách cá nhân"}</div>
                </div>
              ),
            },
            {
              title: "Liên hệ",
              key: "contact",
              width: 240,
              render: (_, record) => (
                <div className="text-sm text-slate-600">
                  <div>{record.phone}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.email || "Chưa có email"}</div>
                </div>
              ),
            },
            {
              title: "Nội dung yêu cầu",
              dataIndex: "message",
              key: "message",
              render: (value) => <div className="line-clamp-3 min-w-[280px] text-sm leading-6 text-slate-600">{value}</div>,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              width: 150,
              render: (value) => <Tag color={statusColors[value] || "default"}>{statusLabels[value] || value}</Tag>,
            },
            {
              title: "Cập nhật",
              dataIndex: "created_at",
              key: "created_at",
              width: 180,
              render: (value) => <span className="text-sm text-slate-500">{formatDate(value)}</span>,
            },
            {
              title: "Thao tác",
              key: "action",
              width: 130,
              render: (_, record) => (
                <Button type="default" icon={<EditOutlined />} className="rounded-xl" onClick={() => openEditor(record)}>
                  Xử lý
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Cập nhật yêu cầu khách hàng"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu cập nhật"
        cancelText="Hủy"
        confirmLoading={saving}
        width={720}
      >
        {selectedMessage ? (
          <div className="mt-4 space-y-5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{selectedMessage.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{selectedMessage.company || "Khách cá nhân"}</div>
                </div>
                <Tag color={statusColors[selectedMessage.status] || "default"}>{statusLabels[selectedMessage.status] || selectedMessage.status}</Tag>
              </div>
              <div className="mt-4 text-sm leading-7 text-slate-600">{selectedMessage.message}</div>
              <div className="mt-4 text-xs text-slate-400">
                {selectedMessage.phone} {selectedMessage.email ? `• ${selectedMessage.email}` : ""}
              </div>
            </div>

            <Form form={form} layout="vertical">
              <Form.Item name="status" label="Trạng thái xử lý" rules={[{ required: true, message: "Vui lòng chọn trạng thái." }]}>
                <Select options={statusOptions} />
              </Form.Item>
              <Form.Item name="notes" label="Ghi chú nội bộ">
                <Input.TextArea rows={5} placeholder="Ghi chú tiến độ, lịch hẹn, yêu cầu kỹ thuật hoặc hành động tiếp theo." />
              </Form.Item>
            </Form>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
