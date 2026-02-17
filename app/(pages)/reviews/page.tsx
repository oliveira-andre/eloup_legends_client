"use client";

import { useState, useEffect } from "react";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { reviews } from "../../services/reviews";
import { Review } from "../../entities/Review";

import './style.css';

export default function PublicReviewsPage() {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (selectedRating === 0) {
      setFilteredReviews(reviewsData);
    } else {
      setFilteredReviews(reviewsData.filter(r => r.rating === selectedRating));
    }
  }, [selectedRating, reviewsData]);

  async function fetchReviews() {
    const responseReviews = await reviews.getAll();
    setReviewsData(responseReviews ?? []);
    setFilteredReviews(responseReviews ?? []);
  }

  function getAverageRating() {
    if (reviewsData.length === 0) return 0;
    const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsData.length).toFixed(1);
  }

  function getRatingCount(rating: number) {
    return reviewsData.filter(r => r.rating === rating).length;
  }

  function getRatingPercentage(rating: number) {
    if (reviewsData.length === 0) return 0;
    return (getRatingCount(rating) / reviewsData.length) * 100;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i 
            key={star}
            className={`fa-star ${star <= rating ? 'fa-solid text-lol-gold' : 'fa-regular text-gray-600'}`}
          ></i>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center reviews-page-container">
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <Header />

        {/* Hero Section */}
        <section className="py-20 text-center mt-20 w-full bg-gradient-to-b from-[#091428] to-[#010a13]">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            O que nossos <span className="text-gradient">clientes</span> dizem
          </h1>
          <div className="w-20 h-1 bg-lol-gold mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto px-6 text-sm md:text-base">
            Mais de {reviewsData.length} avaliações de jogadores que confiaram em nossos serviços.
          </p>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 bg-[#010a13]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Average Rating Card */}
              <div className="bg-lol-card rounded-2xl p-8 border border-white/5 text-center">
                <div className="text-6xl font-black text-lol-gold mb-2">{getAverageRating()}</div>
                <div className="flex justify-center mb-4">
                  {renderStars(Math.round(Number(getAverageRating())))}
                </div>
                <p className="text-gray-400 text-sm">Baseado em {reviewsData.length} avaliações</p>
              </div>

              {/* Rating Breakdown */}
              <div className="bg-lol-card rounded-2xl p-8 border border-white/5 lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Média das Avaliações</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`w-full flex items-center gap-4 p-2 rounded-lg transition ${
                        selectedRating === rating ? 'bg-lol-gold/10 border border-lol-gold/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1 w-24">
                        <span className="text-white font-medium">{rating}</span>
                        <i className="fa-solid fa-star text-lol-gold text-sm"></i>
                      </div>
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-lol-gold to-yellow-500 rounded-full transition-all duration-500"
                          style={{ width: `${getRatingPercentage(rating)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-sm w-12 text-right">{getRatingCount(rating)}</span>
                    </button>
                  ))}
                </div>
                {selectedRating > 0 && (
                  <button 
                    onClick={() => setSelectedRating(0)}
                    className="mt-4 text-sm text-lol-blue hover:text-lol-gold transition"
                  >
                    <i className="fa-solid fa-times mr-1"></i> Limpar filtro
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="w-full py-16 bg-[#010a13]">
          <div className="max-w-7xl mx-auto px-6">
            
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16">
                <i className="fa-regular fa-comment-dots text-6xl text-gray-700 mb-4"></i>
                <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="review-card bg-lol-card rounded-xl p-6 border border-white/5 hover:border-lol-gold/30 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lol-gold to-yellow-600 flex items-center justify-center text-black font-bold text-lg">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{review.user?.name || 'Usuário'}</h4>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    {/* Service Info */}
                    {review.job && (
                      <div className="flex items-center gap-3 mb-4 p-3 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          {review.job.currentElo?.picture && (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${review.job.currentElo.picture}`} 
                              alt={review.job.currentElo.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <i className="fa-solid fa-arrow-right text-gray-600 text-xs"></i>
                          {review.job.targetElo?.picture && (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${review.job.targetElo.picture}`} 
                              alt={review.job.targetElo.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{review.job.service?.name}</span>
                      </div>
                    )}

                    {/* Comment */}
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                      "{review.comment}"
                    </p>

                    {/* Verified Badge */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-green-500 text-sm"></i>
                      <span className="text-xs text-gray-500">Compra verificada</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-gradient-to-b from-[#010a13] to-[#091428]">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para subir de elo?</h2>
            <p className="text-gray-400 mb-8">
              Junte-se a milhares de jogadores satisfeitos e alcance o elo dos seus sonhos.
            </p>
            <a 
              href="/contratar" 
              className="inline-block px-8 py-4 bg-lol-gold text-black font-bold rounded hover:bg-yellow-500 transition shadow-[0_0_15px_rgba(200,170,110,0.5)]"
            >
              Contratar Agora
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
