import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PetCard } from "@/components/PetCard";
import { PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "../pages/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PetDetails } from "@/components/PetDetails";
import {doc, deleteDoc} from "firebase/firestore";

interface Pet {
  id: string;
  nomePet: string;
  tipo: string;
  raca: string;
  cor: string;
  sexo: string;
  dataNascimento: string;
  descricao: string;
  imagem: string;
  qrcodeUrl: string;
  dataCadastro: string;
  petCode: string;
}

export default function MeusPets() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPets, setHasPets] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Buscar pets do usuário
  useEffect(() => {
    const fetchPets = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const petsQuery = query(collection(db, "pets"), where("ownerId", "==", user.uid));
        const querySnapshot = await getDocs(petsQuery);

        setHasPets(!querySnapshot.empty);

        const lista = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nomePet: data.nomePet,
            tipo: data.tipo,
            raca: data.raca,
            cor: data.cor,
            sexo: data.sexo,
            dataNascimento: data.dataNascimento,
            descricao: data.descricao,
            imagem: data.imagemUrl,
            qrcodeUrl: `https://petfinder.com/pet/${data.petCode}`,
            dataCadastro: data.createdAt?.toDate?.().toISOString?.() ?? "",
            petCode: data.petCode,
          };
        });

        setPets(lista);
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPets();
    }
  }, [user]);

  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPet(null);
  };

  const handleDeletePet = async (petId) =>{
    if (window.confirm("tem certeza que deseja apagar esse pet?")){
      await deleteDoc(doc(db, "pets", petId))
      setPets((prev)=> prev.filter((pet) => pet.id !== petId))
      setModalOpen(false)
    }
  }

  const handleEditPet = (pet) => {
    navigate("/cadastro-pet", {state: {pet}})
  }

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
      {hasPets && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meus Pets</h1>
      
            <Button asChild className="bg-petgreen hover:bg-opacity-90 flex gap-2">
              <Link to="/cadastro-pet">
                <PlusCircle size={18} />
                <span>Adicionar Pet</span>
              </Link>
            </Button>
      
        </div>
    )}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-petgreen"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-600 mb-4">Você ainda não tem pets cadastrados</h2>
            <p className="text-gray-500 mb-6">Cadastre seu primeiro pet para gerar um QR Code e facilitar sua identificação</p>
            <Button asChild className="bg-petgreen hover:bg-opacity-90">
              <Link to="/cadastro-pet">Cadastrar Pet</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onDetails={() => handleOpenModal(pet)}
                handleDeletePet={handleDeletePet}
                handleEditPet={handleEditPet}
              />
            ))}
          </div>
        )}
      </div>
      <PetDetails 
      pet={selectedPet} 
      isOpen={modalOpen}
      onClose={handleCloseModal} 
      handleDeletePet={handleDeletePet}
      handleEditPet={handleEditPet}
      />
    </Layout>
  );
}
