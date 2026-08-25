import React, { useState, useEffect } from "react";
import { useGetProjects, useGetSkills, useGetCertifications, useGetCompetitions, useGetGallery, useGetStatus } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, Loader2, Award, Zap, Trophy, Image as ImageIcon } from "lucide-react";

import staticCertificates from "@/data/certificates.json";
import staticGallery from "@/data/gallery.json";

const SKILL_CATEGORIES = [
  { id: "language" as const, label: "Languages" },
  { id: "web" as const, label: "Web Dev" },
  { id: "web3" as const, label: "Web3 & Blockchain" },
  { id: "dsa" as const, label: "DSA" },
  { id: "other" as const, label: "Other Tools" },
];

const FALLBACK_STATUS = "Building full-stack MERN & Web3 applications";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Personal Portfolio & CMS",
    description: "Full-stack dynamic portfolio featuring JWT admin authentication, experience CMS, certificate uploads, and a 2-template PDF resume engine.",
    techStack: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "Drizzle ORM"],
    githubUrl: "https://github.com/priyanshu-sarjan/Priyanshu_Portfolio",
    liveUrl: "https://priyanshu-sarjanportfolio.vercel.app",
    imageUrl: null as string | null,
    featured: true,
  },
  {
    id: 2,
    title: "Decentralized Smart Contract Suite",
    description: "Solidity smart contract protocol architecture with automated test suite and web3 frontend integration.",
    techStack: ["Solidity", "Ethers.js", "React", "Hardhat", "Ethereum"],
    githubUrl: "https://github.com/priyanshu-sarjan",
    liveUrl: "https://github.com/priyanshu-sarjan",
    imageUrl: null as string | null,
    featured: true,
  },
];

const FALLBACK_SKILLS = [
  { id: 1, name: "JavaScript / TypeScript", category: "language", proficiency: 90 },
  { id: 2, name: "Java & C Programming", category: "language", proficiency: 85 },
  { id: 3, name: "Python", category: "language", proficiency: 80 },
  { id: 4, name: "React & Vite", category: "web", proficiency: 92 },
  { id: 5, name: "Node.js & Express", category: "web", proficiency: 88 },
  { id: 6, name: "Tailwind CSS", category: "web", proficiency: 90 },
  { id: 7, name: "Solidity & Smart Contracts", category: "web3", proficiency: 80 },
  { id: 8, name: "Data Structures & Algorithms", category: "dsa", proficiency: 85 },
];

const FALLBACK_EXPERIENCES = [
  {
    id: 1,
    title: "Full-Stack Web Developer & Lead",
    company: "SATI Tech Club",
    location: "Vidisha, MP",
    startDate: "2024",
    endDate: "Present",
    description: "Architected full-stack web applications, conducted technical workshops on MERN stack, and mentored 100+ junior students in Data Structures and Algorithms.",
    techStack: ["React", "Node.js", "TypeScript", "Tailwind CSS"],
  },
];

