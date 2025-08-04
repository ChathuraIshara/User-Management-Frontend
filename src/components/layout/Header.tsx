import { Users, Plus } from "lucide-react";
import { useState } from "react";
import Modal from "../ui/Modal";
import AddUserForm from "../forms/AddUserForm";

interface HeaderProps {
  onUserCreated?: () => void;
}

export default function Header({ onUserCreated }: HeaderProps) {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const handleAddUserClick = () => {
        setIsAddUserModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddUserModalOpen(false);
    };

    const handleUserCreated = () => {
        setIsAddUserModalOpen(false);
        console.log("User created successfully!");
        
        // Call the callback to refresh the user list
        if (onUserCreated) {
            onUserCreated();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-green-700 font-bold" />
                    <h2 className="text-3xl font-bold">User Management</h2>
                </div>
                <button 
                    onClick={handleAddUserClick}
                    className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
                >
                    <Plus className="h-5 w-5 text-white" />
                    Add user
                </button>
            </div>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={handleCloseModal}
                title="Add New User"
            >
                <AddUserForm
                    onSuccess={handleUserCreated}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </>
    );
}