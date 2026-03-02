"use client";

import { useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ returnTo = "/" }) {
  const { user, isLoading } = useUser();
  const authBase = "/api/auth";

  const target = useMemo(() => encodeURIComponent(returnTo || "/"), [returnTo]);

  const loginHref = `${authBase}/login?returnTo=${target}`;
  const logoutHref = `${authBase}/logout?returnTo=${target}`;

  return (
    <Button variant="outline" asChild disabled={isLoading}>
      <a href={user ? logoutHref : loginHref}>{user ? "Log out" : "Log in"}</a>
    </Button>
  );
}
