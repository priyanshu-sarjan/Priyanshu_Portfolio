import bcrypt from "bcryptjs";
import { db, usersTable, experiencesTable, projectsTable, skillsTable, certificationsTable } from "@workspace/db";

async function main() {
  console.log("Seeding database...");

  // Seed default admin user
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  try {
    await db.insert(usersTable).values({
      username: process.env.ADMIN_USER || "admin",
      passwordHash,
      role: "admin",
    }).onConflictDoNothing();
    console.log("✔ Admin user seeded");
  } catch (err) {
    console.log("Admin user seed skipped or already exists", err);
  }

  // Seed initial experiences if empty
  try {
    const existingExp = await db.select().from(experiencesTable);
    if (existingExp.length === 0) {
      await db.insert(experiencesTable).values([
        {
          title: "Full Stack Developer Intern",
          company: "Tech Innovation Labs",
          location: "Remote / Bhopal",
          startDate: "Jan 2026",
          endDate: "Present",
          description: "Built scalable MERN stack web applications, integrated RESTful APIs, optimized database queries, and implemented JWT-based RBAC authentication.",
          techStack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
          order: 1,
        },
        {
          title: "Blockchain & Web3 Developer Lead",
          company: "SATI Tech Club",
          location: "Vidisha, MP",
          startDate: "Aug 2025",
          endDate: "Dec 2025",
          description: "Led student developer teams in designing decentralized smart contracts on Ethereum/Solidity and building interactive dApps using Ethers.js.",
          techStack: ["Solidity", "Ethers.js", "Web3.js", "React", "Hardhat"],
          order: 2,
        },
      ]);
      console.log("✔ Experiences seeded");
    }
  } catch (err) {
    console.log("Experiences seed warning", err);
  }

  console.log("Seeding completed successfully!");
}

main().catch(console.error);
