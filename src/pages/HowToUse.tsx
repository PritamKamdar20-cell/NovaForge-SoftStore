import { Layout } from "@/components/Layout";
import { Download, Upload, MessageSquare, CreditCard, Shield, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Software",
    description: "Explore our collection across 7 platforms. Use filters to find exactly what you need.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Download,
    title: "Download & Install",
    description: "Click download to get your software. For web apps, play directly in your browser.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Upload,
    title: "Upload Your Software",
    description: "Share your creations! Upload website files for web apps, or share cloud links for other platforms.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CreditCard,
    title: "Set Your Price",
    description: "Authors can set prices using Razorpay. One-time setup to start earning from your software.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "Engage with Community",
    description: "Leave comments, request software, and connect with other developers and users.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All content is moderated by admins and the owner. Report any issues to our helpers.",
    color: "from-teal-500 to-cyan-500",
  },
];

const HowToUse = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              How to <span className="gradient-text">Use</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get started with NovaForge SoftStore in just a few simple steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Info */}
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Supported Platforms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Windows", emoji: "🖥️" },
                { name: "macOS", emoji: "🍎" },
                { name: "Linux", emoji: "🐧" },
                { name: "Android", emoji: "🤖" },
                { name: "iOS", emoji: "📱" },
                { name: "Web", emoji: "🌐" },
                { name: "Keypad Mobile", emoji: "📞" },
              ].map((platform) => (
                <div key={platform.name} className="text-center p-4 rounded-xl bg-muted/30">
                  <span className="text-2xl mb-2 block">{platform.emoji}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2">For Web Platform</h4>
              <p className="text-sm text-muted-foreground">
                Upload your website files directly. Users can play your web apps online without downloading.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
              <h4 className="font-semibold mb-2">For Other Platforms</h4>
              <p className="text-sm text-muted-foreground">
                Provide a cloud share link (Google Drive, Dropbox, etc.) for users to download your software.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HowToUse;
