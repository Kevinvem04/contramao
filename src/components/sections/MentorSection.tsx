import React from 'react';
import { siteContent } from '../../config/siteContent';
import { CtaButton } from '../common/CtaButton';
import { Compass, Award } from 'lucide-react';

export const MentorSection: React.FC = () => {
  const { mentor } = siteContent;

  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#020205] overflow-hidden border-t border-purple-950/40">
      {/* Background Graphic com cyber tint suave */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center mix-blend-screen filter hue-rotate-180"
        style={{ backgroundImage: `url(${mentor.backgroundImage})` }}
      />

      {/* Luzes atmosféricas em degradê */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[400px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Compass className="w-3.5 h-3.5" />
            Liderança & Mentoria
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {mentor.heading.prefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
              {mentor.heading.highlight}
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-xl mx-auto">
            Por trás das estratégias, números e execução em escala no mercado global.
          </p>
        </div>

        {/* Grid com distribuição harmônica (Foto Sticky na lateral esquerda / Texto escaneável na direita) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
          
          {/* Coluna Esquerda: Card do Mentor fixo no scroll do desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Glow decorativo sutil */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500/30 via-fuchsia-500/20 to-purple-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
              
              <div className="relative rounded-3xl overflow-hidden border border-purple-900/40 bg-[#090414]/90 p-2.5 shadow-2xl backdrop-blur-xl">
                <img
                  src={mentor.photo}
                  alt="Guilherme Panicali - TikTok Ads"
                  className="w-full h-auto object-cover rounded-2xl transform transition duration-500 group-hover:scale-[1.01]"
                />

                {/* Tag de Nome e Cargo */}
                <div className="mt-3 px-3 py-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-white font-bold text-sm tracking-tight">Guilherme Panicali</div>
                    <div className="text-purple-400 text-xs font-mono">Especialista em TikTok Ads</div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Global Buyer</span>
                  </div>
                </div>
              </div>

              {/* Badges de Métricas */}
              <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                <div className="bg-[#090414]/80 border border-purple-500/30 rounded-2xl p-3.5 text-center backdrop-blur-md shadow-lg">
                  <div className="text-purple-400 font-extrabold text-xl sm:text-2xl tracking-tight">+€1.8M</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Gerenciados em Ads</div>
                </div>
                <div className="bg-[#090414]/80 border border-fuchsia-500/30 rounded-2xl p-3.5 text-center backdrop-blur-md shadow-lg">
                  <div className="text-fuchsia-400 font-extrabold text-xl sm:text-2xl tracking-tight">5 Anos</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Mercado Global</div>
                </div>
              </div>

              {/* Botão de CTA logo abaixo no desktop */}
              <div className="mt-6 hidden lg:flex justify-center w-full">
                <CtaButton
                  text={mentor.cta.text}
                  href={mentor.cta.href}
                  trackingId="mentor_cta_desktop"
                  size="lg"
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita: Biografia e História Estruturada */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {mentor.bio.map((paragraph, index) => {
              const isHighlight =
                paragraph.includes('€1.800.000') ||
                paragraph.includes('nerd de TikTok Ads') ||
                paragraph.includes('justamente na contramão') ||
                paragraph.includes('CONTRAMÃO — O MAPA DO TIKTOK ADS');

              if (isHighlight) {
                return (
                  <div
                    key={index}
                    className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-950/40 via-[#0a0414]/90 to-fuchsia-950/40 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)] backdrop-blur-md"
                  >
                    <div className="flex items-start gap-3">
                      
                      <p className="text-purple-100 font-medium text-sm sm:text-base leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="rounded-2xl p-5 sm:p-6 bg-[#0a0414]/50 border border-purple-950/50 hover:border-purple-800/60 transition-colors backdrop-blur-sm"
                >
                  <p className="text-slate-300 font-normal text-sm sm:text-base leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              );
            })}

            {/* CTA no mobile/tablet ao final do texto */}
            <div className="mt-4 flex lg:hidden justify-center w-full">
              <CtaButton
                text={mentor.cta.text}
                href={mentor.cta.href}
                trackingId="mentor_cta_mobile"
                size="lg"
                className="w-full sm:w-auto justify-center"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

