import { PostWithUser } from "@/hooks/usePosts";

export interface UserSearcherComponentTypes {
  filteredPosts: PostWithUser[];
  setPostToDelete: (id: number) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export interface ConfirmtionDialog {
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handleDeleteConfirm: () => void;
}

export interface CreatePostButtonProps {
  openModal: () => void;
}

export interface NewPostTypes {
  title: string;
  body: string;
  userId: number;
}

interface CardUserType {
  id: string ;
  name?: string | null; 
  email?: string | null;
  image?: string | null;
 }

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: NewPostTypes) => void;
  user: CardUserType | undefined;
 }
