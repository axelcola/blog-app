"use client";
import { usePosts } from "@/hooks/usePosts";
import { useState, useEffect } from "react";
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
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  
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

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(event.target.value);
  };

  const handleOnSubmit = (formData: NewPostTypes) => {
    createPost(formData);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts
    ? selectedUserId
      ? posts.filter((post) => post.userId === parseInt(selectedUserId))
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
          selectedUserId={selectedUserId}
          handleUserChange={handleUserChange}
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
    </div>
  );
}
