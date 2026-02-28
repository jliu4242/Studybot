import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        const error = new Error(`${res.status}: ${text}`);
        error.status = res.status;
        error.body = text;
        throw error;
    }
}
export async function apiRequest(method, url, options = {}) {
    const { data, body, headers = {}, ...rest } = options;
    const finalBody = data !== undefined ? JSON.stringify(data) : body;
    const finalHeaders = {
        ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
    };
    const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: finalBody,
        credentials: "include",
        ...rest,
    });
    await throwIfResNotOk(res);
    return res;
}
export const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/"), {
        credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
};
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
