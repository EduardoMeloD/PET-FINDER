import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, Lock, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";


type FormData = {
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
  imagem?: FileList,
  nomePet?: string,
  tipo?: string,
  raca?: string,
  cor?: string,
  sexo?: string,
  dataNascimento?: string,
  descricao?: string,
};

export default function Cadastro() {
  const { register: authRegister, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const petToEdit = location.state?.pet || null;
  const [isLoading, setIsLoading] = useState(false);

  function formatPhone(value: string){
    let numbers = value.replace(/\D/g, "");
    numbers = numbers.slice(0,11);
    if (numbers.length<=2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch
  } = useForm<FormData>()
  
  const password = watch("password", "")

  const [phone, setPhone] = useState("")

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let imageUrl = petToEdit?.imagemUrl || ""; // Usa a imagem antiga por padrão

      // Se o usuário selecionou uma nova imagem, faz upload
      if (data.imagem && data.imagem.length > 0) {
        const formData = new FormData();
        formData.append("image", data.imagem[0]);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error("Falha ao enviar imagem");
        }
        imageUrl = result.data.url;
      }

      if (petToEdit) {
        // EDIÇÃO
        await setDoc(doc(db, "pets", petToEdit.id), {
          nomePet: data.nomePet,
          tipo: data.tipo,
          raca: data.raca,
          cor: data.cor,
          sexo: data.sexo,
          dataNascimento: data.dataNascimento,
          descricao: data.descricao,
          imagemUrl: imageUrl, // Usa a imagem nova ou antiga
          ownerId: user.uid,
          petCode: petToEdit.petCode,
          createdAt: petToEdit.dataCadastro ? new Date(petToEdit.dataCadastro) : new Date(),
        });
        alert("Pet atualizado com sucesso!");
      } else {
        // CADASTRO (lógica já existente)
        await authRegister(data.name, data.email, phone, data.password);
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Sua conta foi criada com sucesso!",
          variant: "default",
        });
      }
      navigate("/meus-pets");
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-lg mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
              <CardDescription className="text-center">
                Crie sua conta para começar a usar o PetFinder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="name" 
                      {...register("name", { required: true })}
                      type="text" 
                      placeholder="Seu nome completo" 
                      className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="email" 
                      {...register("email", { 
                        required: true,
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                      type="email" 
                      placeholder="seu@email.com" 
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.type === "required" ? "Email é obrigatório" : "Email inválido"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      value={phone}
                      {...register("phone", { 
                        required: true,
                          validate: value =>{
                            const onlyNumbers = value.replace(/\D/g, "");
                            return onlyNumbers.length === 11 || "Digite um telefone válido com 9 dígitos após o DDD";
                          }
                      })}
                      onChange={e =>{
                        const formatted = formatPhone(e.target.value)
                        setPhone(formatted)
                      }
                      }
                      maxLength={15}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">Telefone é obrigatório</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="password" 
                      {...register("password", { 
                        required: true,
                        minLength: 6
                      })}
                      type="password" 
                      placeholder="********" 
                      className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.type === "required" 
                        ? "Senha é obrigatória" 
                        : "Senha deve ter no mínimo 6 caracteres"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme a Senha*</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="confirmPassword" 
                      {...register("confirmPassword", { 
                        required: true,
                        validate: value => value === password || "As senhas não coincidem"
                      })}
                      type="password" 
                      placeholder="********" 
                      className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.type === "required" 
                        ? "Confirmação de senha é obrigatória" 
                        : "As senhas não coincidem"}
                    </p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-petgreen hover:bg-opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-petgreen hover:underline">
                    Faça login
                  </Link>
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
