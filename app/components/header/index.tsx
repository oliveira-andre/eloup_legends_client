import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed w-full z-50 bg-[#091428]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <div className="flex items-center space-x-2">
            <div>
              <Image src="/favicon.png" alt="EloUp Legends" width={60} height={60} />
            </div>

            <span className="font-bold text-xl tracking-wider text-white">
              ELOUP <span className="text-lol-gold">LEGENDS</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-lol-gold font-medium border-b-2 border-lol-gold pb-1">Início</Link>
            <Link href="#servicos" className="text-gray-300 hover:text-white transition">Serviços</Link>
            <Link href="#como-funciona" className="text-gray-300 hover:text-white transition">Como Funciona</Link>
          </nav>

          <div>
            <Link href="/login" className="flex items-center gap-2 px-6 py-2 rounded-full border border-lol-blue text-lol-blue hover:bg-lol-blue hover:text-black transition font-semibold">
              <i className="fa-regular fa-user"></i> Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}