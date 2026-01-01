import { Layout } from "@/components/Layout";
import { Calendar, User, Trash2, Newspaper, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
  id: string;
  user_id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  created_at: string;
}

const CATEGORIES = ["Announcement", "Feature", "Guide", "Update", "Event"];

const News = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create news form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Announcement",
    image_url: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching news:", error);
    } else {
      setNewsItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const canManageNews = () => {
    return role === "admin" || role === "owner";
  };

  const handleDeleteClick = (news: NewsItem) => {
    setNewsToDelete(news);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!newsToDelete) return;

    setIsDeleting(true);
    const { error } = await supabase.from("news").delete().eq("id", newsToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete news",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "News has been deleted successfully",
      });
      fetchNews();
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("news").insert({
      user_id: user.id,
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim() || null,
      content: formData.content.trim() || null,
      category: formData.category,
      image_url: formData.image_url.trim() || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create news",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "News created successfully",
      });
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Announcement",
        image_url: "",
      });
      setShowCreateForm(false);
      fetchNews();
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Latest <span className="gradient-text">News</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with announcements, features, and guides from NovaForge SoftStore.
            </p>
          </div>

          {/* Create News Button for Admin/Owner */}
          {canManageNews() && (
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="gap-2"
              >
                {showCreateForm ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create News
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Create News Form */}
          {showCreateForm && canManageNews() && (
            <form
              onSubmit={handleCreateNews}
              className="glass-card p-6 max-w-2xl mx-auto mb-12 space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">Create News Article</h2>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter news title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of the news"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Full news content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Publishing..." : "Publish News"}
              </Button>
            </form>
          )}

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-16 glass-card max-w-md mx-auto">
              <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No News Yet</h3>
              <p className="text-muted-foreground">
                Check back later for updates from the NovaForge team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsItems.map((news, index) => (
                <article
                  key={news.id}
                  className="software-card overflow-hidden animate-fade-in cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {news.image_url ? (
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary/80 text-primary-foreground">
                      {news.category}
                    </Badge>
                    {canManageNews() && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(news);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h2>
                    {news.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        NovaForge Team
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(news.created_at)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete News"
        description={`Are you sure you want to delete "${newsToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default News;
