import React from 'react';
import { siteContent } from '../../config/siteContent';
import { CtaButton } from '../common/CtaButton';
import { ShieldCheck, TrendingUp, Sparkles, Flame, Eye } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { hero } = siteContent;

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 md:py-24 px-4 sm:px-6 lg:px-12 bg-[#020205]">

      {/* 
        BACKGROUND GRAPHIC RESPONSIVO:
        - Mobile: Usa hero-bg-mobile.webp com enquadramento focado no Guilherme + esfera neon e fade suave para o fundo escuro
        - Desktop: Usa hero-bg.webp panorâmico à direita
      */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Imagem Desktop */}
        <img
          src={hero.backgroundImage}
          alt="Tokfly Hero Background"
          className="hidden sm:block w-full h-full object-cover object-right opacity-95 transition-all duration-500"
        />

        {/* Imagem Mobile dedicada com enquadramento perfeito do rosto no topo */}
        <img
          src={hero.backgroundImageMobile || hero.backgroundImage}
          alt="Guilherme Panicali Tokfly"
          className="block sm:hidden w-full h-auto max-h-[580px] object-cover object-top opacity-95"
        />

        {/* Degradê Desktop (Horizontal): Mantém a esquerda limpa para a headline e a direita vibrante */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#020205] via-[#020205]/75 to-transparent w-full h-full" />

        {/* Degradê Mobile (Vertical adicional): Garante contraste total sobre qualquer tela */}
        <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-transparent via-[#020205]/80 to-[#020205] w-full h-full" />

        {/* Fades suaves de topo e rodapé */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-[#020205] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020205] to-transparent" />
      </div>

      {/* Luzes atmosféricas em degradê neon roxo */}
      <div className="absolute top-1/3 left-6 w-[350px] sm:w-[500px] h-[300px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[350px] sm:w-[400px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Container de Conteúdo: espaçamento calculado para que o topo exiba o rosto e o texto flua naturalmente logo abaixo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start text-left pt-52 sm:pt-0">

        {/* Top Logo */}
        <div className="mb-4 sm:mb-8 transform transition hover:scale-105 duration-300">
          <img
            src={hero.logo}
            alt="Contramão"
            className="h-11 sm:h-14 md:h-16 w-auto object-contain drop-shadow-[0_4px_25px_rgba(168,85,247,0.35)]"
          />
        </div>

        {/* Exclusive Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-purple-500/40 bg-[#070210]/80 backdrop-blur-md mb-4 sm:mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
          <span className="text-[11px] sm:text-sm font-bold tracking-wider uppercase text-purple-300">
            Aceleração Estratégica em TikTok Ads • Mar Azul
          </span>
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fuchsia-400 ml-1 shrink-0" />
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.18] text-white max-w-xl lg:max-w-2xl xl:max-w-3xl mb-4 sm:mb-6 drop-shadow-lg">
          {hero.heading.prefix}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300 font-extrabold">
            {hero.heading.highlight}
          </span>
          {hero.heading.suffix}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl lg:max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal drop-shadow-md">
          {hero.subheading}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-start gap-2.5 w-full sm:w-auto mb-8 sm:mb-10">
          <CtaButton
            text={hero.cta.text}
            href={hero.cta.href}
            trackingId="hero_cta"
            size="lg"
            className="w-full sm:w-auto justify-center"
          />
          <span className="text-xs text-slate-300 tracking-wide flex items-center gap-1.5 mt-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" /> Aplicação sujeita à aprovação!
          </span>
        </div>

        {/* Highlights Bar: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-5 sm:pt-6 border-t border-purple-900/40 w-full max-w-xl lg:max-w-2xl">
          <div className="flex items-center gap-3 text-slate-200 bg-[#0a0414]/80 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-purple-500/30 shadow-sm">
            <Eye className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{hero.highlights?.[0]?.text ?? "CAC até 10x Menor que na Meta"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200 bg-[#0a0414]/80 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-fuchsia-500/30 shadow-sm">
            <TrendingUp className="w-5 h-5 text-fuchsia-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{hero.highlights?.[1]?.text ?? "Leilão Virgem & Sem Saturação"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200 bg-[#0a0414]/80 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-violet-500/30 shadow-sm">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{hero.highlights?.[2]?.text ?? "Melhor plataforma atualmente do mercado!"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

