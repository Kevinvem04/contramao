import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ParaQuemSection } from './components/sections/ParaQuemSection';
import { PorQueEuropaSection } from './components/sections/PorQueEuropaSection';
import { ProvasSection } from './components/sections/ProvasSection';
import { MentorSection } from './components/sections/MentorSection';
import { LifestyleSection } from './components/sections/LifestyleSection';
import { FooterSection } from './components/sections/FooterSection';
import { MultiStepForm } from './components/form/MultiStepForm';
import { captureUtmParams } from './lib/fbPixel';

export const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 🔥 Captura UTMs da URL na chegada (fbclid, utm_source, utm_campaign, etc.)
  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    // Escuta evento customizado de qualquer botão de CTA
    const handleOpen = () => setIsFormOpen(true);
    window.addEventListener('open-qualification-form', handleOpen);

    // Se o usuário carregar direto com a hashtag #aplicar ou #agendar
    const checkHash = () => {
      if (window.location.hash === '#aplicar' || window.location.hash === '#agendar') {
        setIsFormOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('open-qualification-form', handleOpen);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Limpa a hash da URL caso exista
    if (window.location.hash === '#aplicar' || window.location.hash === '#agendar') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      <main className="flex-grow">
        <HeroSection />
        <ParaQuemSection />
        <PorQueEuropaSection />
        <ProvasSection />
        <MentorSection />
        <LifestyleSection />
      </main>
      <FooterSection />

      {/* Formulário Multi-Step Interativo Estilo Typeform */}
      <MultiStepForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmitSuccess={(data) => {
          console.log('✅ Lead recebido com sucesso:', data);
        }}
      />
    </div>
  );
};

export default App;
