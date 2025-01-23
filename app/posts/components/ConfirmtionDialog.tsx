import React from "react";
import type { ConfirmtionDialog } from "../types/types";


export default function ConfirmtionDialog({
  setIsDeleteDialogOpen,
  handleDeleteConfirm,
}: ConfirmtionDialog) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this post? This action cannot be
          undone.
          {!navigator.onLine && (
            <span className="block text-yellow-600 mt-2">
              You are currently offline. The deletion will be queued and
              processed when you are back online.
            </span>
          )}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsDeleteDialogOpen(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
