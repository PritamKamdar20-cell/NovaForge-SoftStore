import { Download, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const platformColors: Record<string, string> = {
  Windows: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mac: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Linux: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Android: "bg-green-500/20 text-green-400 border-green-500/30",
  iOS: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Web: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Mobile: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const featuredSoftware = [
  {
    id: 1,
    name: "CodeMaster Pro",
    description: "Advanced code editor with AI assistance and multi-language support.",
    platforms: ["Windows", "Mac", "Linux"],
    downloads: 0,
    rating: 4.8,
    price: "Free",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    name: "PixelForge Studio",
    description: "Professional image editing with layer support and filters.",
    platforms: ["Windows", "Mac", "Web"],
    downloads: 0,
    rating: 4.6,
    price: "₹499",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    name: "SyncCloud",
    description: "Seamless file synchronization across all your devices.",
    platforms: ["Windows", "Mac", "Android", "iOS"],
    downloads: 0,
    rating: 4.9,
    price: "Free",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    name: "GameVault",
    description: "Ultimate game library manager with cloud saves.",
    platforms: ["Windows", "Linux", "Web"],
    downloads: 0,
    rating: 4.7,
    price: "₹299",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
  },
];

export function FeaturedSoftware() {
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

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSoftware.map((software, index) => (
            <div
              key={software.id}
              className="software-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={software.image}
                  alt={software.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className={software.price === "Free" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-secondary/20 text-secondary border-secondary/30"}>
                    {software.price}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {software.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {software.description}
                </p>

                {/* Platforms */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {software.platforms.map((platform) => (
                    <span
                      key={platform}
                      className={`text-xs px-2 py-0.5 rounded border ${platformColors[platform]}`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                {/* Stats & Action */}
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

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-border/50 hover:bg-muted/50">
            View All Software
          </Button>
        </div>
      </div>
    </section>
  );
}
