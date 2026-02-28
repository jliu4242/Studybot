"use client";

import { useMemo } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ returnTo = "/" }) {
  const { user, isLoading } = useUser();
  const authBase = "/api/auth";

  const target = useMemo(() => encodeURIComponent(returnTo || "/"), [returnTo]);

  if (isLoading) {
    return <span className="text-sm text-muted-foreground">Checking session...</span>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <a href={`${authBase}/login?returnTo=${target}`}>Log in</a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`${authBase}/login?screen_hint=signup&returnTo=${target}`}>Sign up</a>
        </Button>
        <Button variant="ghost" asChild>
          <a href={`${authBase}/login?screen_hint=reset_password&returnTo=${target}`}>Forgot?</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground truncate max-w-[12rem]">
        {user.name || user.email}
      </span>
      <Button variant="outline" asChild>
        <a href={`${authBase}/logout?returnTo=${target}`}>Log out</a>
      </Button>
    </div>
  );
}
