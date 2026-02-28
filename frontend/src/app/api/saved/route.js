import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const forwardResponse = async (res) => {
  const body = await res.text();
  const isJson = res.headers.get("content-type")?.includes("application/json");
  return new NextResponse(isJson ? body : JSON.stringify({ message: body || res.statusText }), {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
};

export const GET = withApiAuthRequired(async () => {
  const { accessToken } = await getAccessToken();
  const res = await fetch(`${API_BASE}/saved`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return forwardResponse(res);
});

export const POST = withApiAuthRequired(async (req) => {
  const { accessToken } = await getAccessToken();
  const payload = await req.json();
  const res = await fetch(`${API_BASE}/saved`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return forwardResponse(res);
});

export const dynamic = "force-dynamic";
