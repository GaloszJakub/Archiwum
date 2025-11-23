import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ScrollToTop } from "@/components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import MovieDetails from "./pages/MovieDetails";
import SeriesDetails from "./pages/SeriesDetails";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import AdminUsers from "./pages/AdminUsers";
import UserProfile from "./pages/UserProfile";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
              <Route path="/movies" element={<ProtectedPage><Movies /></ProtectedPage>} />
              <Route path="/series" element={<ProtectedPage><Series /></ProtectedPage>} />
              <Route path="/movie/:id" element={<ProtectedPage><MovieDetails /></ProtectedPage>} />
              <Route path="/series/:id" element={<ProtectedPage><SeriesDetails /></ProtectedPage>} />
              <Route path="/collections" element={<ProtectedPage><Collections /></ProtectedPage>} />
              <Route path="/collections/:id" element={<ProtectedPage><CollectionDetails /></ProtectedPage>} />
              <Route path="/admin/users" element={<ProtectedPage><AdminUsers /></ProtectedPage>} />
              <Route path="/profile/:userId" element={<ProtectedPage><UserProfile /></ProtectedPage>} />
              <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
