import { usePosts } from "@/hooks/usePosts";
import React, { ChangeEvent } from "react";

interface UserSearcherComponentTypes {
  selectedUserId: string;
  handleUserChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function UserSearcerComponent({
  selectedUserId,
  handleUserChange,
}: UserSearcherComponentTypes) {
  const { posts } = usePosts();
  return (
    <div className="mb-6">
      <select
        value={selectedUserId}
        onChange={handleUserChange}
        className="w-full md:w-auto px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring"
      >
        <option value="">All Users</option>
        {posts &&
          Array.from(new Set(posts.map((post) => post.userId))).map(
            (userId) => (
              <option key={userId} value={userId.toString()}>
                User {userId}
              </option>
            )
          )}
      </select>
    </div>
  );
}
