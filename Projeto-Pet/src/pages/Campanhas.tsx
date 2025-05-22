import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../pages/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Campaign {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  moreInfo: string;
}

export default function Campanhas() {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCampanhas = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "campanhas"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Campaign, 'id'>) }));
      setCampanhas(data);
    } catch (error) {
      console.error("Erro ao buscar campanhas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Campanhas de Vacinação</h1>
          <p className="text-lg text-gray-600">
            Confira as campanhas de vacinação que estão acontecendo na sua cidade.
            Mantenha seu pet saudável e protegido!
          </p>
        </div>

        {loading ? (
          <p>Carregando campanhas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campanhas.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-petgreen">{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-500">
                      <CalendarDays size={18} className="mr-2 text-petgreen" />
                      <span>{campaign.date}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin size={18} className="mr-2 text-petgreen" />
                      <span>{campaign.location}</span>
                    </div>
                    <p className="text-gray-600">{campaign.description}</p>

                    <details className="text-sm">
                      <summary className="text-petgreen font-medium cursor-pointer flex items-center">
                        <Info size={16} className="mr-1" />
                        Mais informações
                      </summary>
                      <p className="pt-2 px-2 text-gray-600">{campaign.moreInfo}</p>
                    </details>

                    <Button className="w-full bg-petgreen hover:bg-opacity-90">Lembrar-me</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}