import { ArrowRight, Download, Sparkles, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteStats } from "@/hooks/useSiteStats";

export function HeroSection() {
  const { stats } = useSiteStats();

  const tiles = [
    { icon: Users, label: "Users", value: stats?.total_users ?? 0, suffix: "+" },
    { icon: Package, label: "Software", value: stats?.total_software ?? 0, suffix: "" },
    { icon: Download, label: "Downloads", value: stats?.total_downloads ?? 0, suffix: "+" },
  ];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 hero-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Created by NovaForge Studeeo • December 2025</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Discover Amazing
            <span className="block gradient-text">Software Solutions</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your ultimate destination for quality software across all platforms. 
            Windows, Mac, Linux, Android, iOS, and more — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="btn-nova text-primary-foreground border-0 px-8 h-12 text-base" asChild>
              <Link to="/how-to-use">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Software
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border/50 hover:bg-muted/50" asChild>
              <Link to="/upload-software">Upload Your Software</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {tiles.map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Icons */}
        <div className="flex items-center justify-center gap-6 mt-16 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <span className="text-sm text-muted-foreground">Available for:</span>
          <div className="flex items-center gap-3">
            {["Windows", "Mac", "Linux", "Android", "iOS","keypad", "Web", "Android TV"].map((platform) => (
              <span key={platform} className="platform-badge">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
