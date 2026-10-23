import React from 'react';
import { siteContent } from '../../config/siteContent';
import { CheckCircle2, Globe, ShoppingCart, Briefcase, ShieldAlert } from 'lucide-react';

export const ParaQuemSection: React.FC = () => {
  const { paraQuem } = siteContent;

  const icons = [
    <Globe key="1" className="w-6 h-6 text-purple-400" />,
    <ShoppingCart key="2" className="w-6 h-6 text-fuchsia-400" />,
    <Briefcase key="3" className="w-6 h-6 text-violet-400" />,
    <ShieldAlert key="4" className="w-6 h-6 text-purple-300" />,
  ];

  const iconBgClasses = [
    "bg-purple-500/10 border-purple-400/30 group-hover:bg-purple-500/20 group-hover:border-purple-400/60",
    "bg-fuchsia-500/10 border-fuchsia-400/30 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-400/60",
    "bg-violet-500/10 border-violet-400/30 group-hover:bg-violet-500/20 group-hover:border-violet-400/60",
    "bg-purple-500/10 border-purple-300/30 group-hover:bg-purple-500/20 group-hover:border-purple-300/60",
  ];

  return (
    <section className="relative py-14 px-4 sm:px-6 lg:px-8 bg-[#020205] overflow-hidden">
      {/* Background Graphic overlay with cyber tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-cover bg-center mix-blend-screen filter hue-rotate-180"
        style={{ backgroundImage: `url(${paraQuem.backgroundImage})` }}
      />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {paraQuem.heading.prefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
              {paraQuem.heading.highlight}
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-purple-300 uppercase max-w-2xl mx-auto drop-shadow-sm">
            {paraQuem.subheading}
          </p>
        </div>

        {/* Inner Card Container */}
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 bg-[#070210]/90 border border-purple-500/20 shadow-[0_10px_45px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {paraQuem.items.map((item, index) => (
              <div
                key={index}
                className="group relative flex items-start gap-5 p-6 rounded-2xl bg-[#0a0414]/80 border border-purple-900/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(168,85,247,0.2)] hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${iconBgClasses[index % iconBgClasses.length]}`}>
                  {icons[index % icons.length] || <CheckCircle2 className="w-6 h-6 text-purple-400" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {'title' in item && item.title && (
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                  )}
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
