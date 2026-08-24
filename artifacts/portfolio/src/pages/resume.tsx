import React, { useState, useEffect } from "react";
import { Loader2, Download, Printer, ArrowLeft, FileText, BookOpen, Mail, Github, Globe, Linkedin, MapPin, Calendar, CheckCircle2, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Experience {
  id: number;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  techStack: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
}

interface Skill {
  id: number;
  name: string;
  category: "language" | "web" | "web3" | "dsa" | "other";
  proficiency: number;
}

interface Certification {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
}

interface Competition {
  id: number;
  title: string;
  organizer: string;
  type: string;
  date: string;
  result?: string | null;
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  language: "Languages & Core",
  web: "Web Development",
  web3: "Web3 & Blockchain",
  dsa: "Data Structures & Algos",
  other: "Tools & Architectures",
};

export default function Resume() {
  const [template, setTemplate] = useState<"1-page" | "multi-page">("1-page");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, projRes, skillRes, certRes, compRes] = await Promise.all([
          fetch("/api/experiences").then((r) => r.ok ? r.json() : []),
          fetch("/api/projects").then((r) => r.ok ? r.json() : []),
          fetch("/api/skills").then((r) => r.ok ? r.json() : []),
          fetch("/api/certifications").then((r) => r.ok ? r.json() : []),
          fetch("/api/competitions").then((r) => r.ok ? r.json() : []),
        ]);

        setExperiences(expRes);
        setProjects(projRes);
        setSkills(skillRes);
        setCertifications(certRes);
        setCompetitions(compRes);
      } catch (err) {
        console.error("Error fetching resume data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="ml-3 font-medium text-sm">Generating PDF Templates...</span>
      </div>
    );
  }

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 print:bg-white print:text-black">
      {/* Floating Control Toolbar - Hidden when printing */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 print:hidden bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4">
        <a
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Portfolio
        </a>

        <div className="h-4 w-px bg-slate-700" />

        {/* Template Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTemplate("1-page")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              template === "1-page"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> 1-Page Resume
          </button>

          <button
            onClick={() => setTemplate("multi-page")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              template === "multi-page"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Detailed CV Booklet
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </Button>
      </div>

      {/* Document Container */}
      <div className="pt-24 pb-16 px-4 print:p-0">
        {template === "1-page" ? (
          /* ===================================================================
             TEMPLATE 1: 1-PAGE MODERN RESUME
             =================================================================== */
          <div className="max-w-[800px] mx-auto bg-white text-slate-900 p-8 shadow-2xl rounded-sm font-sans text-xs leading-relaxed border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-full">
            {/* Header */}
            <header className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Priyanshu Sarjan</h1>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  Full Stack Engineer | MERN & Web3 Developer
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  2nd-Year B.Tech CSE @ SATI | Focused on High-Performance Web Apps & Blockchain Systems
                </p>
              </div>

              <div className="text-right text-[11px] text-slate-600 space-y-0.5 shrink-0 ml-4">
                <p className="flex items-center justify-end gap-1 font-medium text-slate-800">
                  <Mail className="w-3 h-3 text-slate-600" /> priyanshusarjan@gmail.com
                </p>
                <p className="flex items-center justify-end gap-1">
                  <Globe className="w-3 h-3 text-slate-600" /> github.com/priyanshu-sarjan
                </p>
                <p className="flex items-center justify-end gap-1">
                  <MapPin className="w-3 h-3 text-slate-600" /> Vidisha / Bhopal, MP, India
                </p>
              </div>
            </header>

            {/* Education */}
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Education
              </h2>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900">Bachelor of Technology (B.Tech) - Computer Science & Engineering</p>
                  <p className="text-slate-700">Samrat Ashok Technological Institute (SATI), Vidisha</p>
                </div>
                <div className="text-right text-slate-600 font-medium">
                  <p>2023 – 2027</p>
                  <p>Current CGPA: 8.5/10</p>
                </div>
              </div>
            </section>

            {/* Technical Skills Matrix */}
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Technical Skills
              </h2>
              <div className="space-y-1 text-[11px]">
                {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                  <div key={cat} className="flex">
                    <span className="font-semibold text-slate-900 min-w-[140px]">
                      {SKILL_CATEGORY_LABELS[cat] || cat}:
                    </span>
                    <span className="text-slate-700">
                      {catSkills.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Work Experience */}
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Work Experience & Key Roles
              </h2>
              <div className="space-y-3">
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.title} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                        <span className="text-[11px] font-medium text-slate-600">{exp.startDate} – {exp.endDate || "Present"}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5">{exp.description}</p>
                      {exp.techStack && exp.techStack.length > 0 && (
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Tech: {exp.techStack.join(" • ")}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-slate-600 italic">
                    Full Stack Developer Intern @ Tech Innovation Labs (Jan 2026 – Present) | Web3 Lead @ SATI Tech Club
                  </div>
                )}
              </div>
            </section>

            {/* Featured Projects */}
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Highlighted Projects
              </h2>
              <div className="space-y-2.5">
                {projects.slice(0, 4).map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      <span className="text-[10px] text-slate-500">{proj.techStack ? proj.techStack.join(", ") : ""}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications & Achievements */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                Certifications & Achievements
              </h2>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {certifications.map((c) => (
                  <div key={c.id} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-700 shrink-0" />
                    <span className="font-medium text-slate-800">{c.title}</span>
                    <span className="text-slate-500 text-[10px]">({c.issuer})</span>
                  </div>
                ))}
                {competitions.map((comp) => (
                  <div key={comp.id} className="flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-slate-700 shrink-0" />
                    <span className="font-medium text-slate-800">{comp.title}</span>
                    {comp.result && <span className="text-slate-500 text-[10px]">({comp.result})</span>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* ===================================================================
             TEMPLATE 2: MULTI-PAGE DETAILED CV (BOOKLET STYLE)
             =================================================================== */
          <div className="max-w-[850px] mx-auto space-y-8 print:space-y-0">
            {/* BOOKLET PAGE 1: Executive Overview & Timeline */}
            <div className="bg-white text-slate-900 p-10 shadow-2xl rounded-sm font-sans text-xs leading-relaxed border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:h-screen print:page-break-after">
              <header className="border-b-4 border-cyan-600 pb-6 mb-6 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    Comprehensive Curriculum Vitae & Portfolio Booklet
                  </span>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 mt-2">Priyanshu Sarjan</h1>
                  <p className="text-base font-semibold text-slate-700 mt-1">
                    Full-Stack Software Engineer | Smart Contract Architect | Data Structures & Algorithms
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600 space-y-1 shrink-0">
                  <p className="font-semibold text-slate-900">Vidisha / Bhopal, MP</p>
                  <p className="text-cyan-700 font-medium">priyanshusarjan@gmail.com</p>
                  <p>github.com/priyanshu-sarjan</p>
                </div>
              </header>

              {/* Bio Summary */}
              <section className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-600" /> Executive Bio & Professional Profile
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Second-year Computer Science & Engineering undergraduate at Samrat Ashok Technological Institute (SATI) specializing in modern MERN stack development, decentralized Ethereum smart contracts, and high-efficiency algorithmic problem-solving. Demonstrated expertise in building production-grade web applications, JWT authentication architectures, and server side integrations.
                </p>
              </section>

              {/* Complete Chronological Experience Timeline */}
              <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" /> Professional Experience Timeline
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-cyan-500 pl-4 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                        <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                          {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                      <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                      {exp.techStack && exp.techStack.length > 0 && (
                        <div className="flex gap-1 flex-wrap pt-1">
                          {exp.techStack.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Detailed Skills Matrix */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-3">
                  Comprehensive Skills Proficiency Breakdown
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((s) => (
                    <div key={s.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-800">
                        <span>{s.name}</span>
                        <span className="text-slate-500 font-bold">{s.proficiency}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="bg-cyan-600 h-full rounded-full"
                          style={{ width: `${s.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* BOOKLET PAGE 2: Full Projects Dossier & Certificate Portfolio */}
            <div className="bg-white text-slate-900 p-10 shadow-2xl rounded-sm font-sans text-xs leading-relaxed border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:h-screen">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-600" /> Full Project Dossier
              </h2>

              <div className="grid grid-cols-1 gap-5 mb-8">
                {projects.map((proj) => (
                  <div key={proj.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                        <p className="text-[11px] text-cyan-700 font-medium">{proj.techStack ? proj.techStack.join(" • ") : ""}</p>
                      </div>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-cyan-600 hover:underline flex items-center gap-1"
                        >
                          Code Repository <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-700">{proj.description}</p>
                  </div>
                ))}
              </div>

              {/* Certificate Portfolio */}
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-600" /> Verified Credentials & Competitions
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {certifications.map((c) => (
                  <div key={c.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-600">{c.issuer}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-medium">Issued: {c.issueDate}</span>
                  </div>
                ))}

                {competitions.map((comp) => (
                  <div key={comp.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{comp.title}</h4>
                      <p className="text-xs text-slate-600">{comp.organizer}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-cyan-700 mt-2">{comp.result || comp.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
