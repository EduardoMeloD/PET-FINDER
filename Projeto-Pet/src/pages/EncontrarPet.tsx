import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Search, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { db } from "../pages/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";



export default function EncontrarPet() {
  const [searchCode, setSearchCode] = useState("");
  const [foundPet, setFoundPet] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams] = useSearchParams();


  useEffect(() => {
    const codigo = searchParams.get("codigo");
    if (codigo) {
      setSearchCode(codigo);
      handleSearchFromURL(codigo);
    }
  }, [searchParams]);

  const handleSearchFromURL = async (codigo: string) => {
    setIsSearching(true);
    try {
      const docRef = doc(db, "pets", codigo.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const petData = docSnap.data();
        const tutorRef = doc(db, "usuarios", petData.ownerId);
        const tutorSnap = await getDoc(tutorRef);
        const tutorData = tutorSnap.exists() ? tutorSnap.data() : {};

        setFoundPet({
          id: docSnap.id,
          ...petData,
          tutorTelefone: tutorData.phone || "",
          tutorNome: tutorData.name || "",
          tutorEmail: tutorData.email || "",
        });
        setIsDialogOpen(true);
      } else {
        alert("Pet não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar pet pela URL:", error);
      alert("Erro ao buscar pet.");
    } finally {
      setIsSearching(false);
    }
  };


  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    setIsSearching(true);
    try {
      const docRef = doc(db, "pets", searchCode.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const petData = docSnap.data();

          // Buscar os dados do tutor com base no ownerId
      const tutorRef = doc(db, "usuarios", petData.ownerId);
      const tutorSnap = await getDoc(tutorRef);

      const tutorData = tutorSnap.exists() ? tutorSnap.data() : {}

        setFoundPet({
          id: docSnap.id,
          ...petData,
          tutorTelefone: tutorData.phone || "",
        tutorNome: tutorData.name || "",
        tutorEmail: tutorData.email || "",
        });
        setIsDialogOpen(true);
      } else {
        alert("Pet não encontrado. Verifique o código.");
      }
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
      alert("Erro ao buscar pet. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Encontrou um Pet Perdido?
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Digite o código da coleira abaixo para encontrar o tutor do pet e
            ajudá-lo a voltar para casa.
          </p>

          <Card className="mb-8 bg-petgreen-light border-0">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Digite o código do pet"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                <Button
                  className="bg-petgreen hover:bg-opacity-90 min-w-[100px]"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <div className="text-lg font-medium">OU</div>
          </div>

          <Card className="bg-white shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl text-center flex justify-center">
                <QrCode className="h-6 w-6 mr-2 text-petgreen" />
                <span>Escanear QR Code</span>
              </CardTitle>
              <CardDescription className="text-center">
                Use a câmera do seu smartphone para escanear o QR Code na coleira
                do pet
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Button
                className="bg-petpurple hover:bg-petpurple-secondary flex gap-2"
                onClick={() =>
                  alert(
                    "não disponível no momento"
                  )
                }
              >
                <QrCode size={18} />
                <span>Iniciar Scanner</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pet Information Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-petgreen">
                Pet Encontrado!
              </DialogTitle>
              <DialogDescription>
                Aqui estão as informações do pet e como entrar em contato com o tutor.
              </DialogDescription>
            </DialogHeader>

            {foundPet && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={foundPet.imagemUrl}
                    alt={foundPet.nomePet}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                  <div className="bg-petgreen-light p-4 rounded-md flex flex-col items-center">
                    <p className="text-sm mb-2">Escaneie para mais informações:</p>
                    <QRCodeSVG
                      value={`https://petfinder.com/pet/${foundPet.petCode}`}
                      size={150}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-petgreen mb-2">
                    {foundPet.nomePet}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {foundPet.tipo} • {foundPet.raca} • {foundPet.cor}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Descrição:</h4>
                      <p className="text-gray-600">{foundPet.descricao}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Sexo:</h4>
                      <p className="text-gray-600">{foundPet.sexo}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Data de Nascimento:</h4>
                      <p className="text-gray-600">
                        {new Date(foundPet.dataNascimento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">Código do Pet:</h4>
                      <p className="text-gray-600">{foundPet.petCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button className="bg-petgreen hover:bg-opacity-90 w-full sm:w-auto flex gap-2"    onClick={() => {
      const phoneNumber = foundPet.tutorTelefone.replace(/\D/g, "");
      const zapLink = `https://wa.me/55${phoneNumber}?text=Olá!%20Encontrei%20seu%20pet%20${foundPet.nomePet}%20com%20o%20código%20${foundPet.petCode}`;
      window.open(zapLink, "_blank");
    }}>
                <FaWhatsapp size={18} className="text-white" />
                <span>Entrar em Contato com o Tutor</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
