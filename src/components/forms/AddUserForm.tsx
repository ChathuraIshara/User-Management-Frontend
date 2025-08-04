import { useState } from "react";
import { Loader2, User, Mail, Shield } from "lucide-react";
import type { CreateUserRequest } from "../../types";
import { userService } from "../../services/userService";

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    email: "",
    role: "User",
    status: "Active"
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
      setError("Name and email are required");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Creating user:", formData);
      await userService.createUser(formData);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "User",
        status: "Active"
      });
      
      onSuccess();
    } catch (err) {
      console.error("Failed to create user:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
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
          placeholder="Enter full name"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-400 focus:outline-none transition-colors"
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
          placeholder="Enter email address"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-400 focus:outline-none transition-colors"
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
          className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  );
}
