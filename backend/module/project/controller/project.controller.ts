import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { ok, created, fail } from "@/common/util/api-response";
import { toApiError } from "@/common/exception/app-error";
import {
  findUserProjects,
  createProject,
  findProjectById,
  updateProject,
  deleteProject,
  upsertProblem,
  selectObjective,
} from "../repository/project.repository";
import {
  createProjectSchema,
  updateProjectSchema,
  upsertProblemSchema,
  selectObjectiveSchema,
} from "../validator/project.validator";

function uid(user: object): string {
  return (user as { id: string }).id;
}

export const ProjectController = {
  async list() {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const projects = await findUserProjects(uid(session.user));
      return ok(projects);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async create(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const project = await createProject(uid(session.user), parsed.data);
      return created(project);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async getById(id: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      const project = await findProjectById(id, uid(session.user));
      if (!project) return fail("Project not found", 404);
      return ok(project);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async update(req: NextRequest, id: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const updated = await updateProject(id, uid(session.user), parsed.data);
      if (!updated) return fail("Project not found", 404);
      return ok(updated);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async delete(id: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    try {
      await deleteProject(id, uid(session.user));
      return ok({ deleted: true });
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async upsertProblem(req: NextRequest, id: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = upsertProblemSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const problem = await upsertProblem(id, parsed.data);
      return ok(problem);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },

  async selectObjective(req: NextRequest, id: string) {
    const session = await auth();
    if (!session?.user) return fail("Unauthorized", 401);
    const body = await req.json();
    const parsed = selectObjectiveSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    try {
      const project = await selectObjective(id, parsed.data.choice);
      return ok(project);
    } catch (err) {
      const { message, statusCode } = toApiError(err);
      return fail(message, statusCode);
    }
  },
};
