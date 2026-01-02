import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  requirePassword?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete this item.",
  isLoading = false,
  requirePassword = true,
}: ConfirmDeleteDialogProps) {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (requirePassword && user?.email) {
      setIsVerifying(true);
      const { error } = await signIn(user.email, password);
      setIsVerifying(false);

      if (error) {
        toast({
          title: "Incorrect password",
          description: "Please enter your correct password to confirm deletion.",
          variant: "destructive",
        });
        return;
      }
    }
    onConfirm();
    setPassword("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword("");
    }
    onOpenChange(newOpen);
  };

  const isButtonDisabled = isLoading || isVerifying || (requirePassword && !password);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requirePassword && (
          <div className="space-y-2 py-2">
            <Label htmlFor="confirm-password">Enter your password to confirm</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <PasswordInput
                id="confirm-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading || isVerifying}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isButtonDisabled}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading || isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isVerifying ? "Verifying..." : "Deleting..."}
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
