import { User } from "./user.interface";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;

  author?: Pick<User, "id" | "firstName" | "lastName" | "image">;
  tags?: BlogTag[];
  _count?: {
    tags?: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
}
