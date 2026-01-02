import { Download, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const platformColors: Record<string, string> = {
  Windows: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mac: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Linux: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Android: "bg-green-500/20 text-green-400 border-green-500/30",
  iOS: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Web: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Mobile: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Android TV": "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

const featuredSoftware: any[] = [];

export function FeaturedSoftware() {
  const navigate = useNavigate();

  if (featuredSoftware.length === 0) {
    return (
      <section className="py-20 relative">
        <div className="container px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Featured Collection
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Popular <span className="gradient-text">Software</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of top-rated software trusted by developers and users worldwide.
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16 glass-card max-w-md mx-auto">
            <Download className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Software Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to upload software to NovaForge SoftStore!
            </p>
            <Button 
              className="btn-nova text-primary-foreground border-0"
              onClick={() => navigate("/upload")}
            >
              <span className="relative z-10">Upload Software</span>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="container px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Featured Collection
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Popular <span className="gradient-text">Software</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of top-rated software trusted by developers and users worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSoftware.map((software, index) => (
            <div
              key={software.id}
              className="software-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={software.image}
                  alt={software.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className={software.price === "Free" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-secondary/20 text-secondary border-secondary/30"}>
                    {software.price}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{software.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{software.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {software.platforms.map((platform: string) => (
                    <span key={platform} className={`text-xs px-2 py-0.5 rounded border ${platformColors[platform]}`}>
                      {platform}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {software.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {software.downloads}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-primary hover:text-primary hover:bg-primary/10">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
