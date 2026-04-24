import NewsDetailClient from "@/components/news/NewsDetailClient";
import publicBuildData from "@/generated/public-build-data";

export const dynamicParams = false;

export function generateStaticParams() {
  const seen = new Set();
  const params = [];

  for (const item of publicBuildData.news || []) {
    for (const value of [item.slug, item.id]) {
      const id = `${value || ""}`.trim();

      if (!id || seen.has(id)) {
        continue;
      }

      seen.add(id);
      params.push({ id });
    }
  }

  return params;
}

export default async function NewsDetailPage({ params }) {
  const { id } = await params;

  return <NewsDetailClient id={id} />;
}
