import { Layout } from "@/components/Layout";
import { MessageCircle, ThumbsUp, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Comments = () => {
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
              placeholder="Share your thoughts..."
              className="bg-muted/50 min-h-[100px] mb-4"
            />
            <div className="flex justify-end">
              <Button className="btn-nova text-primary-foreground border-0">
                <span className="relative z-10">Post Comment</span>
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {/* Empty State */}
            <div className="text-center py-16 glass-card">
              <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Comments Yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts! Sign in to leave a comment.
              </p>
            </div>
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
    </Layout>
  );
};

export default Comments;
