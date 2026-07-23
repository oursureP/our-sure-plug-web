const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions {
  revalidate?: number; // ISR seconds
}

export async function serverFetch<T>(
  endpoint: string,
  { revalidate = 300 }: FetchOptions = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
