import React from 'react';
import { siteContent } from '../../config/siteContent';
import { ArrowUp, Shield } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { footer } = siteContent;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020205] border-t border-purple-950/40 py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Main Brand Logo */}
        <div className="mb-8">
          <img
            src={footer.logo}
            alt="Contramão"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain mx-auto opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_2px_15px_rgba(168,85,247,0.35)]"
          />
        </div>

        {/* Legal Disclaimer */}
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed mb-6 font-normal">
          Este site não possui vínculo institucional com o TikTok, ByteDance ou com a Meta Inc.
          Os resultados apresentados dependem da aplicação consistente da metodologia, do produto e do mercado de atuação de cada operador.
        </p>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-8 border-t border-purple-950/40 text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Todos os direitos reservados © {new Date().getFullYear()} Contramão • Aceleração em TikTok Ads</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-purple-300 transition-colors p-2.5 rounded-lg bg-[#0a0414]/80 border border-purple-950/50 hover:border-purple-500/40 cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
