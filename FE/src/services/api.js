import { normalizeGalleryCategory, normalizeNewsCategory } from "@/data/category-options";
import { newsData } from "@/data/news";
import { siteContent as fallbackSiteContent } from "@/data/site-content";

const API_BASE_URL = "";

let siteContentCache = null;
let siteContentPromise = null;
let newsCache = null;
let newsPromise = null;

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function absoluteAssetUrl(value) {
  if (!value || typeof value !== "string") return value;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) return value;
  return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function normalizeSiteContent(data) {
  const merged = {
    ...fallbackSiteContent,
    ...(data || {}),
    company: { ...fallbackSiteContent.company, ...(data?.company || {}) },
    hero: { ...fallbackSiteContent.hero, ...(data?.hero || {}) },
    about: { ...fallbackSiteContent.about, ...(data?.about || {}) },
    contact: { ...fallbackSiteContent.contact, ...(data?.contact || {}) },
    quality: { ...fallbackSiteContent.quality, ...(data?.quality || {}) },
  };

  merged.banners = (merged.banners || []).map(absoluteAssetUrl);
  merged.about.image = absoluteAssetUrl(merged.about?.image);
  merged.capacity = (merged.capacity || []).map((item) => ({
    ...item,
    image: absoluteAssetUrl(item.image),
  }));
  merged.gallery = (merged.gallery || []).map((item) => ({
    ...item,
    category: normalizeGalleryCategory(item.category),
    url: absoluteAssetUrl(item.url),
  }));
  merged.quality.image = absoluteAssetUrl(merged.quality?.image);
  merged.quality.mainImage = absoluteAssetUrl(merged.quality?.mainImage || merged.quality?.image);

  return merged;
}

function normalizeNews(data) {
  return (data || []).map((item, index) => ({
    id: item.id ?? index + 1,
    _id: item._id ?? `${item.id ?? index + 1}`,
    slug: item.slug || `${item.id ?? index + 1}`,
    title: item.title,
    date: item.date,
    category: normalizeNewsCategory(item.category),
    excerpt: item.excerpt || item.content,
    content: item.content || item.excerpt || "",
    image: absoluteAssetUrl(item.image || item.image_path),
    is_featured: item.is_featured ?? false,
    is_published: item.is_published ?? true,
  }));
}

async function request(path, options = {}) {
  const res = await fetch(buildUrl(path), {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export async function getSiteContent(force = false) {
  if (!force && siteContentCache) return siteContentCache;
  if (!force && siteContentPromise) return siteContentPromise;

  siteContentPromise = request("/api/public/site-content")
    .then((data) => {
      siteContentCache = normalizeSiteContent(data);
      return siteContentCache;
    })
    .catch((error) => {
      console.error(error);
      return normalizeSiteContent(fallbackSiteContent);
    })
    .finally(() => {
      siteContentPromise = null;
    });

  return siteContentPromise;
}

export async function getNews(force = false) {
  if (!force && newsCache) return newsCache;
  if (!force && newsPromise) return newsPromise;

  newsPromise = request("/api/public/news")
    .then((data) => {
      newsCache = normalizeNews(data);
      return newsCache;
    })
    .catch((error) => {
      console.error(error);
      return normalizeNews(newsData);
    })
    .finally(() => {
      newsPromise = null;
    });

  return newsPromise;
}

export async function getNewsItem(identifier) {
  try {
    const data = await request(`/api/public/news/${identifier}`);
    return normalizeNews([data])[0] || null;
  } catch (error) {
    console.error(error);
    const list = await getNews();
    return list.find((item) => item.slug === identifier || `${item.id}` === `${identifier}` || item._id === `${identifier}`) || null;
  }
}

export async function submitContact(payload) {
  const result = await request("/api/public/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return { success: true, ...result };
}

export async function updateSiteContent(data) {
  try {
    const result = await request("/api/admin/site-content", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    siteContentCache = normalizeSiteContent(result);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function saveNews(payload) {
  const path = payload._id ? `/api/admin/news/${payload._id}` : "/api/admin/news";
  const method = payload._id ? "PUT" : "POST";

  try {
    await request(path, {
      method,
      body: JSON.stringify(payload),
    });
    newsCache = null;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteNews(id) {
  try {
    await request(`/api/admin/news/${id}`, { method: "DELETE" });
    newsCache = null;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getContactMessages() {
  try {
    return await request("/api/admin/contact-messages");
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateContactMessage(id, payload) {
  try {
    await request(`/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
