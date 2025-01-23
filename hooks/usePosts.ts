import useSWR, { mutate } from "swr";
import { Post, User } from "@prisma/client";
import {
  queueService,
  QueuedAction,
  QueueError,
} from "../services/queueService";
import { useCallback } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export type PostWithUser = Post & {
  user: User;
};

export type CreatePost = {
  title: string;
  body: string;
  userId: number;
  user: { name: string | null | undefined };
};
export function usePosts() {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<PostWithUser[]>("/api/posts", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const deletePost = useCallback(
    async (postId: number) => {
      try {
        const oldPosts = posts || [];
        mutate(
          "/api/posts",
          oldPosts.filter((post) => post.id !== postId),
          false
        );

        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
      } catch {
        await queueService.addToQueue({
          type: "DELETE",
          payload: { postId },
        });
      }
    },
    [posts]
  );

  const createPost = useCallback(
    async (postData: {
      title: string;
      body: string;
      userId: number;
      user: { name: string | null | undefined };
    }) => {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error("Failed to create post");
        }

        const result = await response.json();
        const { user } = postData;
        const newPost = { ...result, user };

        mutate(
          "/api/posts",
          (oldPosts: CreatePost[] | undefined) => {
            if (!oldPosts) return [newPost];
            return [...oldPosts, newPost];
          },
          false
        );

        return newPost;
      } catch {
        await queueService.addToQueue({
          type: "CREATE",
          payload: { postData },
        });

        const tempPost: CreatePost = {
          title: postData.title,
          body: postData.body,
          userId: postData.userId,
          user: { name: postData.user.name },
        };

        mutate(
          "/api/posts",
          (oldPosts: CreatePost[] | undefined) => {
            if (!oldPosts) return [tempPost];
            return [...oldPosts, tempPost];
          },
          false
        );

        return tempPost;
      }
    },
    []
  );

  const processOfflineActions = useCallback(async () => {
    await queueService.processQueue(async (action: QueuedAction) => {
      switch (action.type) {
        case "DELETE":
          try {
            const response = await fetch(
              `/api/posts/${action.payload.postId}`,
              {
                method: "DELETE",
              }
            );
            if (!response.ok) {
              throw new Error(`${response.status}`);
            }
          } catch (error: unknown) {
            const queueError: QueueError = {
              status:
                error instanceof Error ? parseInt(error.message) || 500 : 500,
              message: error instanceof Error ? error.message : "Unknown error",
            };
            throw queueError;
          }
          break;

        case "CREATE":
          try {
            if (!action.payload.postData) {
              throw new Error("Missing post data");
            }

            const response = await fetch("/api/posts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(action.payload.postData),
            });

            if (!response.ok) {
              throw new Error(`${response.status}`);
            }
          } catch (error: unknown) {
            const queueError: QueueError = {
              status:
                error instanceof Error ? parseInt(error.message) || 500 : 500,
              message: error instanceof Error ? error.message : "Unknown error",
            };
            throw queueError;
          }
          break;
      }
    });

    await mutate("/api/posts");
  }, []);

  return {
    posts,
    error,
    isLoading,
    deletePost,
    processOfflineActions,
    createPost,
  };
}
