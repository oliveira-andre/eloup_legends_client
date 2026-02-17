'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import AdminSidebar from '../../components/admin-sidebar';
import { reviews } from '../../services/reviews';
import { Review } from '../../entities/Review';

import './style.css';

export default function AdminReviewsPage() {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const responseReviews = await reviews.getAll();
    setReviewsData(responseReviews ?? []);
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    setIsDeleting(reviewId);
    try {
      await reviews.delete(reviewId);
      toast.success('Avaliação excluída com sucesso');
      fetchReviews();
    } catch (error) {
      toast.error('Erro ao excluir avaliação');
    } finally {
      setIsDeleting(null);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <i 
            key={star}
            className={`fa-star text-xs ${star <= rating ? 'fa-solid text-lol-gold' : 'fa-regular text-gray-600'}`}
          ></i>
        ))}
      </div>
    );
  }

  function getAverageRating() {
    if (reviewsData.length === 0) return '0.0';
    const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsData.length).toFixed(1);
  }

  return (
    <div className="flex h-screen overflow-hidden admin-reviews-container">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="h-20 bg-[#091428]/50 flex items-center justify-between px-8 border-b border-white/5">
          <h1 className="text-2xl font-bold text-white">Gerenciar Avaliações</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-lol-card border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Avaliações</p>
                  <p className="text-3xl font-bold text-white mt-1">{reviewsData.length}</p>
                </div>
                <div className="w-12 h-12 bg-lol-gold/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-comments text-lol-gold text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Média de Avaliação</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-bold text-white">{getAverageRating()}</p>
                    <i className="fa-solid fa-star text-lol-gold"></i>
                  </div>
                </div>
                <div className="w-12 h-12 bg-lol-blue/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-lol-blue text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">5 Estrelas</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {reviewsData.filter(r => r.rating === 5).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-face-smile text-green-500 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-lol-card border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">1-2 Estrelas</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {reviewsData.filter(r => r.rating <= 2).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-face-frown text-red-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Mostrando <span className="text-white font-bold">{reviewsData.length} avaliações</span> no total.
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Filtrar por usuário..." 
                className="bg-lol-input border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-lol-blue w-64" 
              />
            </div>
          </div>

          <div className="bg-lol-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-5">Usuário</th>
                  <th className="px-6 py-5">Avaliação</th>
                  <th className="px-6 py-5">Serviço</th>
                  <th className="px-6 py-5 hidden lg:table-cell">Comentário</th>
                  <th className="px-6 py-5">Data</th>
                  <th className="px-6 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">

                {reviewsData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <i className="fa-regular fa-comment-dots text-4xl mb-4 block"></i>
                      Nenhuma avaliação encontrada.
                    </td>
                  </tr>
                ) : (
                  reviewsData.map((review: Review) => (
                    <tr className="hover:bg-white/5 transition group" key={review.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lol-gold to-yellow-600 flex items-center justify-center text-black font-bold">
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-lol-gold transition">
                              {review.user?.name || 'Usuário'}
                            </div>
                            <div className="text-xs text-gray-500">{review.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {review.job ? (
                          <div className="flex items-center gap-2">
                            {review.job.currentElo?.picture && (
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${review.job.currentElo.picture}`} 
                                alt={review.job.currentElo.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <i className="fa-solid fa-arrow-right text-gray-600 text-xs"></i>
                            {review.job.targetElo?.picture && (
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${review.job.targetElo.picture}`} 
                                alt={review.job.targetElo.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-gray-400 text-xs max-w-xs line-clamp-2" title={review.comment}>
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(review.id)}
                            disabled={isDeleting === review.id}
                            className="w-8 h-8 rounded bg-gray-800 hover:bg-red-500 transition text-white cursor-pointer disabled:opacity-50"
                            title="Excluir avaliação"
                          >
                            {isDeleting === review.id ? (
                              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                            ) : (
                              <i className="fa-solid fa-trash text-xs"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

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
  );
}
