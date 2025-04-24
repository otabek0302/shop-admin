export interface User {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    role?: string;
    createdAt?: string;
}

export interface UserModalProps {
    editData: User | null;
}

export interface UserListActionsProps {
    user: User;
}