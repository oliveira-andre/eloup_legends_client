'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import AdminSidebar from '../../../../../components/admin-sidebar';
import { reviews } from '@/app/services/reviews';
import { jobs } from '@/app/services/jobs';
import { users } from '@/app/services/users';
import { Job } from '@/app/entities/Job';

import './style.css';

export default function CreateReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<Job | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchUser();
  }, [id]);

  async function fetchJob() {
    try {
      const responseJob = await jobs.show(id as string);
      setJob(responseJob);
    } catch (error) {
      toast.error('Erro ao carregar informações do pedido');
    }
  }

  async function fetchUser() {
    try {
      const userResponse = await users.getMe();
      setUserId(userResponse.id ?? '');
    } catch (error) {
      toast.error('Erro ao carregar informações do usuário');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    if (!comment.trim()) {
      toast.error('Por favor, escreva um comentário');
      return;
    }

    setIsSubmitting(true);

    try {
      await reviews.create({
        rating,
        comment,
        userId,
        jobId: id as string,
      });

      toast.success('Avaliação enviada com sucesso!');
      router.push('/jobs');
    } catch (error) {
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="flex h-screen overflow-hidden review-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-[#091428]/50 flex items-center px-8 border-b border-white/5">
          <h1 className="text-xl font-bold text-white">Avaliar Serviço</h1>
        </header>

        <div className="p-8 max-w-3xl mx-auto w-full">
          
          {/* Job Info Card */}
          {job && (
            <div className="bg-lol-card p-6 rounded-xl border border-white/5 shadow-xl mb-8">
              <h2 className="text-lg font-bold text-lol-gold mb-4">Informações do Pedido</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">Serviço</span>
                  <span className="text-white font-medium">{job.service?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">De</span>
                  <div className="flex items-center gap-2">
                    {job.currentElo?.picture && (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${job.currentElo.picture}`} 
                        alt={job.currentElo.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-white font-medium">
                      {job.currentElo?.name}
                      {job.currentElo?.has_rank && (
                        <span className="text-lol-blue text-xs ml-1">
                          {job.currentRank === 1 ? 'I' : job.currentRank === 2 ? 'II' : job.currentRank === 3 ? 'III' : 'IV'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Para</span>
                  <div className="flex items-center gap-2">
                    {job.targetElo?.picture && (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${job.targetElo.picture}`} 
                        alt={job.targetElo.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-white font-medium">
                      {job.targetElo?.name}
                      {job.targetElo?.has_rank && (
                        <span className="text-lol-blue text-xs ml-1">
                          {job.rank === 1 ? 'I' : job.rank === 2 ? 'II' : job.rank === 3 ? 'III' : 'IV'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Booster</span>
                  <span className="text-white font-medium">{job.jobber?.name || 'Não atribuído'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="bg-lol-card p-8 rounded-xl border border-white/5 shadow-2xl">
            
            <h2 className="text-2xl font-bold text-white mb-2">Como foi sua experiência?</h2>
            <p className="text-gray-400 mb-8">Sua avaliação ajuda outros jogadores a escolherem nossos serviços.</p>

            {/* Star Rating */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-lol-gold mb-4">Avaliação</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <i 
                      className={`fa-star ${
                        star <= displayRating 
                          ? 'fa-solid text-lol-gold' 
                          : 'fa-regular text-gray-600'
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {displayRating === 0 && 'Clique para avaliar'}
                {displayRating === 1 && 'Péssimo'}
                {displayRating === 2 && 'Ruim'}
                {displayRating === 3 && 'Regular'}
                {displayRating === 4 && 'Bom'}
                {displayRating === 5 && 'Excelente'}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-lol-gold mb-2">Comentário</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Conte-nos sobre sua experiência com o serviço. O que você mais gostou? O booster foi atencioso?"
                rows={5}
                className="w-full px-4 py-3 rounded transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Mínimo de 10 caracteres ({comment.length}/10)
              </p>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-circle-info mr-1"></i>
                Sua avaliação será pública e poderá ser vista por outros usuários.
              </p>

              <div className="flex gap-4 w-full md:w-auto">
                <Link 
                  href="/jobs" 
                  className="flex-1 md:flex-none px-8 py-3 rounded font-bold text-gray-400 hover:text-white transition cursor-pointer text-center"
                >
                  Cancelar
                </Link>
                <button 
                  type="submit" 
                  disabled={isSubmitting || rating === 0 || comment.length < 10}
                  className="flex-1 md:flex-none px-12 py-3 bg-gradient-to-r from-lol-gold to-yellow-600 text-black font-black rounded shadow-[0_0_20px_rgba(200,170,110,0.3)] hover:scale-105 transition transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
