export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId?: string | null;
  status: "APPROVED" | "REJECT";
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  post?: { id: string; title: string };
}
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnail?: string | null;
  isFeatured: boolean;
  status: PostStatus;
  tags: string[];
  views: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  _count?: { comments: number };
}
export interface PaginatedPosts {
  data: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      body?.error || body?.message || "Something went wrong. Please try again.",
    );
  return body as T;
}

export const excerpt = (content: string, length = 150) =>
  content.length > length ? `${content.slice(0, length).trim()}…` : content;
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
