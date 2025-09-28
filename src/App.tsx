import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateSpace from "./pages/CreateSpace";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentManager from "./pages/DocumentManager";
import DocumentViewer from "./pages/DocumentViewer";
import SpacesOverview from "./pages/SpacesOverview";
import SpaceChatPage from "./pages/SpaceChatPage";
import CreateSpaceEnhanced from "./pages/CreateSpaceEnhanced";
import DiscoverSpaces from "./pages/DiscoverSpaces";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/spaces" element={<ProtectedRoute><SpacesOverview /></ProtectedRoute>} />
            <Route path="/spaces/create" element={<ProtectedRoute><CreateSpaceEnhanced /></ProtectedRoute>} />
            <Route path="/spaces/discover" element={<ProtectedRoute><DiscoverSpaces /></ProtectedRoute>} />
            <Route path="/spaces/:spaceId/chat" element={<ProtectedRoute><SpaceChatPage /></ProtectedRoute>} />
            <Route path="/documents/upload" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
            <Route path="/documents/manage" element={<ProtectedRoute><DocumentManager /></ProtectedRoute>} />
            <Route path="/documents/view" element={<ProtectedRoute><DocumentViewer /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
