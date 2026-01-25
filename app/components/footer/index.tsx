import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#050b14] border-t border-white/5 pt-16 pb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/favicon.png" alt="EloUp Legends" width={60} height={60} />

              <span className="font-bold text-lg text-white">ELOUP LEGENDS</span>
            </div>
            <p className="text-gray-500 text-sm">
              Líderes em serviços de boosting e coaching no Brasil. Alcance o topo com quem entende do jogo.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-lol-gold">Início</a></li>
              <li><a href="#" className="hover:text-lol-gold">Meus Pedidos</a></li>
              <li><a href="#" className="hover:text-lol-gold">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-lol-gold">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contato Profissional</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><i className="fa-regular fa-envelope mr-2"></i> contato@elouplegends.com.br</li>
              <li><i className="fa-brands fa-whatsapp mr-2"></i> (11) 99999-9999</li>
              <li><i className="fa-brands fa-discord mr-2"></i> Discord Server</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Pagamento Seguro</h4>
            <div className="flex gap-2 text-2xl text-gray-400">
              <i className="fa-brands fa-cc-visa hover:text-white"></i>
              <i className="fa-brands fa-cc-mastercard hover:text-white"></i>
              <i className="fa-brands fa-pix hover:text-emerald-400"></i>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm text-center md:text-left">
            &copy; <span id="year"></span> EloUp Legends. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            CNPJ: 12.345.678/0001-90
          </p>
        </div>
      </div>
    </footer>
  );
}