export default function Home() {
  const { data: statusData, isLoading: loadingStatus } = useGetStatus();
  const { data: rawProjects, isLoading: loadingProjects } = useGetProjects();
  const { data: rawSkills, isLoading: loadingSkills } = useGetSkills();
  const { data: rawCertifications, isLoading: loadingCertifications } = useGetCertifications();
  const { data: rawCompetitions, isLoading: loadingCompetitions } = useGetCompetitions();
  const { data: rawGallery, isLoading: loadingGallery } = useGetGallery();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loadingExp, setLoadingExp] = useState(true);

  useEffect(() => {
    fetch("/api/experiences")
      .then(res => res.ok ? res.json() : [])
      .then(data => setExperiences(Array.isArray(data) && data.length > 0 ? data : FALLBACK_EXPERIENCES))
      .catch(() => setExperiences(FALLBACK_EXPERIENCES))
      .finally(() => setLoadingExp(false));
  }, []);

  const status = statusData?.text || FALLBACK_STATUS;
  const projects = Array.isArray(rawProjects) && rawProjects.length > 0 ? rawProjects : FALLBACK_PROJECTS;
  const skills = Array.isArray(rawSkills) && rawSkills.length > 0 ? rawSkills : FALLBACK_SKILLS;
  const certifications = Array.isArray(rawCertifications) && rawCertifications.length > 0 ? rawCertifications : (staticCertificates as any[]);
  const competitions = Array.isArray(rawCompetitions) ? rawCompetitions : [];
  const gallery = Array.isArray(rawGallery) && rawGallery.length > 0 ? rawGallery : (staticGallery as any[]);

  const featuredProjects = projects.filter(p => p.featured);
  const allProjects = projects.filter(p => !p.featured);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">

        {/* Hero */}
        <section className="space-y-6 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {loadingStatus ? <Loader2 className="w-3 h-3 animate-spin" /> : (typeof status === "string" ? status : (status as any)?.text || FALLBACK_STATUS)}
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Priyanshu<br />
              <span className="text-primary">Sarjan</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              2nd-year B.Tech CSE at SATI. Building with MERN Stack, Blockchain, and DSA in Java, C & Python.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://github.com/priyanshu-sarjan" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="/resume"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors">
              View & Export PDF CV
            </a>
          </div>
        </section>

        {/* Work Experience Timeline */}
        {experiences.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Experience Timeline</h2>
            </div>
            {loadingExp ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-6 border-l-2 border-primary/20 pl-6 ml-2">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-4 border-background group-hover:scale-125 transition-transform" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                        <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                      <p className="text-sm text-muted-foreground/90 pt-1 leading-relaxed">{exp.description}</p>
                      {exp.techStack && exp.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.techStack.map((tech: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs bg-muted/60">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured Projects */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Projects</h2>
          </div>
          {loadingProjects ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : featuredProjects.length === 0 && allProjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No projects added yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(featuredProjects.length > 0 ? featuredProjects : allProjects).map(project => (
                  <Card key={project.id} className="bg-card border-border hover:border-primary/40 transition-all duration-300 group">
                    {project.imageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <div className="flex gap-2 shrink-0">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Skills */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Technical Arsenal</h2>
          </div>
          {loadingSkills ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SKILL_CATEGORIES.map(cat => {
                const catSkills = skills.filter(s => s.category === cat.id);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat.id} className="space-y-4">
                    <h3 className="text-base font-semibold text-primary uppercase tracking-wider">{cat.label}</h3>
                    <ul className="space-y-3">
                      {catSkills.map(skill => (
                        <li key={skill.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.proficiency}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                              style={{ width: `${skill.proficiency}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Certifications */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Certifications & Verified Credentials</h2>
          </div>
          {loadingCertifications ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : certifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No certifications added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    {cert.imageUrl ? (
                      <img src={cert.imageUrl} alt={cert.title} className="w-10 h-10 object-contain rounded shrink-0 bg-muted/40 p-1 border border-border" />
                    ) : (
                      <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm leading-tight">{cert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                    </div>
                  </div>
                  {cert.credentialUrl && (
                    <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium">
                        <ExternalLink className="w-3 h-3" /> Verify Credential
                      </a>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Verified</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Competitions */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Competitions & Workshops</h2>
          </div>
          {loadingCompetitions ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : competitions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No competitions added yet.</p>
          ) : (
            <div className="space-y-3">
              {competitions.map(comp => (
                <div key={comp.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                  <div className="shrink-0">
                    <Badge variant="outline" className="text-xs capitalize">{comp.type}</Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{comp.title}</p>
                    <p className="text-xs text-muted-foreground">{comp.organizer}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {comp.result && <p className="text-xs font-medium text-primary">{comp.result}</p>}
                    <p className="text-xs text-muted-foreground">{comp.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gallery */}
        {!loadingGallery && gallery.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map(img => (
                <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={img.url} alt={img.caption || "Gallery image"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {(img.caption || img.eventName) && (
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                      <div>
                        {img.eventName && <p className="text-xs font-semibold text-primary">{img.eventName}</p>}
                        {img.caption && <p className="text-xs text-foreground">{img.caption}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </PublicLayout>
  );
}
