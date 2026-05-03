import { useGetResumeData } from "@workspace/api-client-react";
import { Loader2, Download, Github, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  language: "Languages",
  web: "Web Development",
  web3: "Web3 & Blockchain",
  dsa: "DSA",
  other: "Tools & Others",
};

export default function Resume() {
  const { data: resumeData, isLoading } = useGetResumeData();

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const skillsByCategory = resumeData?.skills.reduce<Record<string, typeof resumeData.skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) ?? {};

  return (
    <>
      {/* Print button — hidden when printing */}
      <div className="fixed top-4 right-4 z-50 print:hidden flex gap-2">
        <Button onClick={handlePrint} className="gap-2 shadow-lg">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Back to Portfolio</a>
        </Button>
      </div>

      {/* Resume document */}
      <div className="min-h-screen bg-white text-gray-900 py-10 px-6 print:py-0 print:px-0">
        <div className="max-w-[800px] mx-auto print:max-w-full font-sans">

          {/* Header */}
          <header className="mb-8 border-b-2 border-gray-800 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Priyanshu Sarjan</h1>
            <p className="text-lg text-gray-600 mt-1">MERN Stack Developer | Blockchain Enthusiast | DSA Practitioner</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> priyanshu@example.com</span>
              <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5" /> github.com/priyanshusarjan</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> portfolio.example.com</span>
            </div>
          </header>

          {/* Education */}
          <section className="mb-7">
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Education</h2>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">B.Tech in Computer Science and Engineering</p>
                <p className="text-gray-600 text-sm">Samrat Ashok Technological Institute (SATI), Vidisha</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>2023 – 2027</p>
                <p>2nd Year</p>
              </div>
            </div>
          </section>

          {/* Skills */}
          {resumeData && Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-7">
              <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Technical Skills</h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                  <div key={cat} className="flex gap-2 text-sm">
                    <span className="font-semibold text-gray-800 min-w-[140px]">{SKILL_CATEGORY_LABELS[cat] || cat}:</span>
                    <span className="text-gray-700">{catSkills.map(s => s.name).join(", ")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resumeData && resumeData.projects.length > 0 && (
            <section className="mb-7">
              <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Projects</h2>
              <div className="space-y-4">
                {resumeData.projects.map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{project.title}</p>
                        {project.githubUrl && (
                          <a href={project.githubUrl} className="text-gray-500 text-xs underline print:no-underline">{project.githubUrl}</a>
                        )}
                      </div>
                      {project.liveUrl && (
                        <a href={project.liveUrl} className="text-gray-500 text-xs underline print:no-underline shrink-0">{project.liveUrl}</a>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Tech:</span> {project.techStack.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resumeData && resumeData.certifications.length > 0 && (
            <section className="mb-7">
              <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Certifications</h2>
              <div className="space-y-2">
                {resumeData.certifications.map(cert => (
                  <div key={cert.id} className="flex justify-between items-baseline text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.title}</span>
                      <span className="text-gray-600"> — {cert.issuer}</span>
                    </div>
                    <span className="text-gray-500 shrink-0 ml-4">{cert.issueDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Competitions */}
          {resumeData && resumeData.competitions.length > 0 && (
            <section className="mb-7">
              <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Competitions & Workshops</h2>
              <div className="space-y-2">
                {resumeData.competitions.map(comp => (
                  <div key={comp.id} className="flex justify-between items-baseline text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">{comp.title}</span>
                      <span className="text-gray-600"> — {comp.organizer}</span>
                      {comp.result && <span className="text-gray-600"> ({comp.result})</span>}
                    </div>
                    <span className="text-gray-500 shrink-0 ml-4">{comp.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
