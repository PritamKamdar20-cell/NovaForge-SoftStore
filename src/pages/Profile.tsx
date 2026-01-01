import { Layout } from "@/components/Layout";
import { User, Mail, Crown, Shield, Wrench, Package, MessageSquare, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const roleConfig = {
  owner: { 
    icon: Crown, 
    label: "Owner", 
    gradient: "from-yellow-500 to-orange-500",
    description: "Full platform control. Can manage all content, users, and settings."
  },
  admin: { 
    icon: Shield, 
    label: "Admin", 
    gradient: "from-purple-500 to-pink-500",
    description: "Resolve issues, manage news, and moderate content."
  },
  helper: { 
    icon: Wrench, 
    label: "Helper", 
    gradient: "from-blue-500 to-cyan-500",
    description: "Report all types of problems and assist users in the community."
  },
  user: { 
    icon: User, 
    label: "User", 
    gradient: "from-primary to-secondary",
    description: "Browse software, leave comments, and submit requests."
  },
};

const Profile = () => {
  const { user, role, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container px-4 max-w-4xl mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto mb-6" />
              <div className="h-8 w-48 bg-muted animate-pulse mx-auto mb-4" />
              <div className="h-4 w-64 bg-muted animate-pulse mx-auto" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const currentRole = role || "user";
  const RoleIcon = roleConfig[currentRole].icon;

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

          {user ? (
            <>
              {/* Logged In State */}
              <div className="glass-card p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${roleConfig[currentRole].gradient} flex items-center justify-center`}>
                    <RoleIcon className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{user.email?.split("@")[0]}</h2>
                      <Badge 
                        className={`bg-gradient-to-r ${roleConfig[currentRole].gradient} text-white border-0 capitalize`}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {currentRole}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {roleConfig[currentRole].description}
                    </p>
                  </div>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/upload-software" className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                  <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">Upload Software</h4>
                  <p className="text-xs text-muted-foreground">Share your creations</p>
                </Link>
                <Link to="/comments" className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                  <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">My Comments</h4>
                  <p className="text-xs text-muted-foreground">View your comments</p>
                </Link>
                <Link to="/requests" className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                  <Settings className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">My Requests</h4>
                  <p className="text-xs text-muted-foreground">Track your requests</p>
                </Link>
                <Link to="/report-issue" className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                  <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">Report Issue</h4>
                  <p className="text-xs text-muted-foreground">
                    {currentRole === "helper" ? "Report all issues" : "Report bugs"}
                  </p>
                </Link>
              </div>

              {/* Role Info for Owner */}
              {currentRole === "owner" && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Owner Privileges
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Manage user roles (promote to Admin/Helper)</li>
                    <li>• Edit or delete any content</li>
                    <li>• Create, edit, and delete news articles</li>
                    <li>• Resolve all reported issues</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
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
                  <Button className="btn-nova text-primary-foreground border-0 px-8" asChild>
                    <Link to="/auth">
                      <span className="relative z-10">Sign In</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="px-8" asChild>
                    <Link to="/auth">Create Account</Link>
                  </Button>
                </div>
              </div>

              {/* Role Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["owner", "admin", "helper"] as const).map((r) => {
                  const config = roleConfig[r];
                  return (
                    <div key={r} className="glass-card p-6 text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} mx-auto mb-3 flex items-center justify-center text-xl`}>
                        <config.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-1">{config.label}</h4>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  );
                })}
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
