import { Monitor, Apple, Laptop, Smartphone, Tablet, Globe, Phone } from "lucide-react";

const platforms = [
  { name: "Windows", icon: Monitor, color: "from-blue-500 to-blue-600", count: 0 },
  { name: "macOS", icon: Apple, color: "from-gray-400 to-gray-500", count: 0 },
  { name: "Linux", icon: Laptop, color: "from-orange-500 to-orange-600", count: 0 },
  { name: "Android", icon: Smartphone, color: "from-green-500 to-green-600", count: 0 },
  { name: "iOS", icon: Tablet, color: "from-purple-500 to-purple-600", count: 0 },
  { name: "Web", icon: Globe, color: "from-cyan-500 to-cyan-600", count: 0 },
  { name: "Keypad Mobile", icon: Phone, color: "from-pink-500 to-pink-600", count: 0 },
];

export function PlatformSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient opacity-50" />
      
      <div className="container relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            7 Platforms, <span className="gradient-text">One Store</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find software for every device you own. From desktop to mobile, we've got you covered.
          </p>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {platforms.map((platform, index) => (
            <div
              key={platform.name}
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
                {platform.count} apps
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
