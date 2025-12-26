const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_URL = API_BASE_URL + '/auth';

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export interface User {
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

class AuthService {
  private getRequestOptions(): RequestInit {
    return {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async signUp(data: SignUpRequest): Promise<Response> {
    return await fetch(`${AUTH_URL}/sign-up`, {
      method: 'POST',
      ...this.getRequestOptions(),
      body: JSON.stringify(data),
    });
  }

  async signIn(data: SignInRequest): Promise<Response> {
    return await fetch(`${AUTH_URL}/sign-in`, {
      method: 'POST',
      ...this.getRequestOptions(),
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      ...this.getRequestOptions(),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      ...this.getRequestOptions(),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

}

export const authService = new AuthService();
