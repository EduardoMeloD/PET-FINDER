
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import CadastroPet from "./pages/CadastroPet";
import EncontrarPet from "./pages/EncontrarPet";
import MeusPets from "./pages/MeusPets";
import Campanhas from "./pages/Campanhas";
import Sobre from "./pages/Sobre";
import { ScrollToTop } from "@/components/ScrollToTop";
import {AdminCampanhas }from "./pages/AdminCampanhas";


const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-petgreen"></div>
    </div>;
  }
  
  if (!isAuthenticated ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Routes wrapper with authentication provider
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/encontrar-pet" element={<EncontrarPet />} />
    <Route path="/campanhas" element={<Campanhas />} />
    <Route path="/sobre" element={<Sobre />} />
    

     {/* Rota de admin para campanhas */}
    <Route path= "/admin/campanhas" element={
      <ProtectedRoute>
        <AdminCampanhas />
      </ProtectedRoute>
    } />
    
    {/* Protected routes */}
    <Route path="/cadastro-pet" element={
      <ProtectedRoute>
        <CadastroPet />
      </ProtectedRoute>
    } />
    <Route path="/meus-pets" element={
      <ProtectedRoute>
        <MeusPets />
      </ProtectedRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
          <AppRoutes />
          
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
