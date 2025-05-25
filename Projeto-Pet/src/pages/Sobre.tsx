
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, PawPrint, Search, QrCode, Smartphone, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {Swiper, SwiperSlide} from 'swiper/react'
import { Navigation } from 'swiper/modules';


export default function Sobre() {

  const { user, userData, logout, isAuthenticated, isAdmin } = useAuth();
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Sobre o PetFinder</h1>
          <p className="text-lg text-gray-600">
            Conheça nossa missão, como funcionamos e por que somos a melhor solução para 
            proteger seu pet e garantir que ele volte para casa caso se perca.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-petgreen mb-4">Nossa Missão</h2>
            <p className="text-gray-600 mb-6">
              O PetFinder nasceu da preocupação com os animais perdidos e da dificuldade que muitos tutores 
              enfrentam para encontrar seus pets quando eles se perdem. Nossa missão é criar uma comunidade 
              solidária, onde tutores possam recuperar seus pets com mais facilidade e rapidez.
            </p>
            <p className="text-gray-600">
              Utilizamos tecnologia moderna de QR Code para criar uma solução simples e eficaz. Qualquer pessoa 
              que encontrar um pet perdido pode escanear o código na coleira e entrar em contato diretamente com o tutor.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-petgreen mb-4">Por que usar o PetFinder?</h2>
            <ul className="space-y-3">
              {[
                "Maior chance de recuperar seu pet caso ele se perca",
                "Fácil de usar - qualquer pessoa pode escanear o QR Code",
                "Sem necessidade de aplicativos especiais",
                "Dados de contato protegidos - só aparecem quando necessário",
                "Serviço acessível e de baixo custo",
                "Plataforma brasileira, com suporte local"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-petgreen shrink-0 mr-2 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8">Como Funciona?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-petgreen-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-petgreen" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Cadastre seu Pet</h3>
              <p className="text-gray-600">
                Crie uma conta e cadastre as informações do seu pet em nossa plataforma.
                Adicione uma foto e detalhes importantes para identificação.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-petpurple-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-petpurple" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Receba seu QR Code</h3>
              <p className="text-gray-600">
                Após o cadastro, você recebe um QR Code único para seu pet. 
                Imprima e coloque na coleira ou em um pingente.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-petblue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-petblue" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Recuperação Rápida</h3>
              <p className="text-gray-600">
                Se seu pet se perder, quem o encontrar pode escanear o QR Code, 
                ver suas informações e entrar em contato com você diretamente.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-petgreen-light rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-bold mb-8">Depoimentos de Tutores</h2>

            <div className="relative max-w-6xl mx-auto">
              {/* setas */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 swiper-button-prev text-gray-800 cursor-pointer" />
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 swiper-button-next text-gray-800 cursor-pointer" />
              <Swiper
               autoplay={{
                  delay: 2000,       
                  disableOnInteraction: false}}
                loop={true}
                modules={[Navigation]}
                navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                spaceBetween={20}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                }}
                className="px-5"
              >
                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        "Meu cachorro Toby escapou durante uma tempestade. Graças ao QR Code do PetFinder, 
                        uma pessoa que o encontrou conseguiu entrar em contato comigo em menos de uma hora!"
                      </p>
                      <p className="font-medium">- Maria S., Igarassu Centro</p>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        "Minha gata costuma sair para explorar e às vezes vai longe demais. Com o PetFinder, 
                        tenho tranquilidade sabendo que se alguém a encontrar, poderá me contatar facilmente."
                      </p>
                      <p className="font-medium">- Pedro L., Nova Cruz</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam asperiores id sunt dolor impedit deleniti obcaecati dicta, consequuntur odit ut incidunt explicabo maxime nulla mollitia delectus? Ipsum delectus ea amet!
                      </p>
                      <p className="font-medium">- João M., Recife</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia vero illum culpa corporis molestiae quae fugit fuga, quisquam voluptatem dolores quo commodi. Illum, sapiente at. Nisi qui asperiores illum quod.
                      </p>
                      <p className="font-medium">- João M., Recife</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia vero illum culpa corporis molestiae quae fugit fuga, quisquam voluptatem dolores quo commodi. Illum, sapiente at. Nisi qui asperiores illum quod.
                      </p>
                      <p className="font-medium">- João M., Recife</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                      <p className="italic text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia vero illum culpa corporis molestiae quae fugit fuga, quisquam voluptatem dolores quo commodi. Illum, sapiente at. Nisi qui asperiores illum quod.
                      </p>
                      <p className="font-medium">- João M., Recife</p>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Pronto para proteger seu pet?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (

              <Button asChild className="bg-petgreen hover:bg-opacity-90 flex gap-2">
              <Link to="/cadastro">
                <Heart size={18} />
                <span>Cadastre-se Agora</span>
              </Link>
            </Button>
            )}
            
            <Button asChild variant="outline" className="border-petgreen text-petgreen hover:bg-petgreen hover:text-white">
              <Link to="/encontrar-pet">
                <Search size={18} className="mr-1" />
                <span>Encontrar um Pet</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
