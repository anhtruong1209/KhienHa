export async function getAdminSession() {
  const response = await fetch("/api/admin/session", {
    credentials: "same-origin",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function loginAdmin(payload) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    data,
  };
}

export async function logoutAdmin() {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}
