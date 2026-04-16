function normalizeKeyword(value) {
  return (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const NEWS_CATEGORY_DEFINITIONS = [
  {
    value: "tin-hoat-dong",
    label: "Tin hoạt động",
    aliases: ["tin hoat dong", "hoat dong", "tin tuc", "noi bo"],
  },
  {
    value: "su-kien",
    label: "Sự kiện",
    aliases: ["su kien", "event"],
  },
  {
    value: "ban-giao",
    label: "Bàn giao",
    aliases: ["ban giao", "nghiem thu"],
  },
  {
    value: "ha-thuy",
    label: "Hạ thủy",
    aliases: ["ha thuy", "ha tau", "launch"],
  },
  {
    value: "dau-tu",
    label: "Đầu tư",
    aliases: ["dau tu", "investment"],
  },
  {
    value: "chung-chi",
    label: "Chứng chỉ",
    aliases: ["chung chi", "certificate"],
  },
  {
    value: "san-xuat",
    label: "Sản xuất",
    aliases: ["san xuat", "sx", "nha may", "xuong", "van hanh"],
  },
];

const GALLERY_CATEGORY_DEFINITIONS = [
  {
    value: "dong-moi",
    label: "Đóng mới",
    aliases: ["dong moi", "new build", "newbuild", "tau moi"],
  },
  {
    value: "thi-cong",
    label: "Thi công",
    aliases: ["thi cong", "gia cong", "lap rap", "xay dung"],
  },
  {
    value: "ha-tang",
    label: "Hạ tầng",
    aliases: ["ha tang", "infrastructure"],
  },
  {
    value: "nha-xuong",
    label: "Nhà xưởng",
    aliases: ["nha xuong", "workshop"],
  },
  {
    value: "trang-thiet-bi",
    label: "Trang thiết bị",
    aliases: ["trang thiet bi", "thiet bi", "equipment", "cau truc", "may moc"],
  },
  {
    value: "san-pham",
    label: "Sản phẩm",
    aliases: ["san pham", "product"],
  },
  {
    value: "ban-giao",
    label: "Bàn giao",
    aliases: ["ban giao", "delivery", "nghiem thu"],
  },
  {
    value: "du-an",
    label: "Dự án",
    aliases: ["du an", "project", "du an du lich", "tourism"],
  },
  {
    value: "van-hanh",
    label: "Vận hành",
    aliases: ["van hanh", "operation", "hoat dong"],
  },
];

function createOptions(definitions) {
  return definitions.map(({ label, value }) => ({ label, value }));
}

function resolveDefinition(value, definitions, fallbackDefinition) {
  const normalizedValue = normalizeKeyword(value);
  if (!normalizedValue) return fallbackDefinition;

  const matchedDefinition = definitions.find(({ label, value: optionValue, aliases }) =>
    [label, optionValue, ...(aliases || [])].some((candidate) => {
      const normalizedCandidate = normalizeKeyword(candidate);
      return normalizedValue === normalizedCandidate
        || normalizedValue.includes(normalizedCandidate)
        || normalizedCandidate.includes(normalizedValue);
    }));

  return matchedDefinition || fallbackDefinition;
}

const DEFAULT_NEWS_CATEGORY = NEWS_CATEGORY_DEFINITIONS[0];
const DEFAULT_GALLERY_CATEGORY = GALLERY_CATEGORY_DEFINITIONS[0];

export const NEWS_CATEGORY_OPTIONS = createOptions(NEWS_CATEGORY_DEFINITIONS);
export const NEWS_CATEGORY_FILTER_OPTIONS = [
  { label: "Tất cả chuyên mục", value: "all" },
  ...NEWS_CATEGORY_OPTIONS,
];

export const GALLERY_CATEGORY_OPTIONS = createOptions(GALLERY_CATEGORY_DEFINITIONS);
export const GALLERY_CATEGORY_FILTER_OPTIONS = [
  { label: "Tất cả danh mục", value: "all" },
  ...GALLERY_CATEGORY_OPTIONS,
];

export function normalizeNewsCategory(value) {
  return resolveDefinition(value, NEWS_CATEGORY_DEFINITIONS, DEFAULT_NEWS_CATEGORY).label;
}

export function normalizeGalleryCategory(value) {
  return resolveDefinition(value, GALLERY_CATEGORY_DEFINITIONS, DEFAULT_GALLERY_CATEGORY).label;
}

export function resolveNewsCategoryValue(value) {
  return resolveDefinition(value, NEWS_CATEGORY_DEFINITIONS, DEFAULT_NEWS_CATEGORY).value;
}

export function resolveGalleryCategoryValue(value) {
  return resolveDefinition(value, GALLERY_CATEGORY_DEFINITIONS, DEFAULT_GALLERY_CATEGORY).value;
}

export function getNewsCategoryLabel(value) {
  return resolveDefinition(value, NEWS_CATEGORY_DEFINITIONS, DEFAULT_NEWS_CATEGORY).label;
}

export function getGalleryCategoryLabel(value) {
  return resolveDefinition(value, GALLERY_CATEGORY_DEFINITIONS, DEFAULT_GALLERY_CATEGORY).label;
}
