import {
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { User } from "../../types";
import { userService } from "../../services/userService";
import Modal from "./Modal";
import EditUserForm from "../forms/EditUserForm";
import ConfirmationModal from "./ConfirmationModal";

interface UserTableProps {
  refreshTrigger: number;
}

// Type definitions for API responses
interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserResponseWithData {
  data: User[];
  pagination?: PaginationData;
}

interface UserResponseWithUsers {
  users: User[];
  pagination?: PaginationData;
}

export default function UserTable({ refreshTrigger }: UserTableProps) {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching users...");
      const response = await userService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
      });
      console.log("API Response:", response);

      // Handle different response formats
      let fetchedUsers: User[] = [];
      let paginationData = pagination;

      if (Array.isArray(response)) {
        // Response is directly an array
        fetchedUsers = response;
        paginationData = { ...pagination, total: response.length };
      } else if (response && typeof response === "object") {
        // Response is an object
        if (Array.isArray((response as UserResponseWithData).data)) {
          const dataResponse = response as UserResponseWithData;
          fetchedUsers = dataResponse.data;
          paginationData = dataResponse.pagination || pagination;
        } else if (
          "users" in response &&
          Array.isArray((response as UserResponseWithUsers).users)
        ) {
          const usersResponse = response as UserResponseWithUsers;
          fetchedUsers = usersResponse.users;
          paginationData = usersResponse.pagination || pagination;
        }
      }

      console.log("Parsed users:", fetchedUsers);
      setUsers(fetchedUsers);
      setPagination(paginationData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    console.log(`Attempting to delete user with ID: ${userToDelete._id}`);

    try {
      setLoading(true);
      await userService.deleteUser(userToDelete._id);

      // Remove user from local state
      setUsers((prevUsers) => 
        prevUsers.filter((user) => user._id !== userToDelete._id)
      );
      
      // Update pagination totals separately
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit)
      }));
      
      console.log(`User ${userToDelete._id} deleted successfully`);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Edit user handlers
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    // Refresh the user list
    fetchUsers();
  };

  // Fetch users when component mounts or pagination changes
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, refreshTrigger]); // Re-fetch when page changes or refreshTrigger changes

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "moderator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        <p className="text-sm text-gray-600">
          Manage your team members and their account permissions here.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors duration-150"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50 transition-colors duration-150">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found.</p>
          <button
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Table Footer with Pagination */}
      {!loading && !error && users.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit User"
      >
        {selectedUser && (
          <EditUserForm
            user={selectedUser}
            onSuccess={handleUserUpdated}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
