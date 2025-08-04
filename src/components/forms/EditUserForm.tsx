import { Loader2, User, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { userService } from "../../services/userService";
import type { User as UserType, UpdateUserRequest } from "../../types";

interface EditUserFormProps {
  user: UserType;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Updating user:", formData);
      const updateData: UpdateUserRequest = {
        id: user._id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status
      };
      
      await userService.updateUser(user._id, updateData);
      
      onSuccess();
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          <User className="inline h-4 w-4 mr-1" />
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-400 focus:outline-none transition-colors"
          placeholder="Enter full name"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline h-4 w-4 mr-1" />
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-400 focus:outline-none transition-colors"
          placeholder="Enter email address"
          required
        />
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          <Shield className="inline h-4 w-4 mr-1" />
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-400 focus:outline-none transition-colors bg-white text-gray-900 cursor-pointer hover:border-gray-400"
          style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          <option value="User" className="py-2 px-3 text-gray-900 bg-white" style={{ backgroundColor: 'white', color: 'black' }}>User</option>
          <option value="Admin" className="py-2 px-3 text-gray-900 bg-white" style={{ backgroundColor: 'white', color: 'black' }}>Admin</option>
          <option value="Moderator" className="py-2 px-3 text-gray-900 bg-white" style={{ backgroundColor: 'white', color: 'black' }}>Moderator</option>
        </select>
      </div>

      {/* Status Field */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-400 focus:outline-none transition-colors bg-white text-gray-900 cursor-pointer hover:border-gray-400"
          style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          <option value="Active" className="py-2 px-3 text-gray-900 bg-white" style={{ backgroundColor: 'white', color: 'black' }}>Active</option>
          <option value="Inactive" className="py-2 px-3 text-gray-900 bg-white" style={{ backgroundColor: 'white', color: 'black' }}>Inactive</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Updating..." : "Update User"}
        </button>
      </div>
    </form>
  );
}
