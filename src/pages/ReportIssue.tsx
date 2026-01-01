import { Layout } from "@/components/Layout";
import { AlertTriangle, Bug, Shield, FileWarning, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const issueTypes = [
  { value: "bug", label: "Bug / Technical Issue", icon: Bug, description: "Something isn't working correctly" },
  { value: "fake-content", label: "Fake Content", icon: FileWarning, description: "Fake software, comment, or request" },
  { value: "security", label: "Security Concern", icon: Shield, description: "Security vulnerability or threat" },
  { value: "other", label: "Other Issue", icon: AlertTriangle, description: "Any other problem" },
];

const ReportIssue = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Report an <span className="gradient-text">Issue</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us keep NovaForge SoftStore safe and functional. Report bugs, fake content, or any concerns.
            </p>
          </div>

          {/* Report Form */}
          <div className="glass-card p-8">
            <form className="space-y-8">
              {/* Issue Type */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">What type of issue are you reporting?</Label>
                <RadioGroup defaultValue="bug" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueTypes.map((type) => (
                    <Label
                      key={type.value}
                      htmlFor={type.value}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                    >
                      <RadioGroupItem value={type.value} id={type.value} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <type.icon className="w-4 h-4 text-primary" />
                          {type.label}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  className="bg-muted/50"
                />
              </div>

              {/* Related Content URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Related Content URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="Link to the software, comment, or page with the issue"
                  className="bg-muted/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible about the issue..."
                  className="bg-muted/50 min-h-[150px]"
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Your Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="So we can follow up with you"
                  className="bg-muted/50"
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full btn-nova text-primary-foreground border-0">
                <span className="relative z-10 flex items-center gap-2">
                  Submit Report
                  <Send className="w-4 h-4" />
                </span>
              </Button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                For Helpers
              </h4>
              <p className="text-sm text-muted-foreground">
                Helpers can report issues they find while assisting users. Your reports help maintain platform quality.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
                Resolution Process
              </h4>
              <p className="text-sm text-muted-foreground">
                Admins and the Owner review all reports and take appropriate action to resolve issues promptly.
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border/50">
            <h4 className="font-semibold mb-3">Reporting Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Be specific about what the issue is and where you found it
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include steps to reproduce bugs when possible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                For fake content, explain why you believe it's fake
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Security issues are prioritized and handled confidentially
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReportIssue;
