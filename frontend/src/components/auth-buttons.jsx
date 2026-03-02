"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ returnTo = "/" }) {
  const { user, isLoading } = useUser();

  const { safeReturn, loginHref, logoutHref } = useMemo(() => {
    const safePath = typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/";
    const encodedPath = encodeURIComponent(safePath);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const logoutTarget = origin ? `${origin}${safePath}` : safePath;

    return {
      safeReturn: safePath,
      loginHref: `/login?returnTo=${encodedPath}`,
      logoutHref: `/api/auth/logout?returnTo=${encodeURIComponent(logoutTarget)}`,
    };
  }, [returnTo]);

  return (
    <Button variant="outline" asChild disabled={isLoading}>
      {user ? (
        <a href={logoutHref}>Log out</a>
      ) : (
        <Link href={loginHref}>Log in</Link>
      )}
    </Button>
  );
}
