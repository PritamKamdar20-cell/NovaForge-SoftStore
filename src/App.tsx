import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Comments from "./pages/Comments";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import HowToUse from "./pages/HowToUse";
import ReportIssue from "./pages/ReportIssue";
import UploadSoftware from "./pages/UploadSoftware";
import Software from "./pages/Software";
import Auth from "./pages/Auth";
import RoleManagement from "./pages/RoleManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/upload-software" element={<UploadSoftware />} />
            <Route path="/upload" element={<UploadSoftware />} />
            <Route path="/software" element={<Software />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sign-in" element={<Auth />} />
            <Route path="/sign-up" element={<Auth />} />
            <Route path="/role-management" element={<RoleManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
