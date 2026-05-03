import { useGetDashboardSummary } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderKanban, Award, Code2, Trophy, Calendar, Image, Radio } from "lucide-react";
import { Link } from "wouter";

const statCards = [
  { key: "totalProjects" as const, label: "Projects", icon: FolderKanban, href: "/admin/projects", color: "text-blue-400" },
  { key: "totalCertifications" as const, label: "Certifications", icon: Award, href: "/admin/certifications", color: "text-green-400" },
  { key: "totalSkills" as const, label: "Skills", icon: Code2, href: "/admin/skills", color: "text-purple-400" },
  { key: "totalCompetitions" as const, label: "Competitions", icon: Trophy, href: "/admin/competitions", color: "text-yellow-400" },
  { key: "totalEvents" as const, label: "Events", icon: Calendar, href: "/admin/events", color: "text-red-400" },
  { key: "totalGalleryImages" as const, label: "Gallery Images", icon: Image, href: "/admin/gallery", color: "text-pink-400" },
];

export default function Admin() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio content</p>
        </div>

        {/* Current Status */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">Currently Working On</p>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" />
              ) : (
                <p className="text-foreground font-medium mt-0.5">{summary?.currentStatus}</p>
              )}
            </div>
            <Link href="/admin/status" className="ml-auto text-xs text-primary hover:underline">Update</Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map(({ key, label, icon: Icon, href, color }) => (
            <Link key={key} href={href}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-3xl font-bold">{summary?.[key] ?? 0}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/admin/projects", label: "Add a new project" },
              { href: "/admin/certifications", label: "Add a certification" },
              { href: "/admin/skills", label: "Update your skills" },
              { href: "/admin/competitions", label: "Log a competition" },
              { href: "/admin/events", label: "Add an upcoming event" },
              { href: "/admin/gallery", label: "Upload gallery images" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-card hover:border-primary/30 hover:bg-muted/50 text-sm font-medium transition-all">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
