import { useState } from "react";
import { useGetCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification, getGetCertificationsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type Form = { title: string; issuer: string; issueDate: string; credentialUrl: string };
const emptyForm: Form = { title: "", issuer: "", issueDate: "", credentialUrl: "" };

export default function AdminCertifications() {
  const { data: certs = [], isLoading } = useGetCertifications();
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification();
  const deleteCertification = useDeleteCertification();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetCertificationsQueryKey() });
  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: typeof certs[0]) => {
    setEditId(c.id);
    setForm({ title: c.title, issuer: c.issuer, issueDate: c.issueDate, credentialUrl: c.credentialUrl || "" });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = { title: form.title, issuer: form.issuer, issueDate: form.issueDate, credentialUrl: form.credentialUrl || null };
    if (editId !== null) {
      await updateCertification.mutateAsync({ id: editId, data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Certification updated" }); } });
    } else {
      await createCertification.mutateAsync({ data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Certification added" }); } });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCertification.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Certification deleted", variant: "destructive" }); } });
  };

  const isPending = createCertification.isPending || updateCertification.isPending;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p className="text-muted-foreground mt-1">{certs.length} total</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Certification</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : certs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No certifications yet.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add your first certification</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {certs.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                <Award className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.issuer} — {c.issueDate}</p>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> View Credential
                    </a>
                  )}
                </div>
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
            <DialogHeader><DialogTitle>{editId !== null ? "Edit Certification" : "New Certification"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Cloud Computing" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Issuer</label><Input value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} placeholder="e.g. NPTEL" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Issue Date</label><Input value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} placeholder="e.g. April 2024" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Credential URL</label><Input value={form.credentialUrl} onChange={e => setForm(f => ({ ...f, credentialUrl: e.target.value }))} placeholder="https://..." /></div>
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
