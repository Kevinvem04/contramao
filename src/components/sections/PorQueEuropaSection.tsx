import React from 'react';
import { siteContent } from '../../config/siteContent';
import { CtaButton } from '../common/CtaButton';

export const PorQueEuropaSection: React.FC = () => {
  const { porQueEuropa } = siteContent;

  const numberGradients = [
    'from-[#c084fc] to-[#a855f7]',
    'from-[#a855f7] to-[#d946ef]',
    'from-[#d946ef] to-[#ec4899]',
    'from-[#ec4899] to-[#8b5cf6]',
  ];

  const cardBorderGlows = [
    'hover:border-purple-400/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]',
    'hover:border-fuchsia-400/60 hover:shadow-[0_10px_35px_rgba(217,70,239,0.25)]',
    'hover:border-violet-400/60 hover:shadow-[0_10px_35px_rgba(139,92,246,0.25)]',
    'hover:border-pink-400/60 hover:shadow-[0_10px_35px_rgba(236,72,153,0.25)]',
  ];

  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-8 bg-[#020205] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {porQueEuropa.heading.prefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
              {porQueEuropa.heading.highlight}
            </span>
          </h2>
        </div>

        {/* 4 Motivos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {porQueEuropa.motivos.map((motivo, idx) => (
            <div
              key={motivo.number}
              className={`group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0c051a] to-[#04010a] border border-purple-900/30 transition-all duration-500 flex flex-col justify-between ${cardBorderGlows[idx % cardBorderGlows.length]}`}
            >
              {/* Background artwork */}
              <div
                className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500 bg-cover bg-center pointer-events-none filter hue-rotate-180"
                style={{ backgroundImage: `url(${motivo.backgroundImage})` }}
              />

              {/* Card Header & Content */}
              <div className="relative z-10 p-8 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${numberGradients[idx % numberGradients.length]} tracking-wider drop-shadow-sm`}>
                    {motivo.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <img
                      src={motivo.overlayImage}
                      alt={motivo.title}
                      className="w-full h-full object-contain filter brightness-125 hue-rotate-180"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                  {motivo.title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  {motivo.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent group-hover:via-fuchsia-400 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="flex justify-center">
          <CtaButton
            text={porQueEuropa.cta.text}
            href={porQueEuropa.cta.href}
            trackingId="porque_europa_cta"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
};
