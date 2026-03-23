import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { decrypt, encrypt } from '@/utils/encrypt';

export const api = axios.create({
  baseURL: `${process.env.API_URL}/api/v1`,
  withCredentials: true,
});

export const apiV1 = axios.create({
  baseURL: `${process.env.API_URL}/api/v1`,
  withCredentials: true,
});

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const encryptedRefreshToken = cookieStore.get('refresh_token')?.value;

    if (!encryptedRefreshToken) return null;

    const refreshToken = decrypt(encryptedRefreshToken);

    const res = await axios.post(
      `${process.env.API_URL}/api/auth/refresh-token`,
      { refreshToken }
    );

    const { token } = res.data;

    if (!token) return null;

    cookieStore.set('access_token', encrypt(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 2,
    });

    return token;
  } catch (err) {
    console.error('[refreshAccessToken] failed:', err);
    return null;
  }
};

apiV1.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();
    let encryptedToken = cookieStore.get('access_token')?.value;

    // 🔁 If no token → try refresh
    if (!encryptedToken) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error('AUTH_REQUIRED');
      }

      encryptedToken = encrypt(newToken);
    }

    let token = decrypt(encryptedToken);

    const decoded = jwtDecode<{ exp: number }>(token);

    const isExpired = dayjs.unix(decoded.exp).diff(dayjs(), 'second') <= 0;

    if (isExpired) {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        throw new Error('AUTH_REQUIRED');
      }

      token = newToken;

      const cookieStore = await cookies();
      cookieStore.set('access_token', encrypt(newToken), {
        httpOnly: true,
        path: '/',
      });
    }

    config.headers.set('Authorization', `Bearer ${token}`);

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiV1.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken && error.config) {
        error.config.headers?.set('Authorization', `Bearer ${newToken}`);
        return apiV1(error.config);
      }
    }
    return Promise.reject(error);
  }
);
