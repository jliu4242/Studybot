import { auth0 } from "@/lib/auth0";

export const GET = (req) => auth0.middleware(req);
export const POST = (req) => auth0.middleware(req);
export const dynamic = "force-dynamic";
