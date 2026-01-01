import { Layout } from "@/components/Layout";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions, suggestions, or need help? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <p className="text-muted-foreground mb-2">Reach out for any inquiries</p>
                    <a
                      href="mailto:pritamkamdar3.0@outlook.com"
                      className="text-primary hover:underline"
                    >
                      pritamkamdar3.0@outlook.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Community</h3>
                    <p className="text-muted-foreground mb-2">Join our community for support</p>
                    <p className="text-sm text-muted-foreground">
                      Use the Comments and Requests sections to engage with us
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <h3 className="font-semibold text-lg mb-2">NovaForge Studio</h3>
                <p className="text-muted-foreground text-sm">
                  Created in December 2025 by passionate students from India. 
                  We believe in making quality software accessible to everyone.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    className="bg-muted/50 min-h-[150px]"
                  />
                </div>
                <Button className="w-full btn-nova text-primary-foreground border-0">
                  <span className="relative z-10 flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4" />
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
