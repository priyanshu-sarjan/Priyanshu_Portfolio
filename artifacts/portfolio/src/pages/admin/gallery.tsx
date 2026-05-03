import { useState } from "react";
import { useGetGallery, useCreateGalleryImage, useDeleteGalleryImage, getGetGalleryQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Image } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type Form = { url: string; caption: string; eventName: string };
const emptyForm: Form = { url: "", caption: "", eventName: "" };

export default function AdminGallery() {
  const { data: gallery = [], isLoading } = useGetGallery();
  const createGalleryImage = useCreateGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });

  const handleSubmit = async () => {
    await createGalleryImage.mutateAsync({ data: { url: form.url, caption: form.caption || null, eventName: form.eventName || null } }, {
      onSuccess: () => { refresh(); setOpen(false); setForm(emptyForm); toast({ title: "Image added" }); }
    });
  };

  const handleDelete = async (id: number) => {
    await deleteGalleryImage.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Image removed", variant: "destructive" }); } });
  };

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gallery</h1>
            <p className="text-muted-foreground mt-1">{gallery.length} images</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Image</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No images yet.</p>
            <Button variant="outline" onClick={() => setOpen(true)} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add first image</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map(img => (
              <div key={img.id} className="group relative rounded-lg border border-border overflow-hidden aspect-square">
                <img src={img.url} alt={img.caption || "Gallery"} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <Button size="icon" variant="destructive" className="self-end w-7 h-7" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div>
                    {img.eventName && <p className="text-xs font-semibold text-primary">{img.eventName}</p>}
                    {img.caption && <p className="text-xs text-foreground">{img.caption}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Gallery Image</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Image URL</label>
                <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
              </div>
              {form.url && (
                <div className="rounded-lg border border-border overflow-hidden aspect-video">
                  <img src={form.url} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              <div className="space-y-1"><label className="text-sm font-medium">Caption <span className="text-muted-foreground text-xs">(optional)</span></label><Input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Short caption..." /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Event Name <span className="text-muted-foreground text-xs">(optional)</span></label><Input value={form.eventName} onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))} placeholder="e.g. IEEE Tech Summit" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={createGalleryImage.isPending || !form.url.trim()} className="gap-2">
                {createGalleryImage.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Add Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
