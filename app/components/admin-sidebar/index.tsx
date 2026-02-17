'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { users } from '@/app/services/users';

export default function AdminSidebar() {
  const pathname = usePathname();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);


  async function fetchUser() {
    try {
      const responseUser = await users.getMe();
      setName(responseUser.name);
      setRole(responseUser.role ?? '');
      setId(responseUser.id ?? '');
    } catch (error) {
      redirect('/login');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    toast.success('Logout realizado com sucesso');
    redirect('/login');
  }

  return (
    <aside className="w-64 bg-[#091428] border-r border-white/5 flex-shrink-0 hidden md:flex flex-col z-20">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="text-lol-blue text-2xl mr-3">
          <Image src="/favicon.png" alt="EloUp Legends" width={40} height={40} />
        </div>
        <span className="font-bold text-lg tracking-wider text-white">ELOUP <span className="text-lol-gold">ADMIN</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {role === 'admin' && (
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 
            ${pathname === '/dashboard' ?
              'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
              'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
            <i className="fa-solid fa-chart-pie w-5"></i>
            <span className="font-medium">Visão Geral</span>
          </Link>
        )}

        <Link href="/jobs" className={`flex items-center gap-3 px-4 py-3 ${pathname === '/jobs' ?
          'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
          'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
          <i className="fa-solid fa-scroll w-5 group-hover:text-lol-blue transition"></i>
          <span>Pedidos (Jobs)</span>
        </Link>

        {role === 'admin' && (
          <Link href="/services" className={`flex items-center gap-3 px-4 py-3 ${pathname === '/services' ?
            'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
            'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
            <i className="fa-solid fa-list w-5 group-hover:text-lol-blue transition"></i>
            <span>Serviços</span>
          </Link>
        )}

        {role === 'admin' && (
          <Link href="/jobbers" className={`flex items-center gap-3 px-4 py-3 ${pathname === '/jobbers' ?
            'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
            'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
            <i className="fa-solid fa-users w-5 group-hover:text-lol-blue transition"></i>
            <span>Jobbers / Boosters</span>
          </Link>
        )}

        {role === 'admin' && (
          <Link href="/elos" className={`flex items-center gap-3 px-4 py-3 ${pathname === '/elos' ?
            'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
            'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
            <i className="fa-solid fa-ranking-star w-5 group-hover:text-lol-blue transition"></i>
            <span>Elos & Preços</span>
          </Link>
        )}

        {role === 'admin' && (
          <Link href="/admin-reviews" className={`flex items-center gap-3 px-4 py-3 ${pathname === '/admin-reviews' ?
            'bg-gradient-to-r from-lol-gold/20 to-transparent border-l-4 border-lol-gold text-white rounded-r-lg transition' :
            'text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition'}`}>
            <i className="fa-solid fa-star w-5 group-hover:text-lol-blue transition"></i>
            <span>Avaliações</span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <Image src="/no-image.png" alt="Admin" width={40} height={40} className="w-10 h-10 rounded-full border border-lol-gold" />
          <div>
            <p className="text-sm font-bold text-white">{name}</p>
            <p className="text-xs text-green-400">Online</p>
          </div>

          <button onClick={() => logout()} className="text-xs text-red-400 hover:text-red-500 transition">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}