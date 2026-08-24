import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Briefcase, FolderKanban, Award, Code2, Trophy,
  Calendar, Image, Radio, ArrowLeft, Terminal, FolderOpen, LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminGuard } from "../AdminGuard";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/assets", label: "Asset Manager", icon: FolderOpen },
  { href: "/admin/status", label: "Status", icon: Radio },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/competitions", label: "Competitions", icon: Trophy },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">Priyanshu.</span>
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5 ml-6">Admin CMS ({user?.username || "admin"})</p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => {
              const active = item.exact ? location === item.href : location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border space-y-1">
            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto p-6">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

