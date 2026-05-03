import { useState } from "react";
import { useGetSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, getGetSkillsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type Category = "language" | "web" | "web3" | "dsa" | "other";
type Form = { name: string; category: Category; proficiency: number };
const emptyForm: Form = { name: "", category: "language", proficiency: 75 };

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "language", label: "Languages" },
  { value: "web", label: "Web Dev" },
  { value: "web3", label: "Web3 & Blockchain" },
  { value: "dsa", label: "DSA" },
  { value: "other", label: "Other Tools" },
];

const CATEGORY_COLORS: Record<Category, string> = {
  language: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  web: "bg-green-500/10 text-green-400 border-green-500/20",
  web3: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  dsa: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  other: "bg-muted text-muted-foreground",
};

export default function AdminSkills() {
  const { data: skills = [], isLoading } = useGetSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetSkillsQueryKey() });
  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s: typeof skills[0]) => {
    setEditId(s.id);
    setForm({ name: s.name, category: s.category as Category, proficiency: s.proficiency });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = { name: form.name, category: form.category, proficiency: form.proficiency };
    if (editId !== null) {
      await updateSkill.mutateAsync({ id: editId, data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Skill updated" }); } });
    } else {
      await createSkill.mutateAsync({ data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Skill added" }); } });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteSkill.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Skill deleted", variant: "destructive" }); } });
  };

  const isPending = createSkill.isPending || updateSkill.isPending;
  const grouped = CATEGORIES.map(cat => ({ ...cat, skills: skills.filter(s => s.category === cat.value) })).filter(g => g.skills.length > 0);

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-muted-foreground mt-1">{skills.length} total</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Skill</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No skills yet.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add your first skill</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(group => (
              <div key={group.value} className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</h2>
                <div className="space-y-2">
                  {group.skills.map(s => (
                    <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                      <Badge variant="outline" className={`text-xs shrink-0 ${CATEGORY_COLORS[s.category as Category]}`}>{group.label}</Badge>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted-foreground">{s.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${s.proficiency}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId !== null ? "Edit Skill" : "New Skill"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React.js" /></div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as Category }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Proficiency</label>
                  <span className="text-sm text-muted-foreground">{form.proficiency}%</span>
                </div>
                <input type="range" min={10} max={100} step={5} value={form.proficiency}
                  onChange={e => setForm(f => ({ ...f, proficiency: Number(e.target.value) }))}
                  className="w-full accent-primary" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isPending || !form.name.trim()} className="gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
