"use client";

import { useState, useEffect } from "react";

import Header from "../components/header";
import Footer from "../components/footer";
import { services } from "../services/services";
import { Service } from "../entities/Service";
import plainUnit from "../utils/plainUnit";
import decimalUnit from "../utils/decimalUnit";

export default function Home() {
  const [servicesData, setServicesData] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const responseServices = await services.getAll();
    setServicesData(responseServices ?? []);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <Header />

        <section className="hero-bg h-screen flex items-center justify-center relative pt-20 w-full">
          <div className="text-center max-w-4xl px-4">
            <span className="uppercase tracking-[0.2em] text-lol-blue text-sm font-bold mb-4 block animate-pulse">Chegue ao Desafiante</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Alcance o seu tão <br />
              <span className="text-gradient">sonhado Elo</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Serviço profissional de Elo Boosting e Coaching. Segurança máxima, jogadores Desafiantes e garantia de satisfação.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#servicos" className="px-8 py-4 bg-lol-gold text-black font-bold rounded hover:bg-yellow-500 transition shadow-[0_0_15px_rgba(200,170,110,0.5)]">
                Ver Serviços
              </a>
              <a href="#" className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded hover:bg-white/10 transition">
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce text-gray-500">
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </section>

        <section id="servicos" className="py-24 bg-[#010a13] w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossos Serviços</h2>
              <div className="w-24 h-1 bg-lol-gold mx-auto"></div>
              <p className="text-gray-400 mt-4">Escolha a melhor opção para subir de ranking hoje mesmo.</p>
            </div>

            <div id="services-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicesData.map((service: Service) => (
                <div className="bg-[#0A1428] rounded-xl overflow-hidden border border-gray-800 hover:border-lol-gold transition-all duration-300 hover:scale-105 group shadow-lg" key={service.id}>
                    <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${service.picture}`} alt={service.name} className="w-full h-full object-cover object-top" />
                        <div className="absolute top-2 right-2 bg-lol-gold text-black text-xs font-bold px-2 py-1 rounded">
                            {service.tagline}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                        <p className="text-gray-400 text-sm mb-6 h-16 leading-relaxed">
                            {service.description}
                        </p>
                        <div className="flex items-end justify-between border-t border-gray-700 pt-4">
                            <div>
                                <span className="text-xs text-gray-500 block">A partir de</span>
                                <span className="text-2xl font-bold text-lol-blue">R$ {plainUnit(service.price)},{decimalUnit(service.price)}</span>
                                {/* <span className="text-xs text-gray-400"> /Partida</span> */}
                            </div>
                            <button className="bg-transparent border border-lol-gold text-lol-gold hover:bg-lol-gold hover:text-black font-bold py-2 px-4 rounded transition cursor-pointer">
                                Contratar
                            </button>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-20 bg-gradient-to-b from-[#010a13] to-[#091428] w-full">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-lol-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 text-lol-blue text-2xl">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Seguro</h3>
              <p className="text-gray-400">Utilizamos VPN e modo offline para garantir a segurança da sua conta durante todo o processo.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-lol-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-lol-gold text-2xl">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Entrega Rápida</h3>
              <p className="text-gray-400">Nossos boosters jogam mais de 8 horas por dia para entregar seu elo no menor tempo possível.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 text-2xl">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Suporte 24/7</h3>
              <p className="text-gray-400">Dúvidas? Nossa equipe de suporte está disponível via chat ou WhatsApp a qualquer momento.</p>
            </div>
          </div>
        </section>


      <Footer />
      </main>
    </div>
  );
}
