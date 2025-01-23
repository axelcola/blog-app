import type { CreatePostButtonProps } from "../types/types";
import EditIcon from "./icons/EditIcon";

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ 
  openModal = () => {}, 
}) => {

  const handleClick = () => {
    openModal();
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={handleClick}
        className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label="Create new post"
      >
        <EditIcon className="w-11 h-11" />
      </button>
    </div>
  );
};

export default CreatePostButton;