import { Layout } from "@/components/Layout";
import { Upload, Link as LinkIcon, Globe, Monitor, Apple, Smartphone, Tablet, Gamepad2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { WebFileManager, FileNode } from "@/components/WebFileManager";

const platforms = [
  { id: "windows", label: "Windows", icon: Monitor },
  { id: "mac", label: "Mac", icon: Apple },
  { id: "linux", label: "Linux", icon: Monitor },
  { id: "android", label: "Android", icon: Smartphone },
  { id: "ios", label: "iOS", icon: Tablet },
  { id: "keypad", label: "Keypad Mobile", icon: Gamepad2 },
  { id: "web", label: "Web (Play Online)", icon: Globe },
];

const UploadSoftware = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [webFiles, setWebFiles] = useState<FileNode[]>([]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const isWebOnly = selectedPlatforms.length === 1 && selectedPlatforms.includes("web");
  const hasWeb = selectedPlatforms.includes("web");
  const hasOtherPlatforms = selectedPlatforms.some((p) => p !== "web");

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
            <form className="space-y-8">
              {/* Software Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Software Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your software name"
                  className="bg-muted/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your software does, its features, and requirements..."
                  className="bg-muted/50 min-h-[120px]"
                />
              </div>

              {/* Version */}
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., 1.0.0"
                  className="bg-muted/50"
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Select Platforms</Label>
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
                        Download Link (Cloud Share)
                      </Label>
                      <Input
                        id="download-link"
                        placeholder="e.g., Google Drive, Dropbox, OneDrive link"
                        className="bg-muted/50"
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
                      onChange={() => setIsPaid(false)}
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
                      onChange={() => setIsPaid(true)}
                      className="sr-only"
                    />
                    <span className={isPaid ? "text-foreground font-medium" : "text-muted-foreground"}>
                      Paid
                    </span>
                  </Label>
                </div>

                {isPaid && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price in INR"
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <Info className="w-3 h-3 mt-0.5 shrink-0" />
                      Payments are processed via Razorpay. One-time setup required for your profile.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full btn-nova text-primary-foreground border-0">
                <span className="relative z-10 flex items-center gap-2">
                  Upload Software
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
