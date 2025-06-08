export type Role = "student" | "professor" | "authority";

export interface UserData {
  uid: string;
  email: string;
  role: Role;
  nombres?: string;
  celular?: string;
  ciudad?: string;
  nacionalidad?: string;
  facultad?: string;
  carrera?: string;
  nivel?: string;
  edad?: number;
  createdAt?: number;
}

export interface Comment {
  id: string;
  uid: string;
  authorEmail: string;
  comment: string;
  createdAt: number;
}

export interface Post {
  id: string;
  uid: string;
  authorEmail: string;
  title: string;
  type: string;
  content: string;
  createdAt: number;
  votes: string[]; // array de UID de usuarios que votaron
  comments: Comment[];
  institutionalResponse?: string;
}