import { useUsers } from "@/hooks/useUsers";
import React, { ChangeEvent } from "react";

interface UserSearcherComponentTypes {
  selectedUserId: string;
  handleUserChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function UserSearcherComponent({
  selectedUserId,
  handleUserChange,
}: UserSearcherComponentTypes) {
  const { users, isLoading } = useUsers();

  if (isLoading) return <div>Loading users...</div>;
  return (
    <div className="mb-6">
      <select
        value={selectedUserId}
        onChange={handleUserChange}
        className="w-full md:w-auto px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring"
      >
        <option value="">All Users</option>
        {users?.map((user) => (
          <option key={user.id} value={user.id.toString()}>
            {`Id: ${user.id} ${user.name} `}
          </option>
        ))}
      </select>
    </div>
  );
}