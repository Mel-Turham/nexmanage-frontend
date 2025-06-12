// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ErrorResponseData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

export interface ErrorWithStatus extends ApiError {
  status: number;
}
