import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from '../../config/siteContent';
import { ChevronLeft, ChevronRight, X, ZoomIn, ShieldCheck } from 'lucide-react';

export const ProvasSection: React.FC = () => {
  const { provas } = siteContent;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = provas.images.length;

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Auto slide com pausa inteligente ao passar o mouse
  useEffect(() => {
    if (isPaused || lightboxImage) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, lightboxImage, nextSlide]);

  // Teclado para navegação rápida
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, prevSlide, nextSlide]);

  // Gestos touch / swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) nextSlide();
    else if (diffX < -40) prevSlide();
    touchStartX.current = null;
  };

  // Helper para obter posições relativas dos slides (-2, -1, 0, 1, 2)
  const getCardStyle = (index: number) => {
    let diff = (index - currentIndex + total) % total;
    if (diff > total / 2) diff -= total;

    if (diff === 0) {
      // Card Ativo Central
      return {
        className: 'z-30 scale-100 opacity-100 translate-x-0 shadow-[0_20px_50px_rgba(168,85,247,0.3)] border-purple-500/50',
        pointerEvents: true,
      };
    } else if (diff === -1 || (currentIndex === 0 && index === total - 1)) {
      // Card Esquerda
      return {
        className: 'z-20 scale-[0.88] sm:scale-90 opacity-40 sm:opacity-60 -translate-x-[55%] sm:-translate-x-[65%] blur-[1px] hover:opacity-80 border-purple-900/40 hidden sm:block',
        pointerEvents: true,
      };
    } else if (diff === 1 || (currentIndex === total - 1 && index === 0)) {
      // Card Direita
      return {
        className: 'z-20 scale-[0.88] sm:scale-90 opacity-40 sm:opacity-60 translate-x-[55%] sm:translate-x-[65%] blur-[1px] hover:opacity-80 border-purple-900/40 hidden sm:block',
        pointerEvents: true,
      };
    } else {
      // Cards ocultos atrás
      return {
        className: 'z-10 scale-75 opacity-0 pointer-events-none hidden',
        pointerEvents: false,
      };
    }
  };

  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-8 bg-[#020205] overflow-hidden select-none">
      {/* Luzes dinâmicas de fundo em degradê */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/15 via-fuchsia-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grade de fundo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(#2e1065_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Cabeçalho com Globo Neon Decorativo */}
        <div className="relative text-center mb-14 sm:mb-16">
          {/* Globo Neon Holográfico Centralizado Atrás da Headline (Suavizado com máscara circular) */}
          {provas.globeImage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[440px] md:w-[520px] lg:w-[560px] aspect-square pointer-events-none z-0 flex items-center justify-center">
              <img
                src={provas.globeImage}
                alt="Globo Contram�o"
                className="w-full h-full object-contain opacity-15 sm:opacity-20 mix-blend-screen filter drop-shadow-[0_0_30px_rgba(168,85,247,0.25)] [mask-image:radial-gradient(circle_at_center,black_25%,transparent_65%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_25%,transparent_65%)]"
              />
            </div>
          )}

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0414]/90 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider uppercase mb-5 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md">
              Resultados Comprovados
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight drop-shadow-md">
              {provas.heading.prefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
                {provas.heading.highlight}
              </span>
              {provas.heading.suffix}
            </h2>

            <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Painéis reais de escala acelerada, CPA baixo e retorno líquido diário na operação de TikTok Ads.
            </p>
          </div>
        </div>

        {/* Palco do Carrossel 3D / Coverflow */}
        <div
          className="relative max-w-4xl mx-auto min-h-[440px] sm:min-h-[520px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides */}
          <div className="relative w-full h-[400px] sm:h-[480px] flex items-center justify-center">
            {provas.images.map((img, idx) => {
              const card = getCardStyle(idx);
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isCurrent) {
                      setLightboxImage(img);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  className={`absolute w-[88%] sm:w-[500px] h-[370px] sm:h-[450px] transition-all duration-500 ease-out cursor-pointer rounded-2xl bg-gradient-to-b from-[#0e061c]/95 to-[#05010a]/95 border backdrop-blur-xl p-3 sm:p-4 flex flex-col justify-between ${card.className}`}
                >
                  {/* Top Bar do Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-purple-950/60 text-xs">
                    <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Campanha Verificada</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded-md">
                      #{idx + 1} de {total}
                    </span>
                  </div>

                  {/* Imagem do Resultado */}
                  <div className="relative flex-1 flex items-center justify-center overflow-hidden my-2 rounded-xl bg-black/50">
                    <img
                      src={img}
                      alt={`Resultado ${idx + 1}`}
                      className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                    />

                    {isCurrent && (
                      <div className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-[#070210]/90 border border-purple-700/60 text-purple-300 backdrop-blur-md opacity-80 hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Rodapé do Card */}
                  <div className="pt-2 flex items-center justify-between text-slate-400 text-xs">
                    <span className="text-slate-400">TikTok Ads Performance</span>
                    <span className="text-purple-400 font-semibold text-[11px] hover:underline">
                      Toque para ampliar
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de navegação flutuantes */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Slide anterior"
            className="absolute left-1 sm:-left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-3.5 rounded-full bg-[#0a0414]/90 hover:bg-purple-600 text-slate-200 hover:text-white border border-purple-900/50 hover:border-purple-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Próximo slide"
            className="absolute right-1 sm:-right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-3.5 rounded-full bg-[#0a0414]/90 hover:bg-purple-600 text-slate-200 hover:text-white border border-purple-900/50 hover:border-purple-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Indicadores Minimalistas & Elegantes */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {provas.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'w-2 h-2 bg-slate-800 hover:bg-purple-950'
              }`}
              aria-label={`Ir para o resultado ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal Fullscreen */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navegação no Lightbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const prev = currentIndex === 0 ? total - 1 : currentIndex - 1;
              setCurrentIndex(prev);
              setLightboxImage(provas.images[prev]);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0a0414]/90 hover:bg-purple-600 text-white border border-purple-700 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = currentIndex === total - 1 ? 0 : currentIndex + 1;
              setCurrentIndex(next);
              setLightboxImage(provas.images[next]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0a0414]/90 hover:bg-purple-600 text-white border border-purple-700 transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <img
            src={lightboxImage}
            alt="Resultado ampliado"
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

