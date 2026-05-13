import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ScrollToTop } from "@/components/ScrollToTop";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Movies = lazy(() => import("./pages/Movies"));
const Series = lazy(() => import("./pages/Series"));
const Search = lazy(() => import("./pages/Search"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const SeriesDetails = lazy(() => import("./pages/SeriesDetails"));
const Collections = lazy(() => import("./pages/Collections"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen" style={{ background: '#0a0a0c' }}>
    <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#d4a056' }} />
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <ScrollToTop />
              <InstallPrompt />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
                  <Route path="/search" element={<ProtectedPage><Search /></ProtectedPage>} />
                  <Route path="/movies" element={<ProtectedPage><Movies /></ProtectedPage>} />
                  <Route path="/series" element={<ProtectedPage><Series /></ProtectedPage>} />
                  <Route path="/movie/:id" element={<ProtectedPage><MovieDetails /></ProtectedPage>} />
                  <Route path="/series/:id" element={<ProtectedPage><SeriesDetails /></ProtectedPage>} />
                  <Route path="/collections" element={<ProtectedPage><Collections /></ProtectedPage>} />
                  <Route path="/admin/users" element={<ProtectedPage><AdminUsers /></ProtectedPage>} />
                  <Route path="/profile/:userId" element={<ProtectedPage><UserProfile /></ProtectedPage>} />
                  <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

