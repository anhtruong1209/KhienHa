"use client";

import React, { useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Select, Space, Table, Tag, Typography, message } from "antd";
import { getContactMessages, updateContactMessage } from "@/services/api";

const { Title, Text } = Typography;

const statusOptions = [
  { label: "Mới", value: "new" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Hoàn tất", value: "done" },
];

export default function MessageManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const messages = await getContactMessages();
    setData(messages || []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const messages = await getContactMessages();
      if (!active) return;

      setData(messages || []);
      setLoading(false);
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  async function handleStatusChange(id, status) {
    const success = await updateContactMessage(id, { status });
    if (success) {
      message.success("Đã cập nhật trạng thái.");
      loadData();
    } else {
      message.error("Không cập nhật được trạng thái.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={4} className="!m-0 flex items-center gap-2">
          <MailOutlined className="text-primary" /> Liên hệ khách hàng
        </Title>
        <Text type="secondary" className="text-xs">
          Danh sách yêu cầu tư vấn gửi từ biểu mẫu liên hệ ngoài website.
        </Text>
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={[
            { title: "Khách hàng", dataIndex: "name", key: "name", width: 180 },
            { title: "Điện thoại", dataIndex: "phone", key: "phone", width: 150 },
            { title: "Email", dataIndex: "email", key: "email", width: 220 },
            { title: "Công ty", dataIndex: "company", key: "company", width: 180 },
            { title: "Nội dung", dataIndex: "message", key: "message", ellipsis: true },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              width: 170,
              render: (status, record) => (
                <Select
                  value={status}
                  options={statusOptions}
                  onChange={(value) => handleStatusChange(record.id, value)}
                  style={{ width: "100%" }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
