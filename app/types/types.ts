import { Post, User } from "@prisma/client";

export type PostWithUser = Post & {
    user: User;
  };
  
  export type CreatePost = {
    title: string;
    body: string;
    userId: number;
    user: { name: string | null | undefined };
  };