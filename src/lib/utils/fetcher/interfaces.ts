export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export type RequestData = Record<string, unknown> | unknown[] | FormData | null;
