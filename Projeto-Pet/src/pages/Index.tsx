
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, CalendarDays, QrCode } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Index() {

  const { user, userData, logout, isAuthenticated, isAdmin } = useAuth();


  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center space-x-0 md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Proteja seu Pet com a <span className="text-petgreen">PetFinder</span>
            </h1>
            <p className="text-gray-600 mb-6 text-base md:text-lg">
              Cadastre seu pet, gere um código exclusivo com QR Code para a coleira. 
              Caso ele se perca, quem o encontrar poderá acessar seus dados de contato facilmente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {!isAuthenticated && (

                <Button asChild className="bg-petgreen text-white hover:bg-petgreen-light">
                <Link to="/cadastro">Cadastre-se</Link>
              </Button>
              )}
              
              <Button asChild variant="outline" className="border-petgreen text-petgreen hover:bg-petgreen hover:text-white">
                <Link to="/encontrar-pet">Encontrar Pet</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/lovable-uploads/884ac099-bebd-40de-8076-19a91769615b.png" 
              alt="Pets"
              className="max-w-full md:max-w-[500px] h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

    

    

      {/* About Section */}
      <section className="bg-petblue-light py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Sobre o PetFinder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-10">
              <div>
                <h3 className="text-xl font-bold text-petgreen mb-4">Como Funciona?</h3>
                <p className="text-gray-600">
                  O PetFinder é uma plataforma que ajuda tutores de pets a 
                  recuperar seus animais perdidos através de um sistema simples e eficaz de QR Code.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-petgreen mb-4">Por que usar?</h3>
                <p className="text-gray-600">
                  Maior chance de recuperar seu pet caso ele se perca. 
                  Quem encontrá-lo pode escanear o QR Code e entrar em contato com você imediatamente.
                </p>
              </div>
            </div>
            <Button asChild className="bg-petgreen text-white hover:bg-opacity-90">
              <Link to="/sobre">Saiba Mais</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
