'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

import Header from '../../components/header';
import Footer from '../../components/footer';
import { elos } from '../../services/elos';
import { services } from '../../services/services';
import { auth } from '../../services/auth';
import { jobs } from '../../services/jobs';
import { payments } from '../../services/payments';
import { Elo } from '@/app/entities/Elo';
import { Service } from '@/app/entities/Service';
import plainUnit from '@/app/utils/plainUnit';
import decimalUnit from '@/app/utils/decimalUnit';

import './style.css';

export default function ContratarPage() {
  const searchParams = useSearchParams();
  const serviceIdFromUrl = searchParams.get('serviceId');
  
  const [elosData, setElosData] = useState<Elo[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // User fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);
  
  // Job fields
  const [name, setName] = useState('');
  const [observation, setObservation] = useState('');
  const [currentEloId, setCurrentEloId] = useState<string>('');
  const [targetEloId, setTargetEloId] = useState<string>('');
  const [currentRank, setCurrentRank] = useState<string>('');
  const [targetRank, setTargetRank] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  // PIX payment state
  const [pixQrCode, setPixQrCode] = useState<string>('');
  const [pixCopyPaste, setPixCopyPaste] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutes in seconds
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchElos();
    fetchServices();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [currentEloId, targetEloId, currentRank, targetRank, serviceId]);

  async function fetchElos() {
    const responseElos = await elos.getAll();
    setElosData(responseElos ?? []);
  }

  async function fetchServices() {
    const responseServices = await services.getAll();
    setServicesData(responseServices ?? []);
    
    // Pre-select service if serviceId is in URL
    if (serviceIdFromUrl && responseServices) {
      const preSelectedService = responseServices.find((s: Service) => s.id === serviceIdFromUrl);
      if (preSelectedService) {
        setServiceId(serviceIdFromUrl);
        setSelectedService(preSelectedService);
      }
    }
  }

  function calculatePrice() {
    if (!currentEloId || !targetEloId || !serviceId) {
      setPrice(0);
      return;
    }

    const currentEloData = elosData.find(e => e.id === currentEloId);
    const targetEloData = elosData.find(e => e.id === targetEloId);
    const service = servicesData.find(s => s.id === serviceId);

    if (!currentEloData || !targetEloData || !service) {
      setPrice(0);
      return;
    }

    const currentRankNum = Number(currentRank) || 4; // Default to IV if not selected
    const targetRankNum = Number(targetRank) || 1;   // Default to I if not selected

    // Get all elos sorted by position
    const sortedElos = [...elosData].sort((a, b) => a.position - b.position);
    
    // Find elos in the path (from current to target, inclusive)
    const elosInPath = sortedElos.filter(
      elo => elo.position >= currentEloData.position && elo.position <= targetEloData.position
    );

    let calculatedPrice = 0;

    // If same elo, just calculate rank difference
    if (currentEloData.id === targetEloData.id) {
      if (currentEloData.has_rank) {
        // Ranks go from IV (4) to I (1), so currentRank - targetRank = steps
        const ranksToClimb = Math.max(currentRankNum - targetRankNum, 0);
        const eloPrice = currentEloData.prices?.[serviceId] || service.price;
        calculatedPrice = ranksToClimb * eloPrice;
      }
    } else {
      // Different elos - iterate through each elo in the path
      // When crossing elos, we need to count the promotion step as well
      // Example: Iron I to Bronze IV = 1 step (the promotion itself)
      // Example: Iron IV to Bronze IV = 4 steps (IV->III->II->I + promotion)
      
      for (let i = 0; i < elosInPath.length; i++) {
        const elo = elosInPath[i];
        const eloPrice = elo.prices?.[serviceId] || service.price;
        const isFirstElo = elo.id === currentEloData.id;
        const isLastElo = elo.id === targetEloData.id;

        let ranksInThisElo = 0;

        if (isFirstElo) {
          // Current elo: count ranks from currentRank to promotion (includes the promotion step)
          if (elo.has_rank) {
            // From currentRank to next elo = currentRankNum steps
            // E.g., from IV=4: IV->III->II->I->nextElo = 4 steps
            // E.g., from I=1: I->nextElo = 1 step
            ranksInThisElo = currentRankNum;
          } else {
            // Unranked elos (Master, GM, Challenger) count as 1 unit
            ranksInThisElo = 1;
          }
        } else if (isLastElo) {
          // Target elo: count ranks from IV (rank 4) to targetRank
          // We already entered this elo, so just count internal ranks
          if (elo.has_rank) {
            // From IV=4 down to targetRank (e.g., to IV=4 is 0 steps, to I=1 is 3 steps)
            ranksInThisElo = 4 - targetRankNum;
          } else {
            // Unranked elos count as 1 unit (we already counted entering)
            ranksInThisElo = 0;
          }
        } else {
          // Intermediate elo: count all 4 ranks (entering + IV -> III -> II -> I)
          if (elo.has_rank) {
            ranksInThisElo = 4;
          } else {
            ranksInThisElo = 1;
          }
        }

        calculatedPrice += ranksInThisElo * eloPrice;
      }
    }

    setPrice(Math.max(calculatedPrice, 0));
  }

  const currentElo = elosData.find(e => e.id === currentEloId);
  const targetElo = elosData.find(e => e.id === targetEloId);

  function togglePassword() {
    setVisiblePassword(!visiblePassword);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (!currentEloId || !targetEloId || !serviceId) {
      toast.error('Por favor, selecione o elo atual, elo alvo e serviço');
      return;
    }

    setIsSubmitting(true);

    try {
      // First, sign up the user
      const signUpResponse = await auth.signUp({ name, email, password });
      const userId = signUpResponse.id;

      if (!userId) {
        toast.error('Erro ao criar usuário');
        setIsSubmitting(false);
        return;
      }

      // Then, create the job with the new user ID
      const jobResponse = await jobs.create({
        name,
        observation,
        currentRank: Number(currentRank) || 0,
        rank: Number(targetRank) || 0,
        price,
        serviceId,
        currentEloId,
        targetEloId,
        userId,
      });

      const createdJobId = jobResponse.id;
      setJobId(createdJobId);

      // Create PIX payment
      const pixResponse = await payments.createPix({
        external_reference: createdJobId,
        email: email,
      });

      setPixQrCode(pixResponse.data.pix.qr_code_base64);
      setPixCopyPaste(pixResponse.data.pix.qr_code);
      
      // Move to PIX payment step
      setStep(4);
      
      // Start payment status polling
      startPaymentPolling(createdJobId);
      
      // Start countdown timer
      startCountdownTimer();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar pedido. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startPaymentPolling(jobIdToCheck: string) {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await payments.getStatus(jobIdToCheck);
        setPaymentStatus(statusResponse.status);

        if (statusResponse.status === 'approved') {
          // Payment approved - move to success step
          stopPolling();
          setStep(5);
        } else if (statusResponse.status === 'rejected' || statusResponse.status === 'cancelled') {
          // Payment failed
          stopPolling();
          toast.error('Pagamento não aprovado. Tente novamente.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);
  }

  function startCountdownTimer() {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setTimeRemaining(30 * 60); // Reset to 30 minutes

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopPolling();
          toast.error('Tempo para pagamento expirado.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopPolling() {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  async function copyPixCode() {
    try {
      await navigator.clipboard.writeText(pixCopyPaste);
      toast.success('Código PIX copiado!');
    } catch (error) {
      toast.error('Erro ao copiar código');
    }
  }

  function nextStep() {
    if (step === 3) {
      if (!email || !password || !confirmPassword) {
        toast.error('Por favor, preencha todos os campos');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
    }

    if (step === 2) {
      if (!serviceId) {
        toast.error('Por favor, selecione o serviço');
        return;
      }
    }

    if (step === 1) {
      if (!currentEloId || !targetEloId) {
        toast.error('Por favor, selecione o elo atual e o elo alvo');
        return;
      }
    }
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  return (
    <div className="flex min-h-screen flex-col contratar-container">
      <Header />

      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-12">
            <span className="uppercase tracking-[0.2em] text-lol-blue text-sm font-bold mb-4 block">Contrate Agora</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Monte seu <span className="text-gradient">Pedido</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Selecione seu elo atual, o elo desejado e deixe nossos boosters profissionais cuidarem do resto.
            </p>
          </div>

          {/* Progress Steps */}
          {step < 5 && (
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-lol-gold text-black' : 'bg-gray-700 text-gray-400'}`}>1</div>
                <div className={`w-8 md:w-16 h-1 ${step >= 2 ? 'bg-lol-gold' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-lol-gold text-black' : 'bg-gray-700 text-gray-400'}`}>2</div>
                <div className={`w-8 md:w-16 h-1 ${step >= 3 ? 'bg-lol-gold' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-lol-gold text-black' : 'bg-gray-700 text-gray-400'}`}>3</div>
                <div className={`w-8 md:w-16 h-1 ${step >= 4 ? 'bg-lol-gold' : 'bg-gray-700'}`}></div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= 4 ? 'bg-lol-gold text-black' : 'bg-gray-700 text-gray-400'}`}>4</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Elo Selection */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  
                  {/* Current Elo */}
                  <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-circle-down text-red-400"></i>
                      Elo Atual
                    </h3>
                    
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {elosData.map((elo) => (
                        <button
                          key={elo.id}
                          type="button"
                          onClick={() => {
                            setCurrentEloId(elo.id);
                            if (!elo.has_rank) setCurrentRank('');
                          }}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            currentEloId === elo.id 
                              ? 'border-lol-gold bg-lol-gold/10 shadow-[0_0_15px_rgba(200,170,110,0.3)]' 
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${elo.picture}`} 
                            alt={elo.name}
                            className="w-full h-16 object-contain"
                          />
                          <p className="text-xs text-center mt-2 text-gray-300 font-medium">{elo.name}</p>
                        </button>
                      ))}
                    </div>

                    
                    {/* Current Elo Display */}
                    {currentElo && (
                      <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-white/5">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${currentElo.picture}`} 
                          alt={currentElo.name}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <p className="text-lg font-bold text-white">{currentElo.name}</p>
                          {currentElo.has_rank && (
                            <div className="mt-2">
                              <label className="text-xs text-gray-400 block mb-1">Divisão</label>
                              <select
                                value={currentRank}
                                onChange={(e) => setCurrentRank(e.target.value)}
                                className="px-3 py-2 bg-lol-input border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-lol-gold"
                              >
                                <option value="">Selecione</option>
                                <option value="4">IV</option>
                                <option value="3">III</option>
                                <option value="2">II</option>
                                <option value="1">I</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Target Elo */}
                  <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-circle-up text-green-400"></i>
                      Elo Desejado
                    </h3>
                    
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {elosData.map((elo) => (
                        <button
                          key={elo.id}
                          type="button"
                          onClick={() => {
                            setTargetEloId(elo.id);
                            if (!elo.has_rank) setTargetRank('');
                          }}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                            targetEloId === elo.id 
                              ? 'border-lol-blue bg-lol-blue/10 shadow-[0_0_15px_rgba(10,200,185,0.3)]' 
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${elo.picture}`} 
                            alt={elo.name}
                            className="w-full h-16 object-contain"
                          />
                          <p className="text-xs text-center mt-2 text-gray-300 font-medium">{elo.name}</p>
                        </button>
                      ))}
                    </div>

                    {/* Target Elo Display */}
                    {targetElo && (
                      <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-white/5">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${targetElo.picture}`} 
                          alt={targetElo.name}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <p className="text-lg font-bold text-white">{targetElo.name}</p>
                          {targetElo.has_rank && (
                            <div className="mt-2">
                              <label className="text-xs text-gray-400 block mb-1">Divisão</label>
                              <select
                                value={targetRank}
                                onChange={(e) => setTargetRank(e.target.value)}
                                className="px-3 py-2 bg-lol-input border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-lol-gold"
                              >
                                <option value="">Selecione</option>
                                <option value="4">IV</option>
                                <option value="3">III</option>
                                <option value="2">II</option>
                                <option value="1">I</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elo Journey Visual */}
                {currentElo && targetElo && (
                  <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-2xl mb-8">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${currentElo.picture}`} 
                          alt={currentElo.name}
                          className="w-24 h-24 object-contain mx-auto"
                        />
                        <p className="text-white font-bold mt-2">{currentElo.name}</p>
                        {currentElo.has_rank && currentRank && (
                          <span className="text-xs bg-lol-gold/20 text-lol-gold px-2 py-1 rounded mt-1 inline-block">
                            Divisão {currentRank === '1' ? 'I' : currentRank === '2' ? 'II' : currentRank === '3' ? 'III' : 'IV'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        <i className="fa-solid fa-arrow-right text-3xl text-lol-gold animate-pulse"></i>
                        <span className="text-xs text-gray-500 mt-2">Boost</span>
                      </div>

                      <div className="text-center">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${targetElo.picture}`} 
                          alt={targetElo.name}
                          className="w-24 h-24 object-contain mx-auto"
                        />
                        <p className="text-white font-bold mt-2">{targetElo.name}</p>
                        {targetElo.has_rank && targetRank && (
                          <span className="text-xs bg-lol-blue/20 text-lol-blue px-2 py-1 rounded mt-1 inline-block">
                            Divisão {targetRank === '1' ? 'I' : targetRank === '2' ? 'II' : targetRank === '3' ? 'III' : 'IV'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between max-w-xl mx-auto">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="px-8 py-3 bg-transparent border border-gray-600 text-white font-bold rounded hover:bg-white/10 transition"
                  >
                    <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
                  </button>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-bold rounded hover:brightness-110 transition transform hover:scale-[1.02] shadow-[0_0_15px_rgba(200,170,110,0.3)]"
                  >
                    Próximo <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            )}


            {/* Step 2: Service & Confirmation */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Service Selection */}
                  <div className="lg:col-span-2 bg-lol-card border border-white/10 rounded-xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-gamepad text-lol-gold"></i>
                      Escolha o Serviço
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {servicesData.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setServiceId(service.id);
                            setSelectedService(service);
                          }}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            serviceId === service.id 
                              ? 'border-lol-gold bg-lol-gold/10' 
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${service.picture}`} 
                              alt={service.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-bold text-white">{service.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{service.tagline}</p>
                              <p className="text-lol-blue font-bold mt-2">
                                A partir de R$ {plainUnit(service.price)},{decimalUnit(service.price)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Observation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Observações <span className="text-gray-600">(opcional)</span>
                      </label>
                      <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Alguma observação especial? Horários preferidos, campeões que deseja jogar, etc."
                        rows={4}
                        className="w-full px-4 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-lol-card border border-white/10 rounded-xl p-6 shadow-2xl h-fit sticky top-28">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-receipt text-lol-gold"></i>
                      Resumo do Pedido
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-gray-400">Cliente</span>
                        <span className="text-white font-medium">{name || '-'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-gray-400">E-mail</span>
                        <span className="text-white font-medium text-sm">{email || '-'}</span>
                      </div>

                      {currentElo && (
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Elo Atual</span>
                          <div className="flex items-center gap-2">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${currentElo.picture}`} 
                              alt={currentElo.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-white font-medium">
                              {currentElo.name}
                              {currentElo.has_rank && currentRank && ` ${currentRank === '1' ? 'I' : currentRank === '2' ? 'II' : currentRank === '3' ? 'III' : 'IV'}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {targetElo && (
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Elo Alvo</span>
                          <div className="flex items-center gap-2">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${targetElo.picture}`} 
                              alt={targetElo.name}
                              className="w-8 h-8 object-contain"
                            />
                            <span className="text-white font-medium">
                              {targetElo.name}
                              {targetElo.has_rank && targetRank && ` ${targetRank === '1' ? 'I' : targetRank === '2' ? 'II' : targetRank === '3' ? 'III' : 'IV'}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedService && (
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Serviço</span>
                          <span className="text-white font-medium">{selectedService.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total</span>
                        <span className="text-3xl font-black text-lol-gold">
                          R$ {plainUnit(price || 0)},{decimalUnit(price || 0)}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      className="w-full py-4 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-bold rounded hover:brightness-110 transition transform hover:scale-[1.02] shadow-[0_0_15px_rgba(200,170,110,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={nextStep}
                    >
                      <>
                        <i className="fa-solid fa-check mr-2"></i>
                        Realizar Pedido
                      </>
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      <i className="fa-solid fa-shield-halved mr-1"></i>
                      Pagamento seguro e 100% garantido
                    </p>
                  </div>
                </div>

                <div className="flex justify-start mt-8">
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="px-8 py-3 bg-transparent border border-gray-600 text-white font-bold rounded hover:bg-white/10 transition"
                  >
                    <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
                  </button>
                </div>
              </div>
            )}


            {/* Step 3: Account Info */}
            {step === 3 && (
              <>
                <div className="bg-lol-card border border-white/10 rounded-xl p-8 max-w-xl mx-auto shadow-2xl animate-fadeIn">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <i className="fa-regular fa-user text-lol-gold"></i>
                    Criar Conta
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Nome Completo</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-regular fa-user text-gray-500"></i>
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Seu nome completo"
                          className="w-full pl-10 pr-4 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-regular fa-envelope text-gray-500"></i>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="seu@email.com"
                          className="w-full pl-10 pr-4 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-solid fa-lock text-gray-500"></i>
                        </div>
                        <input
                          type={visiblePassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-white transition" onClick={togglePassword}>
                          <i className={`fa-regular ${visiblePassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirmar Senha</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fa-solid fa-lock text-gray-500"></i>
                        </div>
                        <input
                          type={visiblePassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-lol-input border border-gray-700 rounded text-white focus:outline-none focus:border-lol-gold focus:ring-1 focus:ring-lol-gold transition placeholder-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting || !serviceId}
                      className="w-full py-4 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-bold rounded hover:brightness-110 transition transform hover:scale-[1.02] shadow-[0_0_15px_rgba(200,170,110,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          Processando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check mr-2"></i>
                          Realizar Pedido
                        </>
                      )}
                    </button>

                  </div>
                </div>

                <div className="mt-8 flex justify-start">
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-transparent border border-gray-600 text-white font-bold rounded hover:bg-white/10 transition"
                  >
                    <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
                  </button>
                </div>
              </>
            )}

            {/* Step 4: PIX Payment */}
            {step === 4 && (
              <div className="animate-fadeIn max-w-xl mx-auto">
                <div className="bg-lol-card border border-white/10 rounded-xl p-8 shadow-2xl text-center">
                  
                  {/* Timer */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 300 ? 'bg-red-500/20 text-red-400' : 'bg-lol-gold/20 text-lol-gold'}`}>
                      <i className="fa-solid fa-clock"></i>
                      <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">Tempo restante para pagamento</p>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    <i className="fa-brands fa-pix text-lol-blue mr-2"></i>
                    Pagamento via PIX
                  </h2>
                  <p className="text-gray-400 mb-6">Escaneie o QR Code ou copie o código PIX para realizar o pagamento.</p>

                  {/* Price */}
                  <div className="bg-black/30 rounded-lg p-4 mb-6 inline-block">
                    <span className="text-gray-400 text-sm">Valor a pagar:</span>
                    <div className="text-3xl font-black text-lol-gold">
                      R$ {plainUnit(price || 0)},{decimalUnit(price || 0)}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="mb-6">
                    <div className="bg-white p-4 rounded-xl inline-block">
                      {pixQrCode && (
                        <img 
                          src={pixQrCode.startsWith('data:') ? pixQrCode : `data:image/png;base64,${pixQrCode}`}
                          alt="QR Code PIX"
                          className="w-48 h-48 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  {/* Copy PIX Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Código PIX (Copia e Cola)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pixCopyPaste}
                        readOnly
                        className="flex-1 px-4 py-3 bg-lol-input border border-gray-700 rounded text-white text-sm font-mono truncate"
                      />
                      <button
                        type="button"
                        onClick={copyPixCode}
                        className="px-6 py-3 bg-lol-blue text-black font-bold rounded hover:brightness-110 transition"
                      >
                        <i className="fa-solid fa-copy mr-2"></i>
                        Copiar
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    {paymentStatus === 'pending' && (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Aguardando pagamento...</span>
                      </>
                    )}
                    {paymentStatus === 'approved' && (
                      <>
                        <i className="fa-solid fa-check-circle text-green-500"></i>
                        <span className="text-green-500">Pagamento aprovado!</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-6">
                    <i className="fa-solid fa-shield-halved mr-1"></i>
                    Pagamento processado com segurança pelo Mercado Pago
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="animate-fadeIn max-w-xl mx-auto text-center">
                <div className="bg-lol-card border border-white/10 rounded-xl p-8 shadow-2xl">
                  
                  {/* Success Icon */}
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <i className="fa-solid fa-check text-5xl text-green-500"></i>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4">Tudo certo!</h2>
                  
                  <p className="text-gray-400 text-lg mb-2">
                    A equipe EloUp Legends vai entrar em contato com você.
                  </p>
                  
                  <p className="text-gray-500 mb-8">
                    Você pode logar para acompanhar seu pedido.
                  </p>

                  {/* Order Summary */}
                  <div className="bg-black/30 rounded-lg p-4 mb-8 text-left">
                    <h3 className="text-sm font-bold text-lol-gold mb-3">Resumo do Pedido</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pedido:</span>
                        <span className="text-white font-mono text-xs">{jobId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor pago:</span>
                        <span className="text-lol-gold font-bold">R$ {plainUnit(price || 0)},{decimalUnit(price || 0)}</span>
                      </div>
                      {currentElo && targetElo && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Serviço:</span>
                          <div className="flex items-center gap-2">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${currentElo.picture}`} 
                              alt={currentElo.name}
                              className="w-6 h-6 object-contain"
                            />
                            <i className="fa-solid fa-arrow-right text-gray-600 text-xs"></i>
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${targetElo.picture}`} 
                              alt={targetElo.name}
                              className="w-6 h-6 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Login Button */}
                  <Link
                    href="/login"
                    className="inline-block w-full py-4 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-bold rounded hover:brightness-110 transition transform hover:scale-[1.02] shadow-[0_0_15px_rgba(200,170,110,0.3)]"
                  >
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>
                    Login
                  </Link>

                  <p className="text-xs text-gray-600 mt-6">
                    <i className="fa-solid fa-envelope mr-1"></i>
                    Um e-mail de confirmação foi enviado para {email}
                  </p>
                </div>
              </div>
            )}

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
