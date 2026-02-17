'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { auth } from '../../services/auth';
import { users } from '@/app/services/users';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);
  const router = useRouter();
  function togglePassword() {
    setVisiblePassword(!visiblePassword);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await auth.signIn({ email, password });

      localStorage.setItem('token', response.accessToken);
      toast.success("Login realizado com sucesso");
      const userResponse = await users.getMe();
      if (userResponse.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/jobs';
      }
    } catch (error) {
      toast.error("Credenciais inválidas");
      console.error(error);
    }
  }

  return (
    <div className="h-screen w-full flex overflow-hidden login-container">
      <div className="hidden md:block w-1/2 h-full relative login-bg">
        <div className="absolute inset-0 login-overlay"></div>
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h2 className="text-4xl font-bold mb-2">Domine o Rift</h2>
          <p className="text-lol-gold text-lg max-w-md">Junte-se a milhares de jogadores que já alcançaram o elo dos sonhos.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-8 relative bg-[#010a13]">

        <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-lol-gold transition flex items-center gap-2">
          <i className="fa-solid fa-arrow-left"></i> Voltar para Início
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center animate-pulse">
              <Image src="/favicon.png" alt="EloUp Legends" width={60} height={60} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Bem-vindo, Invocador</h1>
            <p className="text-gray-500 mt-2">Acesse sua conta</p>
          </div>

          {/* <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded border border-gray-700 hover:bg-[#5865F2] hover:border-[#5865F2] hover:text-white transition text-gray-300 bg-lol-input">
              <i className="fa-brands fa-discord"></i> Discord
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded border border-gray-700 hover:bg-[#D32936] hover:border-[#D32936] hover:text-white transition text-gray-300 bg-lol-input">
              <i className="fa-solid fa-gamepad"></i> Riot Games
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-600 text-sm">ou continue com email</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">E-mail ou Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-regular fa-envelope text-gray-500"></i>
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-400">Senha</label>
                {/* <a href="#" className="text-xs text-lol-blue hover:text-lol-gold transition">Esqueceu a senha?</a> */}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-gray-500"></i>
                </div>
                <input
                  type={visiblePassword ? 'text' : 'password'}
                  id="password"
                  className="w-full pl-10 pr-10 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-white transition" onClick={togglePassword}>
                    <i className="fa-regular fa-eye" id="eye-icon"></i>
                  </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-bold py-3 rounded hover:brightness-110 transition transform hover:scale-[1.01] shadow-[0_0_15px_rgba(200,170,110,0.3)]">
              ENTRAR NA PLATAFORMA
            </button>
          </form>

          {/* <p className="mt-8 text-center text-gray-500 text-sm">
            Ainda não tem uma conta?
            <a href="#" className="text-lol-gold font-bold hover:underline">Criar conta grátis</a>
          </p> */}
        </div>

        <div className="absolute bottom-4 text-xs text-gray-700">
          &copy; 2026 EloUp Legends. Protegido por reCAPTCHA.
        </div>
      </div>
    </div>
  );
}