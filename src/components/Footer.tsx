import { Link } from "react-router-dom";
import { Mail, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-lg">
                NF
              </div>
              <div>
                <span className="font-bold text-lg gradient-text">NovaForge</span>
                <span className="text-muted-foreground text-sm block -mt-1">SoftStore</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              Your ultimate destination for quality software. Created by students in India with passion for innovation.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:pritamkamdar3.0@outlook.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["News", "About", "Contact", "How to Use"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              {["Comments", "Requests", "Upload Software", "Report Issue"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 NovaForge Studio. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
