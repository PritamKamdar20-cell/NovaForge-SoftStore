import { Layout } from "@/components/Layout";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Crown, Wrench, Users, Ban, Check, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  email: string;
  display_name: string | null;
  role: AppRole;
  is_banned: boolean;
  ban_reason: string | null;
}

const ROLE_CONFIG: Record<AppRole, { label: string; icon: typeof User; color: string }> = {
  owner: { label: "Owner", icon: Crown, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  admin: { label: "Admin", icon: Shield, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  helper: { label: "Helper", icon: Wrench, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  user: { label: "User", icon: User, color: "bg-muted text-muted-foreground border-border" },
};

const RoleManagement = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && role !== "owner") {
      navigate("/");
    }
  }, [role, authLoading, navigate]);

  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banTarget, setBanTarget] = useState<UserWithRole | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(query) ||
        u.display_name?.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);
  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles and roles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, display_name, is_banned, ban_reason");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      setLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      setLoading(false);
      return;
    }

    // Combine profiles with roles
    const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
      const userRole = roles?.find((r) => r.user_id === profile.id);
      return {
        id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        role: (userRole?.role as AppRole) || "user",
        is_banned: profile.is_banned,
        ban_reason: profile.ban_reason,
      };
    });

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    if (role === "owner") {
      fetchUsers();
    }
  }, [role]);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    if (userId === user?.id) {
      toast({
        title: "Error",
        description: "You cannot change your own role",
        variant: "destructive",
      });
      return;
    }

    if (newRole === "owner") {
      toast({
        title: "Error",
        description: "Cannot assign owner role to another user",
        variant: "destructive",
      });
      return;
    }

    setUpdatingUserId(userId);

    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }

    setUpdatingUserId(null);
  };

  const openBanDialog = (userItem: UserWithRole) => {
    setBanTarget(userItem);
    setBanReason("");
    setBanDialogOpen(true);
  };

  const handleBanUser = async () => {
    if (!banTarget) return;

    setBanningUserId(banTarget.id);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_banned: true,
        ban_reason: banReason || null,
        banned_at: new Date().toISOString(),
        banned_by: user?.id,
      })
      .eq("id", banTarget.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    } else {
      toast({
        title: "User Banned",
        description: `${banTarget.display_name || banTarget.email} has been banned`,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === banTarget.id ? { ...u, is_banned: true, ban_reason: banReason } : u
        )
      );
    }

    setBanningUserId(null);
    setBanDialogOpen(false);
    setBanTarget(null);
  };

  const handleUnbanUser = async (userItem: UserWithRole) => {
    setBanningUserId(userItem.id);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_banned: false,
        ban_reason: null,
        banned_at: null,
        banned_by: null,
      })
      .eq("id", userItem.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive",
      });
    } else {
      toast({
        title: "User Unbanned",
        description: `${userItem.display_name || userItem.email} has been unbanned`,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userItem.id ? { ...u, is_banned: false, ban_reason: null } : u
        )
      );
    }

    setBanningUserId(null);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container px-4">
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (role !== "owner") {
    return null;
  }

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Role <span className="gradient-text">Management</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage user roles and permissions for your platform.
            </p>
          </div>

          {/* Role Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(Object.entries(ROLE_CONFIG) as [AppRole, typeof ROLE_CONFIG[AppRole]][]).map(([roleKey, config]) => {
              const Icon = config.icon;
              return (
                <Badge key={roleKey} variant="outline" className={`${config.color} gap-1`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </Badge>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                className="pl-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 glass-card max-w-md mx-auto">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No Results Found" : "No Users Found"}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No users match "${searchQuery}"`
                  : "There are no users to manage yet."
                }
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredUsers.map((userItem) => {
                const config = ROLE_CONFIG[userItem.role];
                const Icon = config.icon;
                const isCurrentUser = userItem.id === user?.id;
                const isOwner = userItem.role === "owner";

                return (
                  <div
                    key={userItem.id}
                    className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {userItem.display_name || "No name"}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {userItem.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {userItem.is_banned && (
                        <Badge variant="destructive" className="gap-1">
                          <Ban className="w-3 h-3" />
                          Banned
                        </Badge>
                      )}
                      
                      {isOwner ? (
                        <Badge variant="outline" className={config.color}>
                          <Crown className="w-3 h-3 mr-1" />
                          Owner
                        </Badge>
                      ) : (
                        <>
                          <Select
                            value={userItem.role}
                            onValueChange={(value) => handleRoleChange(userItem.id, value as AppRole)}
                            disabled={updatingUserId === userItem.id}
                          >
                            <SelectTrigger className="w-full sm:w-36 bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border">
                              <SelectItem value="user">
                                <span className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  User
                                </span>
                              </SelectItem>
                              <SelectItem value="helper">
                                <span className="flex items-center gap-2">
                                  <Wrench className="w-3 h-3" />
                                  Helper
                                </span>
                              </SelectItem>
                              <SelectItem value="admin">
                                <span className="flex items-center gap-2">
                                  <Shield className="w-3 h-3" />
                                  Admin
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {userItem.is_banned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnbanUser(userItem)}
                              disabled={banningUserId === userItem.id}
                              className="gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Unban
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openBanDialog(userItem)}
                              disabled={banningUserId === userItem.id}
                              className="gap-1"
                            >
                              <Ban className="w-3 h-3" />
                              Ban
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {banTarget?.display_name || banTarget?.email}? They will not be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ban-reason">Reason (optional)</Label>
              <Textarea
                id="ban-reason"
                placeholder="Enter the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBanUser} disabled={banningUserId !== null}>
              {banningUserId ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default RoleManagement;