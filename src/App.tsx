import React from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { ParaQuemSection } from './components/sections/ParaQuemSection';
import { PorQueEuropaSection } from './components/sections/PorQueEuropaSection';
import { ProvasSection } from './components/sections/ProvasSection';
import { MentorSection } from './components/sections/MentorSection';
import { LifestyleSection } from './components/sections/LifestyleSection';
import { FooterSection } from './components/sections/FooterSection';

export const App: React.FC = () => {
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
    </div>
  );
};

export default App;
