import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

export const api = axios.create({
  baseURL: `${process.env.API_URL}/api/v1`,
  withCredentials: true,
});

export const apiV1 = axios.create({
  baseURL: `${process.env.API_URL}/api/v1`,
  withCredentials: true,
});

const refreshAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (refreshToken) {
    try {
      const res = await api.post(`/auth/refresh-token`, { refreshToken });

      return res.data.token;
    } catch (err) {
      console.error('[refreshAccessToken] failed', err);
      return null;
    }
  }

  return null;
};

apiV1.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();
    let token = cookieStore.get('access_token')?.value;

    if (!token) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error('AUTH_REQUIRED IN REQUEST USE');
      }
      token = newToken;
    }

    const decoded = jwtDecode(token);

    const isExpired =
      dayjs.unix(decoded?.exp || 0).diff(dayjs(), 'second') <= 30;

    if (isExpired) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error('AUTH_REQUIRED IN IS EXPIRED');
      }
      token = newToken;

      cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 1,
      });

      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiV1.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();

      console.log('MEW TOKEN FROM RESPONSE.USE', newToken);

      if (newToken && error.config) {
        error.config.headers?.set('Authorization', `Bearer ${newToken}`);
        return apiV1(error.config);
      }
    }
    return Promise.reject(error);
  }
);
