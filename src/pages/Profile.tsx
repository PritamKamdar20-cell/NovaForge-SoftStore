import { Layout } from "@/components/Layout";
import { User, Mail, Shield, Package, Download, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Your <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account, uploads, and preferences.
            </p>
          </div>

          {/* Not Logged In State */}
          <div className="glass-card p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to NovaForge</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in to access your profile, upload software, manage your content, and connect with the community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="btn-nova text-primary-foreground border-0 px-8">
                <span className="relative z-10">Sign In</span>
              </Button>
              <Button variant="outline" className="px-8">
                Create Account
              </Button>
            </div>
          </div>

          {/* Role Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-3 flex items-center justify-center text-xl">
                👑
              </div>
              <h4 className="font-semibold mb-1">Owner</h4>
              <p className="text-xs text-muted-foreground">
                Full platform control. Can manage all content, users, and settings.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center text-xl">
                ⚡
              </div>
              <h4 className="font-semibold mb-1">Admin</h4>
              <p className="text-xs text-muted-foreground">
                Resolve issues, manage news, and moderate content.
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-3 flex items-center justify-center text-xl">
                🛠️
              </div>
              <h4 className="font-semibold mb-1">Helper</h4>
              <p className="text-xs text-muted-foreground">
                Report problems and assist users in the community.
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <h4 className="font-semibold mb-2">Profile Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Upload and manage your software</li>
              <li>• Set prices using Razorpay (one-time setup)</li>
              <li>• Edit your profile information</li>
              <li>• View your comments and requests</li>
              <li>• First registered user becomes the Owner</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
