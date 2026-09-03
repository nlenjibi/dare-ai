export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponseDto {
  id: string;
  email: string;
  name?: string;
}
