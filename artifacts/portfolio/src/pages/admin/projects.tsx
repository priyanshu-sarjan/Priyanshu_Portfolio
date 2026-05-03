import { useState } from "react";
import { useGetProjects, useCreateProject, useUpdateProject, useDeleteProject, getGetProjectsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Github, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type ProjectForm = { title: string; description: string; techStack: string; githubUrl: string; liveUrl: string; imageUrl: string; featured: boolean };
const emptyForm: ProjectForm = { title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", imageUrl: "", featured: false };

export default function AdminProjects() {
  const { data: projects = [], isLoading } = useGetProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: typeof projects[0]) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description, techStack: p.techStack.join(", "), githubUrl: p.githubUrl || "", liveUrl: p.liveUrl || "", imageUrl: p.imageUrl || "", featured: p.featured });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = { title: form.title, description: form.description, techStack: form.techStack.split(",").map(s => s.trim()).filter(Boolean), githubUrl: form.githubUrl || null, liveUrl: form.liveUrl || null, imageUrl: form.imageUrl || null, featured: form.featured };
    if (editId !== null) {
      await updateProject.mutateAsync({ id: editId, data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Project updated" }); } });
    } else {
      await createProject.mutateAsync({ data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Project created" }); } });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteProject.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Project deleted", variant: "destructive" }); } });
  };

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">{projects.length} total</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No projects yet.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add your first project</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.techStack.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                  <div className="flex gap-3 mt-2">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Live</a>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editId !== null ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Project description" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tech Stack <span className="text-muted-foreground text-xs">(comma separated)</span></label>
                <Input value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Live URL</label>
                  <Input value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Image URL</label>
                <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
                <span className="text-sm font-medium">Featured project</span>
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isPending || !form.title.trim()} className="gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
