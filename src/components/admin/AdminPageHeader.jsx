import { Space, Typography } from "antd";

const { Text, Title } = Typography;

export default function AdminPageHeader({ eyebrow, icon, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <Text className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-500">{eyebrow}</Text> : null}
        <Title level={3} className="!mb-2 !mt-2 flex items-center gap-3 !text-slate-900">
          {icon ? <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b6aa2]/10 text-[#0b6aa2]">{icon}</span> : null}
          <span>{title}</span>
        </Title>
        {description ? <Text className="text-[15px] leading-7 text-slate-600">{description}</Text> : null}
      </div>
      {actions ? <Space wrap>{actions}</Space> : null}
    </div>
  );
}
