import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import {
  CreateProjectBody,
  UpdateProjectBody,
  ListProjectsQuery,
  ExpressInterestBody,
} from "./projects.validator.js";
import {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  listProjectInterests,
  createProjectInterest,
} from "./projects.service.js";

const router = Router();

// B4 — public: list + detail
router.get(ROUTE_PATHS.PROJECTS.LIST, async (req, res) => {
  const parsed = ListProjectsQuery.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid query params" }); return; }
  const result = await listProjects(parsed.data);
  res.json(result);
});

router.get(ROUTE_PATHS.PROJECTS.DETAIL, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const project = await getProjectById(id);
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

// B4 — public: express interest
router.post(ROUTE_PATHS.PROJECTS.INTERESTS, async (req, res) => {
  const projectId = parseIdParam(req, res);
  if (projectId === null) return;
  const parsed = ExpressInterestBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const interest = await createProjectInterest(projectId, parsed.data);
  res.status(201).json(interest);
});

// B5 — protected: admin CRUD
router.post(ROUTE_PATHS.PROJECTS.LIST, requireAuth, async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const project = await createProject(parsed.data);
  res.status(201).json(project);
});

router.patch(ROUTE_PATHS.PROJECTS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const project = await updateProject(id, parsed.data);
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

router.delete(ROUTE_PATHS.PROJECTS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteProject(id);
  res.status(204).send();
});

router.get(ROUTE_PATHS.PROJECTS.INTERESTS, requireAuth, async (req, res) => {
  const projectId = parseIdParam(req, res);
  if (projectId === null) return;
  const result = await listProjectInterests(projectId);
  res.json(result);
});

export default router;
