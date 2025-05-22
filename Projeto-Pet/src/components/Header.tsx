import { LogOut, Menu, PawPrint, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export function Header() {
  const { user, userData, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    // In a real app, you might want to redirect here
  };

  return (
    <header className="w-full bg-petgreen py-4 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center text-white text-2xl font-bold">
          <PawPrint className="mr-2" size={24} />
          <span>PetFinder</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-opacity-80">Início</Link>
          <Link to="/encontrar-pet" className="text-white hover:text-opacity-80">Encontrar Pet</Link>
          {isAuthenticated && (
            <Link to="/meus-pets" className="text-white hover:text-opacity-80">Meus Pets</Link>
          )}
          <Link to="/campanhas" className="text-white hover:text-opacity-80">Campanhas</Link>
          <Link to="/sobre" className="text-white hover:text-opacity-80">Sobre</Link>
          
          {/* Opções de Admin - Verificando explicitamente se userData?.role é 'admin' ou userData?.type é 'admin' */}
          {isAuthenticated && (userData?.role === 'admin' || userData?.type === 'admin') && (
            <Link to="/admin/campanhas" className="text-white hover:text-opacity-80">
              Gerenciar/Campanhas
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Authentication Button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-white">Olá, {user?.displayName?.split(' ')[0]}</span>
              <Button
                variant="outline"
                className="bg-white text-petgreen hover:bg-opacity-90"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-white text-petgreen hover:bg-opacity-90">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="outline" className="bg-white text-petgreen hover:bg-opacity-90">
                <Link to="/cadastro">Cadastre-se</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="bg-white h-full w-64 p-4 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-xl text-petgreen">Menu</span>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X size={24} />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                Início
              </Link>
              <Link
                to="/encontrar-pet"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                Encontrar Pet
              </Link>
              {isAuthenticated && (
                <Link
                  to="/meus-pets"
                  className="px-2 py-1 rounded hover:bg-gray-100"
                  onClick={toggleMobileMenu}
                >
                  Meus Pets
                </Link>
              )}
              <Link
                to="/campanhas"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                Campanhas
              </Link>
              <Link
                to="/sobre"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                Sobre
              </Link>
              
              {/* Adicionar opção de admin no menu mobile também */}
              {isAuthenticated && (userData?.role === 'admin' || userData?.type === 'admin') && (
                <Link
                  to="/admin/campanhas"
                  className="px-2 py-1 rounded hover:bg-gray-100 font-medium text-petgreen"
                  onClick={toggleMobileMenu}
                >
                  Gerenciar Campanhas
                </Link>
              )}
              
              <div className="pt-4 border-t">
                { isAuthenticated ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">Logado como: {user?.email}</p>
                    {(userData?.role === 'admin' || userData?.type === 'admin') && (
                      <p className="text-xs text-petgreen font-semibold mb-2">Administrador</p>
                    )}
                    <Button
                      variant="default"
                      className="w-full bg-petgreen hover:bg-opacity-90"
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="default"
                      className="w-full bg-petgreen hover:bg-opacity-90"
                      onClick={toggleMobileMenu}
                    >
                      <Link to="/login" className="w-full text-white">
                        Entrar
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-petgreen text-petgreen hover:bg-petgreen hover:text-white"
                      onClick={toggleMobileMenu}
                    >
                      <Link to="/cadastro" className="w-full">
                        Cadastre-se
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}