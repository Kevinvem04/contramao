import React from 'react';
import { siteContent } from '../../config/siteContent';

export const LifestyleSection: React.FC = () => {
  const { lifestyle } = siteContent;

  if (!lifestyle) return null;

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#020205] text-white overflow-hidden border-t border-purple-950/40">
      {/* Luzes de ambientação sutis */}
      <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[250px] sm:h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[450px] h-[200px] sm:h-[300px] bg-fuchsia-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Detalhes binários no desktop */}
      <div className="absolute top-6 right-8 text-purple-400/20 font-mono text-xs select-none pointer-events-none hidden lg:block leading-relaxed">
        <div>1</div>
        <div>0</div>
        <div>1</div>
        <div>0</div>
      </div>
      <div className="absolute bottom-10 left-8 text-purple-400/20 font-mono text-xs select-none pointer-events-none hidden lg:block leading-relaxed">
        <div>0</div>
        <div>1</div>
        <div>0</div>
        <div>1</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Coluna de Textos */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pr-0 lg:pr-6 text-left">
            <div>
              {/* Tag Superior */}
              <div className="inline-block text-purple-400 font-mono font-semibold tracking-widest text-xs uppercase mb-4 sm:mb-6">
                {lifestyle.tag}
              </div>

              {/* Título Principal */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] sm:leading-[1.05] text-white mb-4 sm:mb-6 uppercase">
                <span>{lifestyle.headline.line1}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
                  {lifestyle.headline.highlight}
                </span>
                <br />
                <span>{lifestyle.headline.line3}</span>
              </h2>

              {/* Descrição */}
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-normal mb-6 sm:mb-8">
                {lifestyle.description}
              </p>
            </div>

            {/* Linha divisória e Citação */}
            <div className="pt-6 sm:pt-8 border-t border-purple-950/40 mt-auto">
              <blockquote className="text-slate-100 text-base sm:text-xl font-medium tracking-tight mb-2">
                {lifestyle.quote}
              </blockquote>
              <div className="text-purple-400 font-mono text-xs tracking-widest uppercase font-semibold">
                {lifestyle.verse}
              </div>
            </div>
          </div>

          {/* Coluna do Grid de Fotos com ajuste refinado para Mobile */}
          <div className="lg:col-span-7 mt-4 lg:mt-0">
            {/* Grid inteligente: 2 colunas no mobile e 3 colunas a partir de sm/tablet */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 sm:max-h-[580px]">
              
              {/* Foto 1: Janela / Cidade / Laptop */}
              <div className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-950/40 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] shadow-2xl transition-all duration-300 bg-[#0a0414]/60 aspect-[3/4] sm:aspect-auto sm:h-full">
                <img
                  src={lifestyle.images.main}
                  alt="Trabalhando na Ásia com TikTok Ads"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Coluna do meio: Duas fotos empilhadas */}
              <div className="flex flex-col gap-2.5 sm:gap-4 justify-between h-full">
                {/* Foto 2 Topo (Dia) */}
                <div className="group relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-950/40 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] shadow-2xl transition-all duration-300 bg-[#0a0414]/60 aspect-[4/3] sm:aspect-auto">
                  <img
                    src={lifestyle.images.col2Top}
                    alt="Rua de dia na Ásia"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-20 group-hover:opacity-10 transition-opacity" />
                </div>

                {/* Foto 3 Baixo (Noite Neon) */}
                <div className="group relative flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-950/40 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] shadow-2xl transition-all duration-300 bg-[#0a0414]/60 aspect-[4/3] sm:aspect-auto">
                  <img
                    src={lifestyle.images.col2Bottom}
                    alt="Rua neon à noite na Ásia"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-20 group-hover:opacity-10 transition-opacity" />
                </div>
              </div>

              {/* Foto 4: 7-Eleven à noite (No mobile ocupa a largura total abaixo do par de fotos com visual cinematográfico) */}
              <div className="col-span-2 sm:col-span-1 group relative rounded-xl sm:rounded-2xl overflow-hidden border border-purple-950/40 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] shadow-2xl transition-all duration-300 bg-[#0a0414]/60 aspect-[16/9] sm:aspect-auto sm:h-full">
                <img
                  src={lifestyle.images.col3}
                  alt="Viagem na Ásia"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
