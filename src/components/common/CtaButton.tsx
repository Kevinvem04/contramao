import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';

interface CtaButtonProps {
  text: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'md' | 'lg';
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  href = '#aplicar',
  onClick,
  className = '',
  size = 'lg',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    } else if (href && (href.startsWith('#') || href === '')) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-qualification-form'));
    }
  };

  const isExternal = Boolean(href && !href.startsWith('#') && href !== '');

  return (
    <a
      href={href || '#aplicar'}
      onClick={handleClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center gap-3 font-black uppercase tracking-wider rounded-2xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
        size === 'lg'
          ? 'px-9 py-5 text-lg md:text-xl min-w-[280px] sm:min-w-[340px]'
          : 'px-7 py-4 text-base min-w-[240px]'
      } bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7c3aed] text-white shadow-xl shadow-purple-900/40 hover:shadow-2xl hover:shadow-purple-500/50 animate-shimmer relative overflow-hidden group border border-purple-400/40 ${className}`}
    >
      <Globe className="w-5 h-5 text-purple-200 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      <span className="relative z-10 tracking-wide text-white drop-shadow-sm">
        {text}
      </span>
      <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5 text-purple-200" />
    </a>
  );
};
