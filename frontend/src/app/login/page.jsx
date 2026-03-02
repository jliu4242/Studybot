"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, LogIn, UserPlus, RefreshCw } from "lucide-react";

export default function LoginPage({ searchParams }) {
  const rawReturn = typeof searchParams?.returnTo === "string" ? searchParams.returnTo : "/";
  const safeReturn = useMemo(() => (rawReturn?.startsWith("/") ? rawReturn : "/"), [rawReturn]);
  const encodedReturn = encodeURIComponent(safeReturn);
  const authBase = "/api/auth";

  const loginUrl = `${authBase}/login?returnTo=${encodedReturn}`;
  const signupUrl = `${authBase}/login?screen_hint=signup&returnTo=${encodedReturn}`;
  const resetUrl = `${authBase}/login?screen_hint=reset_password&returnTo=${encodedReturn}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center px-6 md:px-8 lg:px-12">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </Link>
          <span className="text-sm text-muted-foreground">StudyBot</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg p-8 md:p-10 space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight">Choose how to log in</h1>
            <p className="text-sm text-muted-foreground">
              Continue to StudyBot and pick your preferred Auth0 option.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full justify-center gap-2">
              <a href={loginUrl}>
                <LogIn className="w-4 h-4" />
                Continue to Auth0 Login
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full justify-center gap-2">
              <a href={signupUrl}>
                <UserPlus className="w-4 h-4" />
                Create an account
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full justify-center gap-2 text-muted-foreground">
              <a href={resetUrl}>
                <RefreshCw className="w-4 h-4" />
                Forgot password
              </a>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You&apos;ll be redirected to Auth0&apos;s hosted page to complete sign in.
          </p>
        </Card>
      </main>
    </div>
  );
}
