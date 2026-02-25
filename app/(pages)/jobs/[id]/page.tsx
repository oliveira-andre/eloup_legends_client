'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';

import AdminSidebar from '../../../components/admin-sidebar';
import { jobs } from '@/app/services/jobs';
import { Elo } from '@/app/entities/Elo';
import { Service } from '@/app/entities/Service';
import { Jobber } from '@/app/entities/Jobber';
import { services } from '@/app/services/services';
import { elos } from '@/app/services/elos';
import { jobbers } from '@/app/services/jobbers';

import './style.css';

export default function ShowJobPage() {
  const { id } = useParams();
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [elosData, setElosData] = useState<Elo[]>([]);
  const [name, setName] = useState('');
  const [observation, setObservation] = useState('');
  const [currentRank, setCurrentRank] = useState('');
  const [rank, setRank] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [serviceId, setServiceId] = useState<string>('');
  const [currentEloId, setCurrentEloId] = useState<string>('');
  const [targetEloId, setTargetEloId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [jobberId, setJobberId] = useState<string>('');
  const [jobbersData, setJobbersData] = useState<Jobber[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await jobs.update({ id: id as string, name, observation, status, currentRank: Number(currentRank), rank: Number(rank), price: Number(price), serviceId, currentEloId, targetEloId, jobberId });
      toast.success('Serviço atualizado com sucesso');
      window.location.href = '/jobs';
    } catch (error) {
      toast.error('Erro ao atualizar Serviço');
    }
  }

  useEffect(() => {
    fetchJob();
    fetchServices();
    fetchElos();
    fetchJobbers();
  }, [id]);

  async function fetchJob() {
    const responseJob = await jobs.show(id as string);
    setName(responseJob?.name ?? '');
    setObservation(responseJob?.observation ?? '');
    setCurrentRank(responseJob?.currentRank ?? '');
    setRank(responseJob?.rank ?? '');
    setPrice(responseJob?.price ?? '');
    setStatus(responseJob?.status ?? '');
    setServiceId(responseJob?.serviceId ?? '');
    setCurrentEloId(responseJob?.currentEloId ?? '');
    setTargetEloId(responseJob?.targetEloId ?? '');
    setUserId(responseJob?.userId ?? '');
    setJobberId(responseJob?.joberId ?? '');
  }

  async function fetchServices() {
    const responseServices = await services.getAll();
    setServicesData(responseServices ?? []);
  }

  async function fetchElos() {
    const responseElos = await elos.getAll();
    setElosData(responseElos ?? []);
  }

  async function fetchJobbers() {
    const responseJobbers = await jobbers.getAll();
    setJobbersData(responseJobbers ?? []);
  }

  return (
    <div className="flex h-screen overflow-hidden new-service-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-[#091428]/50 flex items-center px-8 border-b border-white/5">
          <h1 className="text-xl font-bold text-white">Editar Serviço</h1>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-8 bg-lol-card p-8 rounded-xl border border-white/5 shadow-2xl">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Nome do Cliente</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Elo Boost"
                    className="w-full px-4 py-3 rounded transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Elo Atual</label>
                  <select
                    name="currentEloId"
                    value={currentEloId}
                    onChange={(e) => setCurrentEloId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded transition"
                  >
                    <option value="">Selecione um Elo</option>
                    {elosData.map((elo) => (
                      <option key={elo.id} value={elo.id}>{elo.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Elo Alvo</label>
                  <select
                    name="targetEloId"
                    value={targetEloId}
                    onChange={(e) => setTargetEloId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded transition"
                  >
                    <option value="">Selecione um Elo</option>
                    {elosData.map((elo) => (
                      <option key={elo.id} value={elo.id}>{elo.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Jobber / Booster</label>
                  <select
                    name="jobberId"
                    value={jobberId}
                    onChange={(e) => setJobberId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded transition"
                  >
                    <option value="">Selecione um Jobber / Booster</option>
                    {jobbersData.map((jobber) => (
                      <option key={jobber.id} value={jobber.id}>{jobber.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Preço</label>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="Ex: 100"
                    className="w-full px-4 py-3 rounded transition"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Rank Atual</label>
                  <input
                    type="number"
                    name="currentRank"
                    value={currentRank}
                    onChange={(e) => setCurrentRank(e.target.value)}
                    required
                    placeholder="Ex: Entrega em 24h"
                    className="w-full px-4 py-3 rounded transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-lol-gold mb-2">Rank Alvo</label>
                    <input
                      type="number"
                      name="rank"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      required
                      placeholder="Ex: 1"
                      className="w-full px-4 py-3 rounded transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Serviço</label>
                  <select
                    name="serviceId"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded transition"
                  >
                    <option value="">Selecione um serviço</option>
                    {servicesData.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lol-gold mb-2">Status</label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded transition"
                  >
                    <option value="">Selecione um status</option>
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em andamento</option>
                    <option value="completed">Completo</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                
              </div>

            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-circle-info mr-1"></i>
                O ID será gerado automaticamente como UUID.
              </p>

              <div className="flex gap-4 w-full md:w-auto">
                <Link href="/jobs" className="flex-1 md:flex-none px-8 py-3 rounded font-bold text-gray-400 hover:text-white transition cursor-pointer">
                  Cancelar
                </Link>
                <button type="submit" className="flex-1 md:flex-none px-12 py-3 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-black rounded shadow-[0_0_20px_rgba(200,170,110,0.3)] hover:scale-105 transition transform cursor-pointer">
                  SALVAR SERVIÇO
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}