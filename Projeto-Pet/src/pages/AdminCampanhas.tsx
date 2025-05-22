import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../pages/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Navigate } from "react-router-dom";

// Define form data interface
interface CampaignForm {
  id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
  moreInfo: string;
}

export function AdminCampanhas() {
  const { isAdmin } = useAuth();
  const [campanhas, setCampanhas] = useState<CampaignForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<CampaignForm>({
    id: undefined,
    title: "",
    date: "",
    location: "",
    description: "",
    moreInfo: "",
  });

  // Fetch all campanhas
  const fetchCampanhas = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "campanhas"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<CampaignForm, 'id'>) }));
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

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) {
        // Update existing
        const docRef = doc(db, "campanhas", form.id);
        await updateDoc(docRef, {
          title: form.title,
          date: form.date,
          location: form.location,
          description: form.description,
          moreInfo: form.moreInfo
        });
      } else {
        // Create new
        await addDoc(collection(db, "campanhas"), {
          title: form.title,
          date: form.date,
          location: form.location,
          description: form.description,
          moreInfo: form.moreInfo
        });
      }
      setShowModal(false);
      setForm({ id: undefined, title: "", date: "", location: "", description: "", moreInfo: "" });
      fetchCampanhas();
    } catch (error) {
      console.error("Erro ao salvar campanha", error);
    }
  };

  // Delete campanha
  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir essa campanha?")) {
      await deleteDoc(doc(db, "campanhas", id));
      fetchCampanhas();
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Campanhas</h1>
          <Button
            onClick={() => {
              setForm({ id: undefined, title: "", date: "", location: "", description: "", moreInfo: "" });
              setShowModal(true);
            }}
            className="bg-petgreen hover:bg-opacity-90"
          >
            Nova Campanha
          </Button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campanhas.map(c => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p><strong>Data:</strong> {c.date}</p>
                    <p><strong>Local:</strong> {c.location}</p>
                    <p>{c.description}</p>
                    <p><em>{c.moreInfo}</em></p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setForm(c); setShowModal(true); }}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id!)}>
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl mb-4">{form.id ? "Editar" : "Nova"} Campanha</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Título"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  name="location"
                  placeholder="Localização"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Descrição"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="moreInfo"
                  placeholder="Mais informações"
                  value={form.moreInfo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={() => setShowModal(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}