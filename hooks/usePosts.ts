import useSWR, { mutate } from "swr";
import { Post, User } from "@prisma/client";
import { queueService, QueuedAction, QueueError } from "../services/queueService";
import { useCallback } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export type PostWithUser = Post & {
  user: User;
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
              status: error instanceof Error ? parseInt(error.message) || 500 : 500,
              message: error instanceof Error ? error.message : 'Unknown error'
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
  };
}
