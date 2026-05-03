import { useState } from "react";
import { useGetCompetitions, useCreateCompetition, useUpdateCompetition, useDeleteCompetition, getGetCompetitionsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type CompType = "competition" | "workshop" | "hackathon" | "seminar";
type Form = { title: string; organizer: string; type: CompType; date: string; result: string };
const emptyForm: Form = { title: "", organizer: "", type: "competition", date: "", result: "" };

const TYPES: { value: CompType; label: string }[] = [
  { value: "competition", label: "Competition" },
  { value: "workshop", label: "Workshop" },
  { value: "hackathon", label: "Hackathon" },
  { value: "seminar", label: "Seminar" },
];

export default function AdminCompetitions() {
  const { data: competitions = [], isLoading } = useGetCompetitions();
  const createCompetition = useCreateCompetition();
  const updateCompetition = useUpdateCompetition();
  const deleteCompetition = useDeleteCompetition();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetCompetitionsQueryKey() });
  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: typeof competitions[0]) => {
    setEditId(c.id);
    setForm({ title: c.title, organizer: c.organizer, type: c.type as CompType, date: c.date, result: c.result || "" });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = { title: form.title, organizer: form.organizer, type: form.type, date: form.date, result: form.result || null };
    if (editId !== null) {
      await updateCompetition.mutateAsync({ id: editId, data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Competition updated" }); } });
    } else {
      await createCompetition.mutateAsync({ data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Competition added" }); } });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCompetition.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Deleted", variant: "destructive" }); } });
  };

  const isPending = createCompetition.isPending || updateCompetition.isPending;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Competitions & Workshops</h1>
            <p className="text-muted-foreground mt-1">{competitions.length} total</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Entry</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No competitions or workshops yet.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add first entry</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {competitions.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                <Badge variant="outline" className="text-xs capitalize shrink-0">{c.type}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.organizer}</p>
                  {c.result && <p className="text-xs text-primary mt-0.5">{c.result}</p>}
                </div>
                <p className="text-sm text-muted-foreground shrink-0">{c.date}</p>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId !== null ? "Edit Entry" : "New Entry"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Smart India Hackathon 2024" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Organizer</label><Input value={form.organizer} onChange={e => setForm(f => ({ ...f, organizer: e.target.value }))} placeholder="e.g. Government of India" /></div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Type</label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as CompType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><label className="text-sm font-medium">Date</label><Input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. 2024-09-15" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Result <span className="text-muted-foreground text-xs">(optional)</span></label><Input value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="e.g. Finalist, 2nd Place" /></div>
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
