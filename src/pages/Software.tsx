import { Layout } from "@/components/Layout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { useSiteStats } from "@/hooks/useSiteStats";
import { Monitor, Apple, Laptop, Smartphone, Tablet, Globe, Phone, Download, Trash2, Package, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const platformIcons: Record<string, React.ElementType> = {
  windows: Monitor,
  mac: Apple,
  linux: Laptop,
  android: Smartphone,
  ios: Tablet,
  web: Globe,
  keypad: Phone,
};

const platformNames: Record<string, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
  keypad: "Keypad Mobile",
};

interface Software {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  version: string | null;
  platforms: string[];
  download_link: string | null;
  is_paid: boolean;
  price: number | null;
  created_at: string;
}

const Software = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const platform = searchParams.get("platform");
  const { user, role } = useAuth();
  const { toast } = useToast();
  const { stats: siteStats, refetch: refetchSiteStats } = useSiteStats();
  
  const [software, setSoftware] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSoftware = async () => {
    setLoading(true);
    let query = supabase.from("software").select("*").order("created_at", { ascending: false });
    
    if (platform) {
      query = query.contains("platforms", [platform]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching software:", error);
    } else {
      setSoftware(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSoftware();
  }, [platform]);

  // Filter software based on search query
  const filteredSoftware = useMemo(() => {
    if (!searchQuery.trim()) return software;
    const query = searchQuery.toLowerCase();
    return software.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.version?.toLowerCase().includes(query)
    );
  }, [software, searchQuery]);

  const canDelete = (softwareItem: Software) => {
    if (!user) return false;
    return softwareItem.user_id === user.id || role === "admin" || role === "owner";
  };

  const handleDeleteClick = (softwareItem: Software) => {
    setSoftwareToDelete(softwareItem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!softwareToDelete) return;
    
    setIsDeleting(true);
    const { error } = await supabase.from("software").delete().eq("id", softwareToDelete.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete software",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Software has been deleted successfully",
      });
      fetchSoftware();
    }
    
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSoftwareToDelete(null);
  };

  const PlatformIcon = platform ? platformIcons[platform] : Package;

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <PlatformIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {platform ? (
                <>
                  <span className="gradient-text">{platformNames[platform]}</span> Software
                </>
              ) : (
                <>
                  All <span className="gradient-text">Software</span>
                </>
              )}
            </h1>
            <p className="text-lg text-muted-foreground">
              {platform 
                ? `Browse all software available for ${platformNames[platform]}`
                : "Browse all software across all platforms"
              }
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Totals: {siteStats?.total_software ?? 0} software • {siteStats?.total_users ?? 0} users • {siteStats?.total_downloads ?? 0} downloads
            </p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {platform && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/software")}
                >
                  View All Platforms
                </Button>
              )}
              <Button asChild className="btn-nova text-primary-foreground border-0">
                <Link to="/upload-software">
                  <span className="relative z-10 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Software
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search software by name, description..."
                className="pl-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Software Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredSoftware.length === 0 ? (
            <div className="text-center py-16 glass-card max-w-md mx-auto">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No Results Found" : "No Software Yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No software matches "${searchQuery}"`
                  : `Be the first to upload software${platform ? ` for ${platformNames[platform]}` : ""}!`
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate("/upload-software")} className="btn-nova text-primary-foreground border-0">
                  <span className="relative z-10">Upload Software</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredSoftware.map((item, index) => (
                <div
                  key={item.id}
                  className="software-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    {item.is_paid ? (
                      <Badge className="bg-primary/80 text-primary-foreground">₹{item.price}</Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </div>
                  
                  {item.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {item.version && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Version: {item.version}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.platforms.map((p) => {
                      const Icon = platformIcons[p] || Package;
                      return (
                        <Badge key={p} variant="outline" className="text-xs">
                          <Icon className="w-3 h-3 mr-1" />
                          {platformNames[p] || p}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-2">
                    {item.download_link && (
                      <Button 
                        size="sm" 
                        className="flex-1 btn-nova text-primary-foreground border-0"
                        onClick={() => {
                          // Open first (avoids popup blockers), then increment stats
                          window.open(item.download_link!, "_blank");
                          supabase.rpc("increment_download_count").then(() => refetchSiteStats());
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Download
                        </span>
                      </Button>
                    )}
                    {canDelete(item) && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Software"
        description={`Are you sure you want to delete "${softwareToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default Software;
