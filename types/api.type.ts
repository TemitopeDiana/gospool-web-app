export interface ApiResponse<T> {
  success: boolean;
  data?: T;
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
