export interface UpdateProfileDto {
  name?: string;
  image?: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}
