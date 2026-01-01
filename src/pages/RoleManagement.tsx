import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Crown, Wrench, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  email: string;
  display_name: string | null;
  role: AppRole;
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

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles and roles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, display_name");

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

          {/* Users List */}
          {users.length === 0 ? (
            <div className="text-center py-16 glass-card max-w-md mx-auto">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                There are no users to manage yet.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {users.map((userItem) => {
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
                      {isOwner ? (
                        <Badge variant="outline" className={config.color}>
                          <Crown className="w-3 h-3 mr-1" />
                          Owner
                        </Badge>
                      ) : (
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RoleManagement;