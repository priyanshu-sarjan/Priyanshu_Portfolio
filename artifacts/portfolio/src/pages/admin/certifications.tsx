import { useState } from "react";
import { useGetCertifications, useCreateCertification, useUpdateCertification, useDeleteCertification, getGetCertificationsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type Form = { title: string; issuer: string; issueDate: string; credentialUrl: string; imageUrl: string };
const emptyForm: Form = { title: "", issuer: "", issueDate: "", credentialUrl: "", imageUrl: "" };

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
    setForm({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl || "",
      imageUrl: c.imageUrl || "",
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      title: form.title,
      issuer: form.issuer,
      issueDate: form.issueDate,
      credentialUrl: form.credentialUrl || null,
      imageUrl: form.imageUrl || null,
    };
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
            <h1 className="text-3xl font-bold">Certifications & Credentials</h1>
            <p className="text-muted-foreground mt-1">{certs.length} total certificates listed</p>
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
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.title} className="w-12 h-12 object-contain rounded border border-border shrink-0 bg-muted/30" />
                ) : (
                  <Award className="w-6 h-6 text-primary shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.issuer} — {c.issueDate}</p>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" /> View Verification Credential
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
              <div className="space-y-1"><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. AWS Certified Solutions Architect" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Issuer</label><Input value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} placeholder="e.g. Amazon Web Services / Coursera" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Issue Date</label><Input value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} placeholder="e.g. 2025" /></div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Certificate Image / Badge URL</label>
                <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/certificates/aws-cert.png or https://cdn.cloudinary.com/..." />
                <p className="text-xs text-muted-foreground">Use local path starting with `/certificates/...` or Cloudinary/Supabase CDN URL.</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Credential Verification URL</label>
                <Input value={form.credentialUrl} onChange={e => setForm(f => ({ ...f, credentialUrl: e.target.value }))} placeholder="https://verify.example.com/cert/123" />
                <p className="text-xs text-muted-foreground">Public verification link (AWS, Coursera, HackerRank, etc.).</p>
              </div>
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
