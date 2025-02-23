import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import type { ApiError, ApiResponse, RequestData } from './interfaces';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 공통 fetcher 함수
const fetcher = async <T>(
  method: Method,
  url: string,
  data?: RequestData,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config
    });
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw {
      message: axiosError.response?.data?.message || 'Unhandled error occurred',
      status: axiosError.response?.status || 500
    };
  }
};

// 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 로그인 페이지로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, fetcher };
