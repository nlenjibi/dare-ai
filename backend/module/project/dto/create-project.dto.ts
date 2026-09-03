import { ProjectMode } from "@/shared/enum";

export interface CreateProjectDto {
  name: string;
  description?: string;
  mode?: ProjectMode;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  mode?: ProjectMode;
}
