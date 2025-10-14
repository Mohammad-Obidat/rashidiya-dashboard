import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      credentials
    );
    return data;
  },

  async getProfile(token: string): Promise<User> {
    const { data } = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  removeToken(): void {
    localStorage.removeItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
