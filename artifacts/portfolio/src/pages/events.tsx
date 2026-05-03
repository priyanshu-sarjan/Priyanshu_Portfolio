import { useGetEvents } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CheckCircle2, Circle } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  meetup: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  deadline: "bg-red-500/10 text-red-400 border-red-500/20",
  task: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  workshop: "bg-green-500/10 text-green-400 border-green-500/20",
  other: "bg-muted text-muted-foreground border-border",
};

export default function Events() {
  const { data: events = [], isLoading } = useGetEvents();

  const upcoming = events.filter(e => !e.completed);
  const completed = events.filter(e => e.completed);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Timeline
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Upcoming Events</h1>
          <p className="text-muted-foreground text-lg">Meetups, workshops, deadlines, and tasks on my radar.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {/* Upcoming */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Circle className="w-4 h-4 text-primary" /> Upcoming ({upcoming.length})
              </h2>
              {upcoming.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">No upcoming events.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6 pl-12">
                    {upcoming.map(event => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-9 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                        <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{event.title}</h3>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                              )}
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1">
                              <Badge variant="outline" className={`text-xs capitalize ${TYPE_COLORS[event.type]}`}>{event.type}</Badge>
                              <span className="text-xs text-muted-foreground">{event.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Completed */}
            {completed.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed ({completed.length})
                </h2>
                <div className="space-y-3">
                  {completed.map(event => (
                    <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-card/50 opacity-60">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-through text-muted-foreground">{event.title}</p>
                        {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                      </div>
                      <div className="shrink-0">
                        <Badge variant="outline" className="text-xs capitalize opacity-50">{event.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{event.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
