import { useState } from "react";
import { useGetEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, getGetEventsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type EventType = "meetup" | "deadline" | "task" | "workshop" | "other";
type Form = { title: string; description: string; date: string; type: EventType; completed: boolean; imageUrl: string; videoUrl: string };
const emptyForm: Form = { title: "", description: "", date: "", type: "task", completed: false, imageUrl: "", videoUrl: "" };

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "meetup", label: "Meetup" },
  { value: "deadline", label: "Deadline" },
  { value: "task", label: "Task" },
  { value: "workshop", label: "Workshop" },
  { value: "other", label: "Other" },
];

function formatVideoUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  return url;
}

export default function AdminEvents() {
  const { data: events = [], isLoading } = useGetEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getGetEventsQueryKey() });
  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (e: typeof events[0]) => {
    setEditId(e.id);
    setForm({
      title: e.title,
      description: e.description || "",
      date: e.date,
      type: e.type as EventType,
      completed: e.completed,
      imageUrl: e.imageUrl || "",
      videoUrl: e.videoUrl || "",
    });
    setOpen(true);
  };

  const toggleComplete = async (e: typeof events[0]) => {
    await updateEvent.mutateAsync({
      id: e.id,
      data: {
        title: e.title,
        description: e.description || null,
        date: e.date,
        type: e.type as EventType,
        completed: !e.completed,
        imageUrl: e.imageUrl || null,
        videoUrl: e.videoUrl || null,
      }
    }, { onSuccess: refresh });
  };

  const handleSubmit = async () => {
    const formattedVideo = formatVideoUrl(form.videoUrl);
    const data = {
      title: form.title,
      description: form.description || null,
      date: form.date,
      type: form.type,
      completed: form.completed,
      imageUrl: form.imageUrl || null,
      videoUrl: formattedVideo || null,
    };
    if (editId !== null) {
      await updateEvent.mutateAsync({ id: editId, data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Event updated" }); } });
    } else {
      await createEvent.mutateAsync({ data }, { onSuccess: () => { refresh(); setOpen(false); toast({ title: "Event added" }); } });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteEvent.mutateAsync({ id }, { onSuccess: () => { refresh(); toast({ title: "Event deleted", variant: "destructive" }); } });
  };

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events, Media & Videos</h1>
            <p className="text-muted-foreground mt-1">{events.filter(e => !e.completed).length} upcoming, {events.filter(e => e.completed).length} completed</p>
          </div>
          <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Event</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No events yet.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2"><Plus className="w-4 h-4" /> Add first event</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(e => (
              <div key={e.id} className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${e.completed ? "border-border/50 bg-card/50 opacity-60" : "border-border bg-card hover:border-primary/30"}`}>
                <button onClick={() => toggleComplete(e)} className="mt-0.5 shrink-0">
                  {e.completed ? <CheckCircle2 className="w-5 h-5 text-muted-foreground" /> : <Circle className="w-5 h-5 text-primary" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${e.completed ? "line-through text-muted-foreground" : ""}`}>{e.title}</p>
                  {e.description && <p className="text-sm text-muted-foreground mt-0.5">{e.description}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs capitalize">{e.type}</Badge>
                    <span className="text-xs text-muted-foreground">{e.date}</span>
                    {e.imageUrl && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Photo Attached</span>}
                    {e.videoUrl && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Video Embedded</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId !== null ? "Edit Event" : "New Event"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. IEEE Tech Summit & Keynote" /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Description <span className="text-muted-foreground text-xs">(optional)</span></label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as EventType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium">Date</label><Input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="March 2026" /></div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Event Photo Banner URL</label>
                <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/events/hackathon-2026.jpg or https://cdn.cloudinary.com/..." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Event Video URL (YouTube / Vimeo)</label>
                <Input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." />
                <p className="text-xs text-muted-foreground">Standard YouTube links will automatically be transformed to responsive iframe embeds.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={form.completed} onChange={e => setForm(f => ({ ...f, completed: e.target.checked }))} className="rounded" />
                <span className="text-sm font-medium">Mark as completed</span>
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
