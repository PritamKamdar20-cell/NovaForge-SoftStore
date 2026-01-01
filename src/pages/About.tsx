import { Layout } from "@/components/Layout";
import { Users, Shield, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Built by Students",
    description: "Created by passionate students from India in December 2025, bringing fresh ideas to software distribution.",
  },
  {
    icon: Shield,
    title: "Trusted & Secure",
    description: "All software is verified by our team of admins and helpers to ensure quality and safety.",
  },
  {
    icon: Zap,
    title: "7 Platforms",
    description: "Supporting Windows, Mac, Linux, Android, iOS, Web, and Keypad Mobile for maximum accessibility.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Request features, leave comments, and help shape the future of NovaForge SoftStore.",
  },
];

const About = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About <span className="gradient-text">NovaForge</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              NovaForge SoftStore is a software marketplace created by NovaForge Studeeo — 
              a team of dedicated students from India passionate about making quality software accessible to everyone.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Team Roles */}
          <div className="glass-card p-8 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Our Team Structure</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-2 flex items-center justify-center text-lg">
                  👑
                </div>
                <h4 className="font-semibold">Owner</h4>
                <p className="text-xs text-muted-foreground mt-1">Full control & management</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-2 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <h4 className="font-semibold">Admin</h4>
                <p className="text-xs text-muted-foreground mt-1">Resolve issues & moderate</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-2 flex items-center justify-center text-lg">
                  🛠️
                </div>
                <h4 className="font-semibold">Helper</h4>
                <p className="text-xs text-muted-foreground mt-1">Report & assist users</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
