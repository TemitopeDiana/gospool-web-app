import { Pagination } from './church.type';

export interface ApiResponse<T = undefined> {
  success?: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  error?: unknown;
}

export interface APIErrorPayload {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  details?: Record<string, string>;
}
