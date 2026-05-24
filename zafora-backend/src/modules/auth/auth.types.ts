export interface AuthSession {
  userId: number;
  email: string;
  role: string;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export interface VerifyResult {
  authenticated: boolean;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
