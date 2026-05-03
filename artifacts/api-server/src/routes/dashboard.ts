import { Router } from "express";
import { db } from "@workspace/db";
import {
  statusTable,
  projectsTable,
  certificationsTable,
  skillsTable,
  competitionsTable,
  eventsTable,
  galleryTable,
} from "@workspace/db";
import { count } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  const [projects, certifications, skills, competitions, events, gallery, statusRows] = await Promise.all([
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(certificationsTable),
    db.select({ count: count() }).from(skillsTable),
    db.select({ count: count() }).from(competitionsTable),
    db.select({ count: count() }).from(eventsTable),
    db.select({ count: count() }).from(galleryTable),
    db.select().from(statusTable).limit(1),
  ]);

  res.json({
    totalProjects: Number(projects[0].count),
    totalCertifications: Number(certifications[0].count),
    totalSkills: Number(skills[0].count),
    totalCompetitions: Number(competitions[0].count),
    totalEvents: Number(events[0].count),
    totalGalleryImages: Number(gallery[0].count),
    currentStatus: statusRows[0]?.text ?? "No status set",
  });
});

router.get("/resume", async (req, res) => {
  const [skills, projects, certifications, competitions] = await Promise.all([
    db.select().from(skillsTable).orderBy(skillsTable.category),
    db.select().from(projectsTable).orderBy(projectsTable.featured),
    db.select().from(certificationsTable).orderBy(certificationsTable.issueDate),
    db.select().from(competitionsTable).orderBy(competitionsTable.date),
  ]);

  res.json({
    skills: skills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      createdAt: s.createdAt.toISOString(),
    })),
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      imageUrl: p.imageUrl ?? null,
      featured: p.featured,
      createdAt: p.createdAt.toISOString(),
    })),
    certifications: certifications.map(c => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl ?? null,
      createdAt: c.createdAt.toISOString(),
    })),
    competitions: competitions.map(c => ({
      id: c.id,
      title: c.title,
      organizer: c.organizer,
      type: c.type,
      date: c.date,
      result: c.result ?? null,
      createdAt: c.createdAt.toISOString(),
    })),
  });
});

export default router;
