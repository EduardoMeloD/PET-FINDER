import { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, Info, CircleUser } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PetCardProps {
  pet: {
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
  };
  showQRCode?: boolean;
  onDetails?: () => void;
}

export function PetCard({ pet, showQRCode = true, onDetails }: PetCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };
    const qrRef = useRef<SVGSVGElement | null>(null);

    const petCode = pet.qrcodeUrl.split("/").pop() || pet.id;



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
    const petCode = pet.qrcodeUrl.split("/").pop() || pet.id;
    link.href = png;
    link.download = `qrcode-${petCode}.png`;
    link.click();
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
};



  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-52 overflow-hidden">
        <img
          src={pet.imagem || "/placeholder.svg"}
          alt={pet.nomePet}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-petgreen">{pet.nomePet}</h3>
            <p className="text-sm text-gray-500">{pet.tipo} • {pet.raca}</p>
          </div>
          {showQRCode && (
            <div className="w-16 h-16">
              <QRCodeSVG value={pet.qrcodeUrl} size={64} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="bg-petpurple-light p-1 rounded-full">
              <CircleUser size={16} className="text-petpurple" />
            </div>
            <span className="text-gray-600">{pet.sexo}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-petblue-light p-1 rounded-full">
              <Calendar size={16} className="text-petblue" />
            </div>
            <span className="text-gray-600">{formatDate(pet.dataNascimento)}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Info size={14} className="text-petgreen" /> Descrição
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">{pet.descricao}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button onClick={onDetails} variant="outline" size="sm" className="text-petgreen border-petgreen hover:bg-petgreen hover:text-white">
          Ver Detalhes
        </Button>
        
        {showQRCode && (
          <Button variant="ghost" size="sm" className="text-petgreen flex items-center gap-1" onClick={downloadQRCode}>
             <QRCodeSVG value={pet.qrcodeUrl} size={64} ref={qrRef} />
            <span>Baixar QR Code</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
