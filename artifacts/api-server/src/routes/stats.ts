import { Router } from "express";
import { db, leadsTable, projectsTable, projectInterestsTable, documentsTable } from "@workspace/db";
import { count, sql, desc, gte } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalLeadsResult,
    totalProjectsResult,
    totalInterestsResult,
    totalDocumentsResult,
    newLeadsThisMonthResult,
    activeProjectsResult,
    leadsByStatusResult,
    recentLeads,
  ] = await Promise.all([
    db.select({ count: count() }).from(leadsTable),
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(projectInterestsTable),
    db.select({ count: count() }).from(documentsTable),
    db.select({ count: count() }).from(leadsTable).where(gte(leadsTable.createdAt, firstOfMonth)),
    db.select({ count: count() }).from(projectsTable).where(
      sql`${projectsTable.fundingStatus} NOT IN ('funded', 'closed')`
    ),
    db.select({ status: leadsTable.status, count: count() }).from(leadsTable).groupBy(leadsTable.status),
    db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt)).limit(5),
  ]);

  res.json({
    totalLeads: totalLeadsResult[0]?.count ?? 0,
    totalProjects: totalProjectsResult[0]?.count ?? 0,
    totalInterests: totalInterestsResult[0]?.count ?? 0,
    totalDocuments: totalDocumentsResult[0]?.count ?? 0,
    newLeadsThisMonth: newLeadsThisMonthResult[0]?.count ?? 0,
    activeProjects: activeProjectsResult[0]?.count ?? 0,
    leadsByStatus: leadsByStatusResult,
    recentLeads,
  });
});

router.get("/stats/projects", async (req, res) => {
  const [bySector, byStatus] = await Promise.all([
    db.select({ sector: projectsTable.sector, count: count(), totalValue: sql<string>`'N/A'` })
      .from(projectsTable)
      .groupBy(projectsTable.sector),
    db.select({ status: projectsTable.fundingStatus, count: count() })
      .from(projectsTable)
      .groupBy(projectsTable.fundingStatus),
  ]);

  res.json({ bySector, byStatus });
});

export default router;
