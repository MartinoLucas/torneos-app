export interface ApiResponse<T> {
  code: number;
  message: string;
  body: T;
}

export interface ApiError {
  type: string;
  title: string;
  code: number;
  detail?: string;
  instance: string;
}