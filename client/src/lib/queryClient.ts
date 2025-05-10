import { QueryClient, QueryFunction, useQuery } from "@tanstack/react-query";
import { Student } from "@/types"; // Import the Student type

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error("Error Response Details:", {
      status: res.status,
      statusText: res.statusText,
      body: text,
    });
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T>(
  method: string,
  url: string,
  data?: unknown | undefined,
  returnRawResponse: boolean = false // Optional flag to return raw Response
): Promise<T | Response> {
  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;
  const headers: Record<string, string> = {};

  if (userId) {
    headers['Authorization'] = `Bearer ${userId}`;
  }
  if (data) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);

  if (returnRawResponse) {
    return res; // Return the raw Response object
  }

  return res.json(); // Parse and return the JSON response
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    const headers: Record<string, string> = {};
    if (userId) {
      headers['Authorization'] = `Bearer ${userId}`;
    }

    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers, // <-- Add this line
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error("Error in getQueryFn:", error);
      throw error;
    }
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


