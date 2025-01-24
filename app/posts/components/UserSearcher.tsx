import React, { useState, useRef, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
interface User {
  id: number;
  name: string;
}

interface UserSearcherComponentTypes {
  handleUserChange: React.Dispatch<React.SetStateAction<number[]>>;
}

const UserSearcherComponent = ({
  handleUserChange,
}: UserSearcherComponentTypes) => {
  const { users, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);

      const users = newSelectedUsers.map((user) => user.id);
      handleUserChange(users);
    }
    setSearchTerm("");
  };

  const handleRemoveUser = (userId: number) => {
    const newSelectedUsers = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(newSelectedUsers);
    const users = newSelectedUsers.map((user) => user.id);
    handleUserChange(users);
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((user) => (
          <span
            key={user.id}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
          >
            <span>{`Id: ${user.id} ${user.name}`}</span>
            <button
              onClick={() => handleRemoveUser(user.id)}
              className="hover:text-blue-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search users..."
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />

      {isOpen && filteredUsers && filteredUsers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {`Id: ${user.id} ${user.name}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearcherComponent;
