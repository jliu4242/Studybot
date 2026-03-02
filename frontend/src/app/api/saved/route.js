import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/queryClient";
import { auth0 } from "@/lib/auth0";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const forwardResponse = async (res) => {
  const body = await res.text();
  const isJson = res.headers.get("content-type")?.includes("application/json");
  return new NextResponse(isJson ? body : JSON.stringify({ message: body || res.statusText }), {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
};

const handleProxyError = (err) => NextResponse.json(
  { message: err.body || err.message || "Request failed" },
  { status: err.status || 500 },
);

const getAccessTokenOrThrow = async () => {
  const { token } = await auth0.getAccessToken();
  if (typeof token !== "string" || !token.trim()) {
    const err = new Error("Missing access token from Auth0.");
    err.status = 401;
    throw err;
  }
  return token;
};

export const GET = auth0.withApiAuthRequired(async (req) => {
  try {
    const accessToken = await getAccessTokenOrThrow();
    const res = await apiRequest("GET", `${API_BASE}/saved`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return forwardResponse(res);
  } catch (err) {
    return handleProxyError(err);
  }
});

export const POST = auth0.withApiAuthRequired(async (req) => {
  try {
    const accessToken = await getAccessTokenOrThrow();
    const payload = await req.json();
    const res = await apiRequest("POST", `${API_BASE}/saved`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return forwardResponse(res);
  } catch (err) {
    return handleProxyError(err);
  }
});

export const dynamic = "force-dynamic";
