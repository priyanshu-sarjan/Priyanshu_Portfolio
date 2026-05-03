import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Events from "@/pages/events";
import Resume from "@/pages/resume";
import Admin from "@/pages/admin";
import AdminProjects from "@/pages/admin/projects";
import AdminCertifications from "@/pages/admin/certifications";
import AdminSkills from "@/pages/admin/skills";
import AdminCompetitions from "@/pages/admin/competitions";
import AdminEvents from "@/pages/admin/events";
import AdminGallery from "@/pages/admin/gallery";
import AdminStatus from "@/pages/admin/status";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/resume" component={Resume} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/certifications" component={AdminCertifications} />
      <Route path="/admin/skills" component={AdminSkills} />
      <Route path="/admin/competitions" component={AdminCompetitions} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/status" component={AdminStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
