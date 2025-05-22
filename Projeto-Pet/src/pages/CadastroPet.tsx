
import { useState, useEffect, useRef  } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PawPrint, CalendarDays, Upload, QrCode, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { auth, db } from "../pages/firebase";
import { doc, setDoc, getDoc} from "firebase/firestore";
import { Loader2 } from "lucide-react"; // no topo do arquivo

export default function CadastroPet() {
  const {user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [petCode, setPetCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const qrRef = useRef<SVGSVGElement | null>(null);
  const [hasPets, setHasPets] = useState(false);





  
 
  const watchFile = watch("imagem");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const generateUniquePetCode = async (): Promise<string> => {
    let codeExists = true;
    let code = "";
  
    while (codeExists) {
      code = "PET" + Math.floor(100000 + Math.random() * 900000); // ex: PET123456
      const docRef = doc(db, "pets", code);
      const docSnap = await getDoc(docRef);
      codeExists = docSnap.exists();
    }
  
    return code;
  };

  const onSubmit = async (data: any) => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Upload image to imgbb
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

      const imageUrl = result.data.url;

      // Gerar código único para o pet
      const uniqueCode = await generateUniquePetCode();

      // Salvar dados no Firestore
      await setDoc(doc(db, "pets", uniqueCode), {
        nomePet: data.nomePet,
        tipo: data.tipo,
        raca: data.raca,
        cor: data.cor,
        sexo: data.sexo,
        dataNascimento: data.dataNascimento,
        descricao: data.descricao,
        imagemUrl: imageUrl,
        ownerId: user.uid,
        petCode: uniqueCode,
        createdAt: new Date(),
      });

      setPetCode(uniqueCode);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      alert("Ocorreu um erro ao cadastrar o pet. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    const svg = qrRef.current;
  
    if (!svg) {
      alert("QR Code não encontrado.");
      return;
    }
  
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = png;
      link.download = `qrcode-${petCode}.png`;
      link.click();
    };
  
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
  
  

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Cadastrar Pet</CardTitle>
                <CardDescription className="text-center">
                  Registre seu pet para gerar um QR Code único
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomePet">Nome do Pet</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <PawPrint className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        id="nomePet" 
                        {...register("nomePet", { required: true })}
                        placeholder="Nome do seu pet" 
                        className={`pl-10 ${errors.nomePet ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.nomePet && (
                      <p className="text-red-500 text-xs mt-1">Nome do pet é obrigatório</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Controller
                        name="tipo"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cachorro">Cachorro</SelectItem>
                              <SelectItem value="Gato">Gato</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tipo && (
                        <p className="text-red-500 text-xs mt-1">Tipo é obrigatório</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="raca">Raça</Label>
                      <Input
                        id="raca"
                        {...register("raca", { required: true })}
                        placeholder="Raça do seu pet"
                        className={errors.raca ? "border-red-500" : ""}
                      />
                      {errors.raca && (
                        <p className="text-red-500 text-xs mt-1">Raça é obrigatória</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cor">Cor</Label>
                      <Input
                        id="cor"
                        {...register("cor", { required: true })}
                        placeholder="Cor do seu pet"
                        className={errors.cor ? "border-red-500" : ""}
                      />
                      {errors.cor && (
                        <p className="text-red-500 text-xs mt-1">Cor é obrigatória</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo</Label>
                      <Controller
                        name="sexo"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Macho" id="macho" />
                              <Label htmlFor="macho">Macho</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Fêmea" id="femea" />
                              <Label htmlFor="femea">Fêmea</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                      {errors.sexo && (
                        <p className="text-red-500 text-xs mt-1">Sexo é obrigatório</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarDays className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="dataNascimento"
                        {...register("dataNascimento", { required: true })}
                        type="date"
                        className={`pl-10 ${errors.dataNascimento ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.dataNascimento && (
                      <p className="text-red-500 text-xs mt-1">Data de nascimento é obrigatória</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      {...register("descricao", { required: true })}
                      placeholder="Descreva características importantes do seu pet"
                      className={errors.descricao ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.descricao && (
                      <p className="text-red-500 text-xs mt-1">Descrição é obrigatória</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imagem">Imagem do Pet</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Upload className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="imagem"
                            type="file"
                            accept="image/*"
                            className={`pl-10 ${errors.imagem ? "border-red-500" : ""}`}
                            {...register("imagem", { required: true })}
                            onChange={handleImageChange}
                          />
                        </div>
                        {errors.imagem && (
                          <p className="text-red-500 text-xs mt-1">Imagem é obrigatória</p>
                        )}
                      </div>
                      
                      <div className="flex justify-center">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-32 w-32 bg-gray-100 flex items-center justify-center rounded-md">
                            <PawPrint className="h-10 w-10 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
  type="submit" 
  className="w-full bg-petgreen hover:bg-opacity-90 flex items-center justify-center gap-2" 
  disabled={isLoading}
>
  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
  {isLoading ? "Cadastrando..." : "Cadastrar Pet"}
</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-petgreen">
                  Pet Cadastrado com Sucesso!
                </CardTitle>
                <CardDescription className="text-center">
                  Seu pet foi registrado e agora possui um QR Code único que pode ser usado para identificá-lo.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-petgreen-light p-8 rounded-lg mb-4">
                <QRCodeSVG value={`https://projeto-pet.netlify.app/encontrar?codigo=${petCode}`} ref={qrRef} />
                </div>
                <div className="text-center">
                  <p className="font-medium">Código do Pet:</p>
                  <p className="text-xl font-bold text-petgreen mb-4">{petCode}</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Escaneie este QR Code para obter informações sobre o pet caso ele esteja perdido.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-petgreen hover:bg-opacity-90 flex items-center gap-2" onClick={downloadQRCode}>
                      <QrCode size={18} />
                      <span>Baixar QR Code</span>
                    </Button>
                      <Link to= "/meus-pets"
                        className="inline-flex items-center px-4 py-2 border border-petgreen text-petgreen hover:bg-petgreen hover:text-white rounded">
                        Ver Página do Pet
                      </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
        
                <Button
                  variant="ghost"
                  className="text-petgreen"
                  onClick={() => setIsSubmitted(false)}
                >
                  Cadastrar Outro Pet
                </Button>

              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
