import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, AlertTriangle, Check, ExternalLink, Eye, EyeOff } from "lucide-react";

const RazorpaySetup = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchSetup = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("razorpay_key_id, razorpay_setup_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching Razorpay setup:", error);
      } else if (data) {
        setKeyId(data.razorpay_key_id || "");
        setIsSetup(data.razorpay_setup_complete || false);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchSetup();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!keyId.trim()) {
      toast({
        title: "Key ID Required",
        description: "Please enter your Razorpay Key ID.",
        variant: "destructive",
      });
      return;
    }

    if (!keySecret.trim() && !isSetup) {
      toast({
        title: "Key Secret Required",
        description: "Please enter your Razorpay Key Secret.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const updateData: Record<string, any> = {
        razorpay_key_id: keyId.trim(),
        razorpay_setup_complete: true,
      };

      // Only update secret if provided (for updates, it's optional)
      if (keySecret.trim()) {
        updateData.razorpay_key_secret = keySecret.trim();
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Razorpay Setup Complete",
        description: "Your payment gateway is now configured.",
      });

      setIsSetup(true);
      setKeySecret("");
    } catch (error: any) {
      console.error("Error saving Razorpay setup:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          razorpay_key_id: null,
          razorpay_key_secret: null,
          razorpay_setup_complete: false,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Razorpay Removed",
        description: "Your payment gateway has been disconnected.",
      });

      setKeyId("");
      setKeySecret("");
      setIsSetup(false);
    } catch (error: any) {
      console.error("Error removing Razorpay:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container px-4 max-w-2xl mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Razorpay <span className="gradient-text">Setup</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Configure your Razorpay payment gateway to sell software on NovaForge.
            </p>
          </div>

          {/* Status */}
          {isSetup && (
            <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">
                Razorpay is configured and ready to receive payments
              </span>
            </div>
          )}

          {/* Form */}
          <div className="glass-card p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keyId">Razorpay Key ID *</Label>
                <Input
                  id="keyId"
                  placeholder="rzp_test_xxxxxxxxxxxxxxxx"
                  className="bg-muted/50"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keySecret">
                  Razorpay Key Secret {isSetup ? "(leave blank to keep current)" : "*"}
                </Label>
                <div className="relative">
                  <Input
                    id="keySecret"
                    type={showSecret ? "text" : "password"}
                    placeholder={isSetup ? "••••••••••••••••" : "Enter your key secret"}
                    className="bg-muted/50 pr-10"
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                    required={!isSetup}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-yellow-400" />
                  <span>
                    Your API keys are stored securely. Get your keys from the{" "}
                    <a
                      href="https://dashboard.razorpay.com/app/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Razorpay Dashboard
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 btn-nova text-primary-foreground border-0"
                  disabled={isSaving}
                >
                  <span className="relative z-10">
                    {isSaving ? "Saving..." : isSetup ? "Update Settings" : "Save Settings"}
                  </span>
                </Button>
                {isSetup && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemove}
                    disabled={isSaving}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border/50">
            <h4 className="font-semibold mb-3">How it works</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                Create a Razorpay account at razorpay.com
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                Generate API keys from your Razorpay Dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                Enter your Key ID and Key Secret above
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                Start selling paid software on NovaForge!
              </li>
            </ul>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/profile">← Back to Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RazorpaySetup;