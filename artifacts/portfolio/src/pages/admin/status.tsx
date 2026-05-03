import { useState, useEffect } from "react";
import { useGetStatus, useUpdateStatus } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Radio, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetStatusQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminStatus() {
  const { data: status, isLoading } = useGetStatus();
  const updateStatus = useUpdateStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [text, setText] = useState("");

  useEffect(() => {
    if (status?.text) setText(status.text);
  }, [status?.text]);

  const handleSave = async () => {
    await updateStatus.mutateAsync({ data: { text } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStatusQueryKey() });
        toast({ title: "Status updated", description: "Your current status has been updated." });
      },
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Radio className="w-7 h-7 text-primary" /> Status
          </h1>
          <p className="text-muted-foreground mt-1">Update what you're currently working on — shown on your public portfolio hero.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm">
              <p className="text-xs text-muted-foreground mb-1">Current status</p>
              <p className="font-medium">{status?.text}</p>
              {status?.updatedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(status.updatedAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New status</label>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="e.g. Building AyuTraceChain — a blockchain traceability system"
                rows={3}
                className="resize-none"
              />
            </div>

            <Button onClick={handleSave} disabled={updateStatus.isPending || !text.trim()} className="gap-2">
              {updateStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Status
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
