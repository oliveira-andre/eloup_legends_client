import AdminSidebar from '../../components/admin-sidebar';
import './style.css';

export default function Dashboard() {
  return (
    <div className="antialiased flex h-screen overflow-hidden dashboard-container">
      <AdminSidebar />


      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

        <header className="h-20 bg-[#091428]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-8">
          <h2 className="text-xl font-bold text-white">Dashboard</h2>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <input type="text" placeholder="Buscar pedido #ID..." className="bg-[#1E2328] border border-gray-700 text-sm rounded-full pl-10 pr-4 py-2 text-white focus:border-lol-gold focus:outline-none w-64" />
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500"></i>
            </div>
            <button className="relative text-gray-400 hover:text-white transition">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-lol-gold transition-colors">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <i className="fa-solid fa-gamepad text-6xl text-lol-gold"></i>
              </div>
              <p className="text-lol-gray text-sm font-medium uppercase tracking-wider">Jobs Ativos</p>
              <h3 className="text-3xl font-bold text-white mt-1">42</h3>
              <p className="text-green-400 text-xs mt-2"><i className="fa-solid fa-arrow-up"></i> +12% essa semana</p>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-lol-gold transition-colors">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <i className="fa-solid fa-coins text-6xl text-lol-blue"></i>
              </div>
              <p className="text-lol-gray text-sm font-medium uppercase tracking-wider">Faturamento (Mês)</p>
              <h3 className="text-3xl font-bold text-white mt-1">R$ 15.2k</h3>
              <p className="text-green-400 text-xs mt-2"><i className="fa-solid fa-arrow-up"></i> +5% vs mês anterior</p>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-lol-gold transition-colors">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <i className="fa-solid fa-headset text-6xl text-purple-400"></i>
              </div>
              <p className="text-lol-gray text-sm font-medium uppercase tracking-wider">Jobbers Online</p>
              <h3 className="text-3xl font-bold text-white mt-1">18<span className="text-lg text-gray-500">/25</span></h3>
              <p className="text-lol-blue text-xs mt-2">72% da equipe ativa</p>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500 transition-colors">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <i className="fa-solid fa-clock text-6xl text-red-400"></i>
              </div>
              <p className="text-lol-gray text-sm font-medium uppercase tracking-wider">Fila de Espera</p>
              <h3 className="text-3xl font-bold text-white mt-1">5</h3>
              <p className="text-red-400 text-xs mt-2">Necessitam atenção</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 bg-lol-card border border-white/10 rounded-xl shadow-lg flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Últimos Pedidos (Jobs)</h3>
                  <p className="text-xs text-gray-500">Acompanhamento em tempo real</p>
                </div>
                <button className="text-xs bg-lol-blue/10 text-lol-blue px-3 py-1 rounded border border-lol-blue/20 hover:bg-lol-blue hover:text-black transition">
                  Ver Todos
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase bg-black/20 border-b border-white/5">
                      <th className="px-6 py-4 font-medium">ID / Serviço</th>
                      <th className="px-6 py-4 font-medium">Cliente</th>
                      <th className="px-6 py-4 font-medium">Progresso (Elos)</th>
                      <th className="px-6 py-4 font-medium">Jobber</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    <tr className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <span className="block text-white font-bold">#9821</span>
                        <span className="text-xs text-lol-blue">Elo Boosting</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">xXDragonXx</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Prata IV</span>
                          <i className="fa-solid fa-arrow-right text-xs text-lol-gold"></i>
                          <span className="text-lol-gold font-bold">Ouro IV</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                            <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Zed.png" alt="" />
                          </div>
                          <span className="text-gray-300">FakerBR</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Em Progresso</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <span className="block text-white font-bold">#9820</span>
                        <span className="text-xs text-purple-400">Duo Boost</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">AnaSupport</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600">Ouro I</span>
                          <i className="fa-solid fa-arrow-right text-xs text-lol-gold"></i>
                          <span className="text-cyan-400 font-bold">Platina IV</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                            <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Thresh.png" alt="" />
                          </div>
                          <span className="text-gray-300">MadLife</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">Concluído</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <span className="block text-white font-bold">#9819</span>
                        <span className="text-xs text-lol-blue">MD10</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">YasuoMain0/10</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Unranked</span>
                          <i className="fa-solid fa-arrow-right text-xs text-lol-gold"></i>
                          <span className="text-white font-bold">??</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-500 italic">-- Aguardando --</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">Pendente</span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/5 transition">
                      <td className="px-6 py-4">
                        <span className="block text-white font-bold">#9818</span>
                        <span className="text-xs text-lol-blue">Elo Boosting</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">TopGapOnly</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500">Platina II</span>
                          <i className="fa-solid fa-arrow-right text-xs text-lol-gold"></i>
                          <span className="text-blue-400 font-bold">Diamante IV</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                            <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Jax.png" alt="" />
                          </div>
                          <span className="text-gray-300">BonkMaster</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Em Progresso</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-8">

              <div className="bg-lol-card border border-white/10 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-trophy text-lol-gold"></i> Top Jobbers
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/LeeSin.png" className="w-10 h-10 rounded-full border border-lol-blue" />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#0A1428]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">LeeSec</p>
                        <p className="text-[10px] text-gray-400">Grão-Mestre</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lol-gold font-bold text-sm">85% WR</p>
                      <p className="text-[10px] text-gray-500">12 Jobs</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Ahri.png" className="w-10 h-10 rounded-full border border-purple-500" />
                          <div className="absolute -bottom-1 -right-1 bg-yellow-500 w-3 h-3 rounded-full border-2 border-[#0A1428]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">MidKing</p>
                        <p className="text-[10px] text-gray-400">Desafiante</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lol-gold font-bold text-sm">78% WR</p>
                      <p className="text-[10px] text-gray-500">8 Jobs</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src="https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Draven.png" className="w-10 h-10 rounded-full border border-gray-500" />
                          <div className="absolute -bottom-1 -right-1 bg-gray-500 w-3 h-3 rounded-full border-2 border-[#0A1428]"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">DravenGod</p>
                        <p className="text-[10px] text-gray-400">Mestre</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm">65% WR</p>
                      <p className="text-[10px] text-gray-500">Offline</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 border border-white/10 text-gray-400 text-xs rounded hover:bg-white/5 transition">
                  Gerenciar Equipe
                </button>
              </div>

              <div className="bg-lol-card border border-white/10 rounded-xl shadow-lg p-6 flex-1">
                <h3 className="text-lg font-bold text-white mb-4">Pedidos por Elo</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Ferro - Prata</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-lol-gold">Ouro - Platina</span>
                      <span className="text-white">35%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-lol-gold h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyan-400">Diamante+</span>
                      <span className="text-white">20%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}