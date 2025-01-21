import useSWR, { mutate } from "swr";
import { Post, User } from "@prisma/client";
import { queueService, QueuedAction } from "../services/queueService";

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
    revalidateOnReconnect: true,
  });

  const deletePost = async (postId: number) => {
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
  };

  const processOfflineActions = async () => {
    await queueService.processQueue(async (action: QueuedAction) => {
      switch (action.type) {
        case "DELETE":
          const response = await fetch(`/api/posts/${action.payload.postId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to process deleted post");
          }
          break;
      }
    });

    await mutate("/api/posts");
  };

  return {
    posts,
    error,
    isLoading,
    deletePost,
    processOfflineActions,
  };
}
