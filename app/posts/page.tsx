"use client";
import { usePosts } from "@/hooks/usePosts";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import UserSearcherComponent from "./components/UserSearcher";
import Cards from "./components/Cards";
import ConfirmtionDialog from "./components/ConfirmtionDialog";
import { CreatePostModal } from "./components/CreatePostModal";
import CreatePostButton from "./components/CreatePostButton";
import { NewPostTypes } from "./types/types";
import { useSession } from "next-auth/react";

export default function Home() {
  const {
    posts,
    error,
    isLoading,
    deletePost,
    processOfflineActions,
    createPost,
  } = usePosts();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });

  const { data: session } = useSession();

  useEffect(() => {
    const handleOnline = () => {
      processOfflineActions();
      setOfflineMessage("Back online! Processing pending actions...");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setOfflineMessage(
        "You are offline. Actions will be queued and processed when back online."
      );
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [processOfflineActions]);

  const handleOnSubmit = async (formData: NewPostTypes) => {
    try {
      await createPost(formData);
      setToast({
        show: true,
        message: "Post created successfully",
        isError: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", isError: false }),
        3000
      );
    } catch {
      setToast({
        show: true,
        message: "Error creating post",
        isError: true,
      });
      setTimeout(
        () => setToast({ show: false, message: "", isError: false }),
        3000
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        const res = await deletePost(postToDelete);
        setToast({
          show: true,
          message: res.message,
          isError: !res.success,
        });
        setTimeout(
          () => setToast({ show: false, message: "", isError: false }),
          3000
        );
        setIsDeleteDialogOpen(false);
        setPostToDelete(null);
      } catch {
        setToast({
          show: true,
          message: "Error deleting post",
          isError: true,
        });
        setTimeout(
          () => setToast({ show: false, message: "", isError: false }),
          3000
        );
      }
    }
  };
  
  const filteredPosts = posts
  ? selectedUsers.length > 0
  ? posts.filter((post) => selectedUsers.includes(post.userId))
  : posts
  : [];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }
  const onCloseModal = () => {
    setIsCreateModalOpen(false);
  };
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      <UserSearcherComponent
        handleUserChange={setSelectedUsers}
      />

      <Cards
        filteredPosts={filteredPosts}
        setPostToDelete={setPostToDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />

      {isDeleteDialogOpen && (
        <ConfirmtionDialog
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      )}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={onCloseModal}
        onSubmit={handleOnSubmit}
        user={session?.user}
      />

      <CreatePostButton openModal={openCreateModal} />

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
          {offlineMessage}
        </div>
      )}
      {toast.show && (
        <div
          className={`fixed bottom-20 right-4 flex items-center space-x-2 px-6 py-3 rounded-lg shadow-lg ${
            toast.isError ? "bg-red-600" : "bg-green-600"
          } text-white`}
        >
          {toast.isError ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
