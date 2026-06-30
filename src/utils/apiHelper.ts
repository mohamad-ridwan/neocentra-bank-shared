import { QueryClient } from '@tanstack/react-query';

// Create a singleton instance of QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Simple premium fetch wrapper
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  const baseUrl = 'http://localhost:8080';
  const url = (path.startsWith('/') && !path.startsWith('//')) ? `${baseUrl}${path}` : path;

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (response.redirected && typeof window !== "undefined") {
    window.location.href = response.url;
    return new Promise(() => {});
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API request failed') as any;
    error.status = response.status;
    throw error;
  }

  return response.json();
}
