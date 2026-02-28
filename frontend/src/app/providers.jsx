"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export default function Providers({ children }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: process.env.AUTH0_SCOPE,
        redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}
