import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { User, Mail, Crown, Shield, Package, MessageSquare, AlertTriangle, Settings, CreditCard, Key, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { PasswordInput } from "@/components/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  user: { 
    icon: User, 
    label: "User", 
    gradient: "from-primary to-secondary",
    description: "Browse software, leave comments, and submit requests."
  },
};

const Profile = () => {
  const { user, role, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();
    if (data?.display_name) {
      setDisplayName(data.display_name);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "New password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);

    // First verify old password by re-authenticating
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: oldPassword,
    });

    if (signInError) {
      setPasswordLoading(false);
      toast({
        title: "Incorrect old password",
        description: "Please enter your current password correctly.",
        variant: "destructive",
      });
      return;
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (updateError) {
      toast({
        title: "Error updating password",
        description: updateError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated!",
        description: "Your password has been changed successfully.",
      });
      setShowPasswordChange(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    
    setPasswordLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPasswordLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", user.id);
    setProfileLoading(false);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Your display name has been updated.",
      });
      setShowProfileEdit(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }

    setProfileLoading(true);
    const { error } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });
    setProfileLoading(false);

    if (error) {
      toast({
        title: "Error changing email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification email sent!",
        description: "Please check both your old and new email to confirm the change.",
      });
      setShowEmailChange(false);
      setNewEmail("");
    }
  };

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
                      <h2 className="text-2xl font-bold">{displayName || user.email?.split("@")[0]}</h2>
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

              {/* Edit Profile Section */}
              <div className="mt-8">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Pencil className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Edit Profile</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your display name
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowProfileEdit(!showProfileEdit)}
                    >
                      {showProfileEdit ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  {showProfileEdit && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div>
                        <label className="block text-sm font-medium mb-2">Display Name</label>
                        <Input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your display name"
                          className="bg-muted/50"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateProfile}
                        className="btn-nova text-primary-foreground border-0"
                        disabled={profileLoading}
                      >
                        {profileLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Email Section */}
              <div className="mt-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Change Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your email address (requires verification)
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEmailChange(!showEmailChange)}
                    >
                      {showEmailChange ? "Cancel" : "Change"}
                    </Button>
                  </div>

                  {showEmailChange && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Email</label>
                        <Input
                          value={user.email || ""}
                          disabled
                          className="bg-muted/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Email</label>
                        <Input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email address"
                          className="bg-muted/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You will receive a verification link on both your old and new email addresses.
                      </p>
                      <Button 
                        onClick={handleChangeEmail}
                        className="btn-nova text-primary-foreground border-0"
                        disabled={profileLoading}
                      >
                        {profileLoading ? "Sending..." : "Send Verification"}
                      </Button>
                    </div>
                  )}
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

              {/* Change Password Section */}
              <div className="mt-8">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                        <Key className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Change Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your password using old password or email link
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                    >
                      {showPasswordChange ? "Cancel" : "Change"}
                    </Button>
                  </div>

                  {showPasswordChange && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div>
                        <label className="block text-sm font-medium mb-2">Old Password</label>
                        <PasswordInput
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <PasswordInput
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <PasswordInput
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={handleChangePassword}
                          className="btn-nova text-primary-foreground border-0"
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? "Updating..." : "Update Password"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={handleForgotPassword}
                          disabled={passwordLoading}
                        >
                          Send Reset Link Instead
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Razorpay Setup */}
              <div className="mt-8">
                <Link 
                  to="/razorpay-setup" 
                  className="block glass-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Razorpay Payment Setup</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure your payment gateway to sell software (optional)
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  </div>
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
