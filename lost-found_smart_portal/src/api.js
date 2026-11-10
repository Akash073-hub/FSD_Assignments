const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = window.localStorage.getItem("findhub-token");
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Unable to reach the API. Start the backend with `cd backend && npm run dev`.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "The server could not complete the request.");
  return body;
}
