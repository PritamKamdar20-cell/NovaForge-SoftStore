import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogIn, LogOut, Crown, Shield, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { name: "News", path: "/news" },
  { name: "About", path: "/about" },
  { name: "Comment", path: "/comments" },
  { name: "Request", path: "/requests" },
  { name: "Profile", path: "/profile" },
  { name: "Contact", path: "/contact" },
  { name: "How to Use", path: "/how-to-use" },
];

const ownerNavItems = [
  { name: "Manage Roles", path: "/role-management" },
];

const roleIcons = {
  owner: Crown,
  admin: Shield,
  helper: Wrench,
  user: User,
};

const roleColors = {
  owner: "from-yellow-500 to-orange-500",
  admin: "from-purple-500 to-pink-500",
  helper: "from-blue-500 to-cyan-500",
  user: "from-primary to-secondary",
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, role, signOut, loading } = useAuth();

  const RoleIcon = role ? roleIcons[role] : User;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-lg transition-transform group-hover:scale-110">
              NF
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg gradient-text">NovaForge</span>
              <span className="text-muted-foreground text-sm block -mt-1">SoftStore</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link text-sm font-medium",
                  location.pathname === item.path && "text-foreground active"
                )}
              >
                {item.name}
              </Link>
            ))}
            {role === "owner" && ownerNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link text-sm font-medium text-yellow-400",
                  location.pathname === item.path && "text-yellow-300 active"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {role && (
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${roleColors[role]} text-white border-0 capitalize`}
                  >
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {role}
                  </Badge>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="btn-nova text-primary-foreground border-0">
                    <User className="w-4 h-4 mr-2" />
                    <span className="relative z-10">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {role === "owner" && ownerNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors text-yellow-400",
                    location.pathname === item.path
                      ? "bg-muted text-yellow-300"
                      : "hover:bg-muted/50 hover:text-yellow-300"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                {user ? (
                  <>
                    {role && (
                      <Badge 
                        variant="outline" 
                        className={`bg-gradient-to-r ${roleColors[role]} text-white border-0 capitalize`}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {role}
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full btn-nova text-primary-foreground border-0">
                        <span className="relative z-10">Sign Up</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
