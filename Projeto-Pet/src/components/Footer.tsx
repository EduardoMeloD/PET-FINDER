
import { Facebook, Instagram, Mail, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-petgreen">PetFinder</h3>
            <p className="text-gray-600 mb-4">
              Ajudamos tutores a encontrar seus pets perdidos com a tecnologia de QR Code.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-petgreen hover:text-petgreen-light">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-petgreen hover:text-petgreen-light">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-petgreen hover:text-petgreen-light">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-petgreen">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-petgreen">Início</Link>
              </li>
              <li>
                <Link to="/encontrar-pet" className="text-gray-600 hover:text-petgreen">Encontrar Pet</Link>
              </li>
              <li>
                <Link to="/meus-pets" className="text-gray-600 hover:text-petgreen">Meus Pets</Link>
              </li>
              <li>
                <Link to="/campanhas" className="text-gray-600 hover:text-petgreen">Campanhas</Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-600 hover:text-petgreen">Sobre</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-petgreen">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone size={18} className="text-petgreen mr-2" />
                <span className="text-gray-600">(11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-petgreen mr-2" />
                <span className="text-gray-600">contato@petfinder.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PetFinder. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
