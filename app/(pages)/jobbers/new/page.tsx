'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import AdminSidebar from '../../../components/admin-sidebar';
import { elos } from '@/app/services/elos';
import { Elo } from '@/app/entities/Elo';
import './style.css';

export default function NewServicePage() {
  const [elosData, setElosData] = useState<Elo[]>([]);
  const [name, setName] = useState('');
  const [eloId, setEloId] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');
  const [picture, setPicture] = useState('');
  const [observation, setObservation] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  }

  useEffect(() => {
    fetchElos();
  }, []);

  async function fetchElos() {
    const responseElos = await elos.getAll();
    setElosData(responseElos ?? []);
  }

  return (
    <div className="flex h-screen overflow-hidden new-service-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-[#091428]/50 flex items-center px-8 border-b border-white/5">
          <h1 className="text-xl font-bold text-white">Cadastrar Novo Jobber / Booster</h1>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-8 bg-lol-card p-8 rounded-xl border border-white/5 shadow-2xl">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Nome do Jobber / Booster</label>
                  <input type="text" name="name" required placeholder="Ex: Elo Boost" className="w-full px-4 py-3 rounded transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Elo / Rank</label>
                  <select name="eloId" required className="w-full px-4 py-3 rounded transition">
                    <option value="">Selecione o Elo / Rank</option>
                    {elosData.map((elo) => (
                      <option key={elo.id} value={elo.id}>{elo.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-lol-gold mb-2">Rank</label>
                    <input type="number" name="rank" required placeholder="50" className="w-full px-4 py-3 rounded transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-lol-gold mb-2">Posição (Ordem)</label>
                    <input type="number" name="position" defaultValue="1" className="w-full px-4 py-3 rounded transition" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Foto de Perfil</label>
                  <input type="file" id="picture-url" name="picture" placeholder="https://imgur.com/..." className="w-full px-4 py-3 rounded transition" />
                </div>

                <div className="w-full h-40 bg-black/40 rounded border border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
                  {/* <img id="preview-img" src="" className="hidden w-full h-full object-cover" /> */}
                  <div id="preview-placeholder" className="text-gray-600 flex flex-col items-center">
                    <i className="fa-regular fa-image text-3xl mb-2"></i>
                    <span className="text-xs italic">Preview da Imagem</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Observação</label>
                  <textarea name="observation" rows={4} required placeholder="Explique como o jobber / booster funciona..." className="w-full px-4 py-3 rounded transition resize-none" />
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-circle-info mr-1"></i>
                O ID será gerado automaticamente como UUID.
              </p>

              <div className="flex gap-4 w-full md:w-auto">
                <Link href="/jobbers" className="flex-1 md:flex-none px-8 py-3 rounded font-bold text-gray-400 hover:text-white transition cursor-pointer">
                  Cancelar
                </Link>
                <button type="submit" className="flex-1 md:flex-none px-12 py-3 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-black rounded shadow-[0_0_20px_rgba(200,170,110,0.3)] hover:scale-105 transition transform cursor-pointer">
                  SALVAR JOBBER / BOOSTER
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}