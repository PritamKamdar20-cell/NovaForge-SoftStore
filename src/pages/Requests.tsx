import { Layout } from "@/components/Layout";
import { Lightbulb, ArrowUp, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Requests = () => {
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
                  placeholder="What software are you looking for?"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the software and why you need it..."
                  className="bg-muted/50 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Preferred Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g., Windows, Android, Web"
                  className="bg-muted/50"
                />
              </div>
              <div className="flex justify-end">
                <Button className="btn-nova text-primary-foreground border-0">
                  <span className="relative z-10">Submit Request</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {/* Empty State */}
            <div className="text-center py-16 glass-card">
              <Lightbulb className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground">
                Be the first to request software! Sign in to submit a request.
              </p>
            </div>
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
    </Layout>
  );
};

export default Requests;
