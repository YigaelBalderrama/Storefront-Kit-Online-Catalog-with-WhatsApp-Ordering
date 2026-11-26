export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
export interface LoginResponse {
  accessToken: string;
}
