'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import AdminSidebar from '../../components/admin-sidebar';
import { elos } from '../../services/elos';
import { Elo } from '../../entities/Elo';
import './style.css';

export default function ServicesPage() {
  const [elosData, setElosData] = useState<Elo[]>([]);

  useEffect(() => {
    fetchElos();
  }, []);

  async function fetchElos() {
    const responseElos = await elos.getAll();
    setElosData(responseElos ?? []);
  }

  async function deleteElo(id: string) {
    if (!confirm('Tem certeza que deseja excluir este Elo / Rank?')) {
      return;
    }

    await elos.delete(id);
    fetchElos();
  }

  return (
    <div className="flex h-screen overflow-hidden services-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="h-20 bg-[#091428]/50 flex items-center justify-between px-8 border-b border-white/5">
          <h1 className="text-2xl font-bold text-white">Catálogo de Elos E Ranks</h1>

          <Link href="/elos/new" className="bg-lol-gold hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded flex items-center gap-2 transition transform active:scale-95 shadow-lg shadow-lol-gold/20">
            <i className="fa-solid fa-plus"></i>
            <span className="hidden sm:inline">Novo Elo / Rank</span>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">Mostrando <span className="text-white font-bold">{elosData.length} elos</span> ativos na plataforma.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Filtrar por nome..." className="bg-lol-input border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-lol-blue w-64" />
            </div>
          </div>

          <div className="bg-lol-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-5">Imagem</th>
                  <th className="px-6 py-5">Nome</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Tem Rank?</th>
                  <th className="px-6 py-5">Posição (Ordem)</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">

                {elosData.map((elo: Elo) => (
                  <tr className="hover:bg-white/5 transition group" key={elo.id}>
                    <td className="px-6 py-4">
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/${elo.picture}`}  className="service-img" alt={elo.name} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-lol-gold transition">{elo.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-lol-gold transition">{elo.has_rank ? 'Sim' : 'Não'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-lol-gold transition">{elo.position}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/elos/${elo.id}`} className="w-8 h-8 rounded bg-gray-800 hover:bg-lol-blue transition text-white flex items-center justify-center cursor-pointer">
                          <i className="fa-solid fa-pen text-xs"></i>
                        </Link>
                        <button onClick={() => deleteElo(elo.id)} className="w-8 h-8 rounded bg-gray-800 hover:bg-red-500 transition text-white cursor-pointer"><i className="fa-solid fa-trash text-xs"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-gray-500 text-xs">
            <span>Página 1 de 1</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/5 rounded border border-white/5 hover:bg-white/10">Anterior</button>
              <button className="px-3 py-1 bg-white/5 rounded border border-white/5 hover:bg-white/10">Próximo</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}