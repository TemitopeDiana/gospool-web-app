export interface SignIn {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface SignResponse {
  token: string;
  refreshToken: string;
  user: User;
}
