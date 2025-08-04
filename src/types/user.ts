export interface User {
    _id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    id: number;
}

export type UserRole = 'Admin' | 'User' | 'Moderator';
export type UserStatus = 'Active' | 'Inactive';
