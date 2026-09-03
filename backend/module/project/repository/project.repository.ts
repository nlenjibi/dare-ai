import { connectDB } from "@/backend/database/mongoose";
import { ProjectModel } from "@/backend/database/model/project.model";
import { ProblemModel } from "@/backend/database/model/problem.model";

export async function findUserProjects(userId: string) {
  await connectDB();
  return ProjectModel.find({ userId, archivedAt: null })
    .sort({ updatedAt: -1 })
    .lean();
}

export async function findProjectById(id: string, userId: string) {
  await connectDB();
  return ProjectModel.findOne({ _id: id, userId }).lean();
}

export async function createProject(userId: string, data: { name: string; description?: string; mode?: string }) {
  await connectDB();
  return ProjectModel.create({ userId, ...data });
}

export async function updateProject(id: string, userId: string, data: Partial<{ name: string; description: string; mode: string }>) {
  await connectDB();
  return ProjectModel.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean();
}

export async function archiveProject(id: string, userId: string) {
  await connectDB();
  return ProjectModel.findOneAndUpdate({ _id: id, userId }, { archivedAt: new Date() }, { new: true }).lean();
}

export async function deleteProject(id: string, userId: string) {
  await connectDB();
  await ProblemModel.deleteMany({ projectId: id });
  return ProjectModel.findOneAndDelete({ _id: id, userId });
}

export async function upsertProblem(
  projectId: string,
  data: {
    statement: string;
    objective?: string;
    context?: string;
    constraints?: string;
  }
) {
  await connectDB();
  return ProblemModel.findOneAndUpdate(
    { projectId },
    { ...data },
    { upsert: true, new: true }
  ).lean();
}

export async function selectObjective(
  projectId: string,
  choice: "ORIGINAL" | "DEEPER"
) {
  await connectDB();
  await ProblemModel.findOneAndUpdate({ projectId }, { selectedObjective: choice });
  return ProjectModel.findByIdAndUpdate(projectId, { status: "IN_PROGRESS" }, { new: true }).lean();
}
