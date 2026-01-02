import { Monitor, Apple, Laptop, Smartphone, Tablet, Globe, Phone, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const platforms = [
  { name: "Windows", icon: Monitor, color: "from-blue-500 to-blue-600", slug: "windows" },
  { name: "macOS", icon: Apple, color: "from-gray-400 to-gray-500", slug: "mac" },
  { name: "Linux", icon: Laptop, color: "from-orange-500 to-orange-600", slug: "linux" },
  { name: "Android", icon: Smartphone, color: "from-green-500 to-green-600", slug: "android" },
  { name: "iOS", icon: Tablet, color: "from-purple-500 to-purple-600", slug: "ios" },
  { name: "Web", icon: Globe, color: "from-cyan-500 to-cyan-600", slug: "web" },
  { name: "Keypad Mobile", icon: Phone, color: "from-pink-500 to-pink-600", slug: "keypad" },
  { name: "Android TV", icon: Tv, color: "from-teal-500 to-teal-600", slug: "androidtv" },
];

export function PlatformSection() {
  const navigate = useNavigate();
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    const fetchCounts = async () => {
      const { data, error } = await supabase.from("software").select("platforms");
      if (error) {
        console.error("Error fetching platform counts:", error);
        return;
      }
      if (!data || !mounted) return;

      const counts: Record<string, number> = {};
      platforms.forEach((p) => (counts[p.slug] = 0));
      data.forEach((software) => {
        software.platforms?.forEach((platform: string) => {
          if (counts[platform] !== undefined) counts[platform]++;
        });
      });
      setPlatformCounts(counts);
    };

    // Initial load
    fetchCounts();

    // Refresh when user returns to the tab or focuses window (common after delete)
    const onFocus = () => fetchCounts();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const handlePlatformClick = (slug: string) => {
    navigate(`/software?platform=${slug}`);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-50" />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            8 Platforms, <span className="gradient-text">One Store</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find software for every device you own. From desktop to mobile, we've got you covered.
          </p>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {platforms.map((platform, index) => (
            <div
              key={platform.name}
              onClick={() => handlePlatformClick(platform.slug)}
              className="group relative p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <platform.icon className="w-6 h-6 text-white" />
              </div>

              {/* Name */}
              <h3 className="font-medium text-center text-sm mb-1">
                {platform.name}
              </h3>

              {/* Count */}
              <p className="text-xs text-muted-foreground text-center">
                {platformCounts[platform.slug] || 0} apps
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
