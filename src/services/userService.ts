import type { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { apiClient, type ApiResponse, type PaginatedResponse } from './api';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

class UserService {
  // Get all users with optional filtering and pagination
  async getUsers(params: GetUsersParams = {}): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('endpoint:', endpoint);
    return apiClient.get<PaginatedResponse<User>>(endpoint);
  }

  // Get single user by ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/users', userData);
  }

  // Update existing user
  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  }

  // Bulk operations
  async bulkDeleteUsers(ids: number[]): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/users/bulk-delete', { ids });
  }

  async bulkUpdateStatus(ids: number[], status: 'Active' | 'Inactive'): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/users/bulk-status', { ids, status });
  }
}

export const userService = new UserService();
