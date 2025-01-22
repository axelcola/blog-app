import { PostWithUser } from "@/hooks/usePosts";
import React from "react";

interface UserSearcherComponentTypes {
  filteredPosts: PostWithUser[];
  setPostToDelete: (id: number) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void; 
}

export default function Cards({
  filteredPosts,
  setPostToDelete,
  setIsDeleteDialogOpen,
}: UserSearcherComponentTypes) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <div key={post.id} className="border rounded-lg shadow-sm bg-white">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.body}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">By {post.user?.name || 'Loading...'}</span>
              <button
                onClick={() => {
                  setPostToDelete(post.id);
                  setIsDeleteDialogOpen(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
