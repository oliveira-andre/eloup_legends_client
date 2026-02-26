'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import AdminSidebar from '../../components/admin-sidebar';
import { jobs } from '../../services/jobs';
import { users } from '../../services/users';
import { Job } from '../../entities/Job';
import plainUnit from '../../utils/plainUnit';
import decimalUnit from '../../utils/decimalUnit';
import './style.css';
import { jobbers } from '@/app/services/jobbers';

export default function JobsPage() {
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const userResponse = await users.getMe();
    setUserRole(userResponse.role ?? '');
    let responseJobs: Job[] = [];

    if (userResponse.role !== 'admin') {
      if (userResponse.role === 'jober') {
        const responseJober = await jobbers.showByUserId(userResponse.id ?? '');
        responseJobs = await jobs.getAll({ jobberId: responseJober.id });
      } else {
        responseJobs = await jobs.getAll({ userId: userResponse.id });
      }
    } else {
     responseJobs = await jobs.getAll({});
    }
    setJobsData(responseJobs ?? []);
  }

  return (
    <div className="flex h-screen overflow-hidden services-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="h-20 bg-[#091428]/50 flex items-center justify-between px-8 border-b border-white/5">
          <h1 className="text-2xl font-bold text-white">Catálogo de Pedidos (Jobs)</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">Mostrando <span className="text-white font-bold">{jobsData.length} pedidos</span> ativos na plataforma.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Filtrar por nome..." className="bg-lol-input border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-lol-blue w-64" />
            </div>
          </div>

          <div className="bg-lol-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-5">Nome do Cliente</th>
                  <th className="px-6 py-5">Preço</th>
                  <th className="px-6 py-5 lg:table-cell">Serviço</th>
                  <th className="px-6 py-5">De</th>
                  <th className="px-6 py-5">Para</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Observação</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">

                {jobsData.map((job: Job) => (
                  <tr className="hover:bg-white/5 transition group" key={job.id}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-lol-gold transition">{job.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lol-gold font-mono font-bold italic">R$ {plainUnit(job.price)},{decimalUnit(job.price)}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-gray-400 text-xs max-w-xs line-clamp-2">{job.service.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lol-gold font-mono font-bold italic">
                        {job.currentElo.name}
                        {job.currentElo.has_rank && (
                          <span className="text-[10px] bg-lol-blue/10 text-lol-blue px-2 py-0.5 rounded inline-block mt-1">Rank {job.currentRank}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lol-gold font-mono font-bold italic">
                        {job.targetElo.name}
                        {job.targetElo.has_rank && (
                          <span className="text-[10px] bg-lol-blue/10 text-lol-blue px-2 py-0.5 rounded inline-block mt-1">Rank {job.rank}</span>
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {job.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          Pendente
                        </span>
                      )}
                      {job.status === 'paid' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          Pagamento Aprovado
                        </span>
                      )}
                      {job.status === 'in_progress' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          Em andamento
                        </span>
                      )}
                      {job.status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          Completo
                        </span>
                      )}
                      {job.status === 'cancelled' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                          Cancelado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-gray-400 text-xs max-w-xs line-clamp-2">{job.observation}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {userRole === 'admin' && (
                          <Link href={`/jobs/${job.id}`} role="button" className="w-8 h-8 rounded bg-gray-800 hover:bg-lol-blue transition text-white flex items-center justify-center cursor-pointer"><i className="fa-solid fa-pen text-xs"></i></Link>
                        )}

                        {userRole === 'user' && (
                          <Link href={`/jobs/${job.id}/reviews/create`} role="button" className="w-8 h-8 rounded bg-gray-800 hover:bg-lol-gold transition text-white flex items-center justify-center cursor-pointer" title="Avaliar serviço">
                            <i className="fa-solid fa-star text-xs"></i>
                          </Link>
                        )}
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