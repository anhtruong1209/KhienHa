export async function getSiteContent() {
  try {
    const res = await fetch('/api/site-content');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getNews() {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function updateSiteContent(data) {
  const res = await fetch('/api/site-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok;
}
