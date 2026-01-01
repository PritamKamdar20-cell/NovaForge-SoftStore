import { Layout } from "@/components/Layout";
import { MessageCircle, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const Comments = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePost = async () => {
    if (!user || !newComment.trim()) return;

    setIsPosting(true);
    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Posted",
        description: "Your comment has been posted",
      });
      setNewComment("");
      fetchComments();
    }
    setIsPosting(false);
  };

  const canDelete = (comment: Comment) => {
    if (!user) return false;
    return comment.user_id === user.id || role === "admin" || role === "owner";
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    const { error } = await supabase.from("comments").delete().eq("id", commentToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Comment has been deleted",
      });
      fetchComments();
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (comment: Comment) => {
    return "U";
  };

  const getDisplayName = (comment: Comment) => {
    return "User";
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Community <span className="gradient-text">Comments</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your thoughts, feedback, and experiences with the community.
            </p>
          </div>

          {/* Post Comment */}
          <div className="glass-card p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Leave a Comment
            </h3>
            <Textarea
              placeholder={user ? "Share your thoughts..." : "Sign in to leave a comment"}
              className="bg-muted/50 min-h-[100px] mb-4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
            />
            <div className="flex justify-end">
              <Button 
                className="btn-nova text-primary-foreground border-0"
                onClick={handlePost}
                disabled={!user || !newComment.trim() || isPosting}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isPosting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Post Comment
                </span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Comments Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share your thoughts! Sign in to leave a comment.
                </p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="glass-card p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(comment)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{getDisplayName(comment)}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        {canDelete(comment) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteClick(comment)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h4 className="font-semibold mb-2">Comment Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and constructive</li>
              <li>• Comments can be edited or deleted by the author, admins, and owner</li>
              <li>• Fake or spam comments will be removed</li>
            </ul>
          </div>
        </div>
      </section>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Comments;
