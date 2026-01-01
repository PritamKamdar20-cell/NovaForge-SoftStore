import { Layout } from "@/components/Layout";
import { Lightbulb, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  user_id: string;
  software_name: string;
  description: string | null;
  platform: string | null;
  upvotes: number;
  created_at: string;
}

const Requests = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [softwareName, setSoftwareName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    if (!user || !softwareName.trim()) return;

    setIsPosting(true);
    const { error } = await supabase.from("requests").insert({
      user_id: user.id,
      software_name: softwareName.trim(),
      description: description.trim() || null,
      platform: platform.trim() || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submitted",
        description: "Your request has been submitted",
      });
      setSoftwareName("");
      setDescription("");
      setPlatform("");
      fetchRequests();
    }
    setIsPosting(false);
  };

  const canDelete = (request: Request) => {
    if (!user) return false;
    return request.user_id === user.id || role === "admin" || role === "owner";
  };

  const handleDeleteClick = (request: Request) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete) return;

    setIsDeleting(true);
    const { error } = await supabase.from("requests").delete().eq("id", requestToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Request has been deleted",
      });
      fetchRequests();
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDisplayName = (request: Request) => {
    return "User";
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Software <span className="gradient-text">Requests</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Can't find what you're looking for? Request software and let the community help!
            </p>
          </div>

          {/* Submit Request */}
          <div className="glass-card p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Submit a Request
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="software-name">Software Name</Label>
                <Input
                  id="software-name"
                  placeholder={user ? "What software are you looking for?" : "Sign in to submit a request"}
                  className="bg-muted/50"
                  value={softwareName}
                  onChange={(e) => setSoftwareName(e.target.value)}
                  disabled={!user}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the software and why you need it..."
                  className="bg-muted/50 min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!user}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Preferred Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g., Windows, Android, Web"
                  className="bg-muted/50"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  disabled={!user}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  className="btn-nova text-primary-foreground border-0"
                  onClick={handleSubmit}
                  disabled={!user || !softwareName.trim() || isPosting}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Request
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <Lightbulb className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to request software! Sign in to submit a request.
                </p>
              </div>
            ) : (
              requests.map((request, index) => (
                <div
                  key={request.id}
                  className="glass-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{request.software_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {getDisplayName(request)} • {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {request.platform && (
                        <Badge variant="secondary">{request.platform}</Badge>
                      )}
                      {canDelete(request) && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteClick(request)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {request.description && (
                    <p className="text-muted-foreground text-sm">{request.description}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20">
            <h4 className="font-semibold mb-2">Request Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Provide clear descriptions of what you're looking for</li>
              <li>• Requests can be edited or deleted by the author, admins, and owner</li>
              <li>• Upvote requests you want to see fulfilled</li>
              <li>• Fake or spam requests will be removed</li>
            </ul>
          </div>
        </div>
      </section>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Request"
        description={`Are you sure you want to delete the request for "${requestToDelete?.software_name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Requests;
