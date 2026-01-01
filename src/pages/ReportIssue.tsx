import { Layout } from "@/components/Layout";
import { AlertTriangle, Bug, Shield, FileWarning, Send, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/hooks/use-toast";

const issueTypes = [
  { value: "bug", label: "Bug / Technical Issue", icon: Bug, description: "Something isn't working correctly" },
  { value: "fake-content", label: "Fake Content", icon: FileWarning, description: "Fake software, comment, or request" },
  { value: "security", label: "Security Concern", icon: Shield, description: "Security vulnerability or threat" },
  { value: "other", label: "Other Issue", icon: AlertTriangle, description: "Any other problem" },
];

interface Report {
  id: string;
  user_id: string;
  issue_type: string;
  subject: string;
  related_url: string | null;
  description: string;
  contact_email: string | null;
  status: string;
  created_at: string;
}

const ReportIssue = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  const [issueType, setIssueType] = useState("bug");
  const [subject, setSubject] = useState("");
  const [relatedUrl, setRelatedUrl] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canViewReports = role === "admin" || role === "owner";
  const canReportAll = role === "helper" || role === "admin" || role === "owner";

  const fetchReports = async () => {
    if (!user) return;
    
    setLoadingReports(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data || []);
    }
    setLoadingReports(false);
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("reports").insert({
      user_id: user.id,
      issue_type: issueType,
      subject: subject.trim(),
      related_url: relatedUrl.trim() || null,
      description: description.trim(),
      contact_email: contactEmail.trim() || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submitted",
        description: "Your report has been submitted",
      });
      setSubject("");
      setRelatedUrl("");
      setDescription("");
      setContactEmail("");
      fetchReports();
    }
    setIsSubmitting(false);
  };

  const canDelete = (report: Report) => {
    if (!user) return false;
    return report.user_id === user.id || role === "admin" || role === "owner";
  };

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    const { error } = await supabase.from("reports").delete().eq("id", reportToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Report has been deleted",
      });
      fetchReports();
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-500/20 text-green-400";
      case "in-progress": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

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
          <div className="glass-card p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Issue Type */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">What type of issue are you reporting?</Label>
                <RadioGroup 
                  value={issueType} 
                  onValueChange={setIssueType} 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {issueTypes.map((type) => {
                    const isDisabled = !canReportAll && type.value !== "bug";
                    return (
                      <Label
                        key={type.value}
                        htmlFor={type.value}
                        className={`flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <RadioGroupItem value={type.value} id={type.value} className="mt-0.5" disabled={isDisabled} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-medium">
                            <type.icon className="w-4 h-4 text-primary" />
                            {type.label}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder={user ? "Brief description of the issue" : "Sign in to submit a report"}
                  className="bg-muted/50"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!user}
                />
              </div>

              {/* Related Content URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Related Content URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="Link to the software, comment, or page with the issue"
                  className="bg-muted/50"
                  value={relatedUrl}
                  onChange={(e) => setRelatedUrl(e.target.value)}
                  disabled={!user}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible about the issue..."
                  className="bg-muted/50 min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!user}
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
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={!user}
                />
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full btn-nova text-primary-foreground border-0"
                disabled={!user || !subject.trim() || !description.trim() || isSubmitting}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Report
                  <Send className="w-4 h-4" />
                </span>
              </Button>
            </form>
          </div>

          {/* My Reports / All Reports */}
          {user && reports.length > 0 && (
            <div className="glass-card p-6 mb-8">
              <h3 className="font-semibold mb-4">
                {canViewReports ? "All Reports" : "My Reports"}
              </h3>
              <div className="space-y-3">
                {loadingReports ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{report.subject}</span>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {report.issue_type} • {formatDate(report.created_at)}
                          </p>
                        </div>
                        {canDelete(report) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteClick(report)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Who Can Report What
              </h4>
              <p className="text-sm text-muted-foreground">
                <strong>Helpers</strong> can report all issue types (bugs, fake content, security, and other). <strong>Users</strong> can only report bugs.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
                Manage Reports
              </h4>
              <p className="text-sm text-muted-foreground">
                Reports can be edited or deleted by the <strong>sender</strong>, <strong>Admin</strong>, or <strong>Owner</strong>. Admins and Owner resolve all issues.
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Report"
        description={`Are you sure you want to delete the report "${reportToDelete?.subject}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default ReportIssue;
