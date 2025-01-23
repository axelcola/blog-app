"use client";

import { useState } from "react";
import type { CreatePostModalProps, NewPostTypes } from "../types/types";

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  user,
}: CreatePostModalProps) {
  const [formData, setFormData] = useState<Omit<NewPostTypes, "id" | "userId">>({
    title: "",
    body: "",
  });

  if (!user || !isOpen) return null;
  
  const handleSubmit = () => {
    const newPost = {
      ...formData,
      userId: parseInt(user.id)
    };
    onSubmit(newPost);
    setFormData({ title: "", body: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <textarea
                placeholder="Content"
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !formData.body.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Create
            {!navigator.onLine && " (Will be queued)"}
          </button>
        </div>
      </div>
    </div>
  );
}
