import { Layout } from "@/components/Layout";
import { Upload, Link as LinkIcon, Globe, Monitor, Apple, Smartphone, Tablet, Gamepad2, Info, AlertTriangle, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { WebFileManager, FileNode } from "@/components/WebFileManager";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

const platforms = [
  { id: "windows", label: "Windows", icon: Monitor },
  { id: "mac", label: "Mac", icon: Apple },
  { id: "linux", label: "Linux", icon: Monitor },
  { id: "android", label: "Android", icon: Smartphone },
  { id: "ios", label: "iOS", icon: Tablet },
  { id: "keypad", label: "Keypad Mobile", icon: Gamepad2 },
  { id: "androidtv", label: "Android TV", icon: Tv },
  { id: "web", label: "Web (Play Online)", icon: Globe },
];

const UploadSoftware = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [webFiles, setWebFiles] = useState<FileNode[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRazorpay, setHasRazorpay] = useState<boolean | null>(null);

  // Check if user has Razorpay setup when they try to set paid
  const checkRazorpaySetup = async () => {
    if (!user) return false;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("razorpay_setup_complete")
      .eq("id", user.id)
      .maybeSingle();
    
    if (error || !data) return false;
    return data.razorpay_setup_complete;
  };

  const handlePaidChange = async (paid: boolean) => {
    if (paid) {
      const hasSetup = await checkRazorpaySetup();
      setHasRazorpay(hasSetup);
      if (!hasSetup) {
        toast({
          title: "Razorpay Setup Required",
          description: "Please set up your Razorpay gateway in your profile to sell paid software.",
          variant: "destructive",
        });
      }
    }
    setIsPaid(paid);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload software.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a software name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    if (isPaid) {
      const hasSetup = await checkRazorpaySetup();
      if (!hasSetup) {
        toast({
          title: "Razorpay Setup Required",
          description: "Please set up your Razorpay gateway in your profile first.",
          variant: "destructive",
        });
        return;
      }

      if (!price || parseFloat(price) <= 0) {
        toast({
          title: "Price required",
          description: "Please enter a valid price for paid software.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("software").insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        version: version.trim() || null,
        platforms: selectedPlatforms,
        download_link: downloadLink.trim() || null,
        is_paid: isPaid,
        price: isPaid ? parseFloat(price) : null,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your software has been uploaded successfully.",
      });

      navigate("/software");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload software. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWebOnly = selectedPlatforms.length === 1 && selectedPlatforms.includes("web");
  const hasWeb = selectedPlatforms.includes("web");
  const hasOtherPlatforms = selectedPlatforms.some((p) => p !== "web");

  if (!user) {
    return (
      <Layout>
        <section className="pt-32 pb-20">
          <div className="container px-4 max-w-3xl mx-auto">
            <div className="glass-card p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to upload software to NovaForge.
              </p>
              <Button asChild className="btn-nova text-primary-foreground border-0">
                <Link to="/auth">
                  <span className="relative z-10">Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Upload <span className="gradient-text">Software</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your software with the NovaForge community. Support multiple platforms and set your own price.
            </p>
          </div>

          {/* Upload Form */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Software Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Software Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your software name"
                  className="bg-muted/50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your software does, its features, and requirements..."
                  className="bg-muted/50 min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Version */}
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., 1.0.0"
                  className="bg-muted/50"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Select Platforms *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {platforms.map((platform) => (
                    <Label
                      key={platform.id}
                      htmlFor={platform.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        className="sr-only"
                      />
                      <platform.icon className={`w-6 h-6 ${
                        selectedPlatforms.includes(platform.id) ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedPlatforms.includes(platform.id) ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {platform.label}
                      </span>
                    </Label>
                  ))}
                </div>
              </div>

              {/* Platform-specific inputs */}
              {selectedPlatforms.length > 0 && (
                <div className="space-y-6 p-6 rounded-xl bg-muted/20 border border-border/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    Upload Details
                  </h3>

                  {/* Web Platform - File Manager */}
                  {hasWeb && (
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Web Platform - File Structure
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Organize your web files in folders. Create folders, upload files, or create empty files.
                      </p>
                      <WebFileManager files={webFiles} onChange={setWebFiles} />
                    </div>
                  )}

                  {/* Other Platforms - Cloud Share Link */}
                  {hasOtherPlatforms && (
                    <div className="space-y-2">
                      <Label htmlFor="download-link" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-primary" />
                        Download Link (Cloud Share) *
                      </Label>
                      <Input
                        id="download-link"
                        placeholder="e.g., Google Drive, Dropbox, OneDrive link"
                        className="bg-muted/50"
                        value={downloadLink}
                        onChange={(e) => setDownloadLink(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide a cloud share link for {selectedPlatforms.filter(p => p !== "web").map(p =>
                          platforms.find(pl => pl.id === p)?.label
                        ).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Pricing</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="free"
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                      !isPaid ? "border-primary bg-primary/10" : "border-border/50 bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      id="free"
                      name="pricing"
                      checked={!isPaid}
                      onChange={() => handlePaidChange(false)}
                      className="sr-only"
                    />
                    <span className={!isPaid ? "text-foreground font-medium" : "text-muted-foreground"}>
                      Free
                    </span>
                  </Label>
                  <Label
                    htmlFor="paid"
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                      isPaid ? "border-primary bg-primary/10" : "border-border/50 bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      id="paid"
                      name="pricing"
                      checked={isPaid}
                      onChange={() => handlePaidChange(true)}
                      className="sr-only"
                    />
                    <span className={isPaid ? "text-foreground font-medium" : "text-muted-foreground"}>
                      Paid
                    </span>
                  </Label>
                </div>

                {isPaid && (
                  <div className="space-y-2">
                    {hasRazorpay === false && (
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                        <p className="text-sm text-yellow-400 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            You need to set up Razorpay in your{" "}
                            <Link to="/profile" className="underline font-medium">
                              profile
                            </Link>{" "}
                            before selling paid software.
                          </span>
                        </p>
                      </div>
                    )}
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price in INR"
                      className="bg-muted/50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="1"
                      step="1"
                    />
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      Payments are processed via Razorpay. One-time setup required in your profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full btn-nova text-primary-foreground border-0"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Uploading..." : "Upload Software"}
                  <Upload className="w-4 h-4" />
                </span>
              </Button>
            </form>
          </div>

          {/* Guidelines */}
          <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border/50">
            <h4 className="font-semibold mb-3">Upload Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <strong>Web platform:</strong> Upload your website files (HTML, CSS, JS)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <strong>Other platforms:</strong> Provide a cloud share link (Google Drive, Dropbox, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Ensure your software is safe and free from malware
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                You can edit or delete your uploads anytime from your profile
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default UploadSoftware;
