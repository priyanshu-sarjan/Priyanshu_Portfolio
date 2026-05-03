import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, Calendar, FileText, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Portfolio", icon: Terminal },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/resume", label: "Resume", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 print-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              <span className="font-bold tracking-tight text-lg">Priyanshu.</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-muted-foreground hover:bg-muted focus:outline-none"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {children}
      </main>

      <footer className="border-t border-border/50 py-8 mt-20 print-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Built by Priyanshu Sarjan.</p>
        </div>
      </footer>
    </div>
  );
}
