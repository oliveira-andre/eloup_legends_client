"use client";

import { useState, useEffect } from "react";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { jobbers } from "../../services/jobbers";
import { Jobber } from "../../entities/Jobber";

import './style.css';
import { randomInt } from "crypto";

export default function BoostersPage() {
  const [boostersData, setBoostersData] = useState<Jobber[]>([]);

  useEffect(() => {
    fetchBoosters();
  }, []);

  async function fetchBoosters() {
    const responseBoosters = await jobbers.getAll();
    setBoostersData(responseBoosters ?? []);
  }

  return (
    <div className="flex min-h-screen items-center justify-center boosters-page-container">
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <Header />

        <section className="py-20 text-center mt-20">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">Elite <span className="text-lol-gold">EloUp</span></h1>
          <div className="w-20 h-1 bg-lol-gold mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto px-6 text-sm md:text-base">
            Conheça os profissionais responsáveis por levar sua conta ao topo. Jogadores selecionados rigorosamente entre os melhores do servidor.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">


            {boostersData.map((booster: Jobber) => (
              <div className="booster-card rounded-2xl p-6 text-center" key={booster.id}>
                <div className="mb-4">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}/${booster.picture}`}
                    className="w-24 h-24 rounded-full mx-auto border-2 border-lol-gold p-1 shadow-2xl" alt="Booster" />
                </div>
                <h3 className="font-bold text-lg text-white mb-4">{booster.name}</h3>

                <div className="flex items-center justify-center gap-3 bg-black/40 rounded-lg py-3 px-2">
                  {booster.elo.has_rank && (
                    <span className="text-2xl font-black text-gray-400">
                      {booster.rank == 1 ? 'I' : booster.rank == 2 ? 'II' : booster.rank == 3 ? 'III' : booster.rank == 4 ? 'IV' : ''}
                    </span>
                  )}
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}/${booster.elo.picture}`} className="elo-medal" alt="Elo" />
                </div>

                <div className="mt-6 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Performance</span>
                  <span className="text-xs text-lol-blue font-bold">{booster.jobs.length} Pedidos Concluídos</span>
                </div>
              </div>
            ))}

          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
