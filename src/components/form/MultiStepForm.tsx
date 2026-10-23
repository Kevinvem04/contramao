import React, { useState, useEffect, useRef } from 'react';
import { FORM_CONFIG, type FormQuestion } from '../../config/formQuestions';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Sparkles, X, AlertCircle } from 'lucide-react';

interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: Record<string, string>) => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const { questions, successScreen, webhookUrl } = FORM_CONFIG;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const totalSteps = questions.length;
  const currentQuestion: FormQuestion | undefined = questions[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Gera link dinâmico para o WhatsApp com mensagem personalizada
  const getWhatsAppUrl = () => {
    if (successScreen.whatsappDirectUrl) return successScreen.whatsappDirectUrl;

    const phone = (FORM_CONFIG.whatsappNumber || '').replace(/\D/g, '');
    if (!phone) return null;

    const leadFirstName = formData.nome ? formData.nome.trim().split(' ')[0] : '';
    const baseMessage = FORM_CONFIG.whatsappMessage || 'Olá! Acabei de preencher a aplicação no site e gostaria de acelerar meu atendimento.';

    const messageText = leadFirstName
      ? `Olá! Me chamo ${leadFirstName}. ${baseMessage}`
      : baseMessage;

    return `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
  };

  const whatsappUrl = getWhatsAppUrl();

  // Auto-focus no campo quando o passo muda
  useEffect(() => {
    if (isOpen && !isSubmitted && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, isSubmitted]);

  // Bloqueia o scroll da página enquanto o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Enter para avançar (exceto em textarea com Shift+Enter que quebra linha)
      if (e.key === 'Enter' && !isSubmitted) {
        if (currentQuestion?.type === 'textarea' && e.shiftKey) {
          return; // Permite quebra de linha com Shift+Enter
        }
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, formData, isSubmitted]);

  if (!isOpen) return null;

  // Formatação automática de telefone brasileiro (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setError(null);
    if (currentQuestion?.type === 'tel') {
      setFormData((prev) => ({ ...prev, [fieldId]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));
    }
  };

  // Validação do passo atual
  const validateCurrentStep = (): boolean => {
    if (!currentQuestion) return false;

    const value = (formData[currentQuestion.id] || '').trim();

    if (currentQuestion.required && !value) {
      setError('Por favor, preencha este campo para continuar.');
      return false;
    }

    if (currentQuestion.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Por favor, insira um endereço de e-mail válido.');
        return false;
      }
    }

    if (currentQuestion.type === 'tel' && value) {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) {
        setError('Por favor, insira um número de WhatsApp válido com DDD.');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleOptionSelect = (value: string, autoAdvance?: boolean) => {
    if (!currentQuestion) return;
    setError(null);
    setFormData((prev) => ({ ...prev, [currentQuestion.id]: value }));

    if (autoAdvance) {
      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleFinalSubmit();
        }
      }, 200);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Salva no localStorage como backup de contingência de lead
      try {
        const leadPayload = {
          ...formData,
          submittedAt: new Date().toISOString(),
          source: window.location.href,
        };
        localStorage.setItem('contramao_lead_application', JSON.stringify(leadPayload));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      // Dispara webhook ou Google Apps Script caso configurado em formQuestions.ts
      if (webhookUrl && webhookUrl.trim() !== '') {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors', // Essencial para Google Apps Script Web App (evita bloqueio de CORS do navegador)
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              ...formData,
              submittedAt: new Date().toLocaleString('pt-BR'),
            }),
          });
        } catch (postErr) {
          console.warn('Webhook / Google Sheets dispatch notice:', postErr);
        }
      }

      onSubmitSuccess?.(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form', err);
      // Mesmo com erro de webhook, exibe sucesso para não frustrar o lead
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020205]/95 backdrop-blur-xl animate-fadeIn overflow-hidden select-none">
      
      {/* Luzes de ambientação neon roxo */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Barra de Topo: Logo, Progresso e Botão Fechar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-purple-950/40 bg-[#020205]/70 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/contramao-horizontal.png"
            alt="Contramão"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_15px_rgba(168,85,247,0.35)]"
          />
        </div>

        {/* Barra de Progresso Centralizada (Apenas durante as perguntas) */}
        {!isSubmitted && (
          <div className="flex flex-col items-center gap-1.5 w-44 sm:w-64">
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
              <span className="text-purple-300 font-semibold">Passo {currentStep + 1} de {totalSteps}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-purple-950/50 rounded-full overflow-hidden border border-purple-900/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-violet-300 transition-all duration-500 ease-out rounded-full shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-950/40 border border-transparent hover:border-purple-800/40 transition-colors cursor-pointer group"
          title="Fechar (Esc)"
        >
          <span className="text-xs font-mono hidden sm:inline text-slate-500 group-hover:text-slate-300">ESC</span>
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Conteúdo Central */}
      <main className="relative z-10 w-full max-w-2xl px-6 sm:px-8 py-10 flex flex-col justify-center min-h-[500px]">

        {/* ============================================================== */}
        {/* TELA DE SUCESSO (THANK YOU SCREEN) */}
        {/* ============================================================== */}
        {isSubmitted ? (
          <div className="text-center flex flex-col items-center animate-scaleUp">
            {/* Ícone Pulsante */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#9333ea] to-[#c026d3] p-0.5 shadow-[0_0_35px_rgba(168,85,247,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-[#070210] rounded-[22px] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Badge de Confirmação */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              {successScreen.badge}
            </div>

            {/* Título de Sucesso */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {successScreen.title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-violet-300">
                {successScreen.highlight}
              </span>
            </h2>

            {/* Mensagem e Submensagem */}
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-lg mb-2">
              {successScreen.message}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mb-8">
              {successScreen.submessage}
            </p>

            {/* Ações da Tela de Sucesso */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
              {/* Botão de Destaque: WhatsApp */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/50 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/40"
                >
                  {/* Ícone oficial SVG do WhatsApp */}
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.33C16.32 14.21 15.11 13.61 14.88 13.53C14.66 13.45 14.5 13.41 14.33 13.65C14.17 13.9 13.69 14.47 13.54 14.64C13.4 14.81 13.25 14.83 13 14.71C12.75 14.58 11.71 14.24 10.47 13.14C9.51 12.28 8.86 11.23 8.67 10.91C8.49 10.59 8.65 10.41 8.78 10.28C8.89 10.17 9.03 9.99 9.15 9.84C9.28 9.7 9.32 9.59 9.4 9.43C9.48 9.26 9.44 9.12 9.38 9C9.32 8.88 8.83 7.67 8.62 7.18C8.42 6.7 8.22 6.77 8.07 6.76C7.93 6.76 7.76 6.75 7.6 6.75C7.43 6.75 7.16 6.81 6.94 7.06C6.71 7.3 6.08 7.9 6.08 9.11C6.08 10.33 6.97 11.5 7.09 11.67C7.22 11.83 8.84 14.33 11.31 15.4C11.9 15.65 12.35 15.8 12.71 15.92C13.3 16.1 13.84 16.08 14.26 16.01C14.73 15.94 15.71 15.42 15.91 14.85C16.12 14.28 16.12 13.79 16.06 13.69C16 13.58 15.82 13.46 16.57 14.33Z" />
                  </svg>
                  <span>{successScreen.whatsappButtonText || 'Acelerar Atendimento no WhatsApp'}</span>
                </a>
              )}

              {/* Botão Secundário: Voltar ao site */}
              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-purple-800/40 hover:border-purple-600/50 transition-all cursor-pointer"
              >
                <span>{successScreen.ctaText}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* RENDERIZADOR DINÂMICO DE PERGUNTAS */
          /* ============================================================== */
          currentQuestion && (
            <div key={currentQuestion.id} className="animate-slideUp flex flex-col justify-between">
              
              {/* Header da Pergunta */}
              <div className="mb-6 sm:mb-8">
                {/* Chip Indicador do Passo */}
                <span className="inline-block text-purple-400 font-mono font-bold text-xs uppercase tracking-widest mb-3">
                  0{currentStep + 1} <span className="text-slate-600">→</span> Pergunta
                </span>

                {/* Título Principal da Pergunta */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {currentQuestion.title}
                </h3>

                {/* Subtítulo de Apoio */}
                {currentQuestion.subtitle && (
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2.5 max-w-xl">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Renderização do Campo com base no Tipo */}
              <div className="mb-8">
                
                {/* Inputs de Texto / Email / Telefone */}
                {['text', 'email', 'tel'].includes(currentQuestion.type) && (
                  <div className="relative">
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={currentQuestion.type === 'tel' ? 'tel' : currentQuestion.type}
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      className="w-full bg-transparent border-b-2 border-slate-700/80 focus:border-purple-400 text-xl sm:text-2xl md:text-3xl text-white placeholder-slate-600 pb-3 focus:outline-none transition-colors"
                      autoComplete="off"
                    />
                  </div>
                )}

                {/* Textarea Descritiva */}
                {currentQuestion.type === 'textarea' && (
                  <div className="relative">
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      rows={4}
                      className="w-full bg-[#0a0414]/90 border border-purple-950/60 focus:border-purple-400/80 rounded-2xl p-4 sm:p-5 text-base sm:text-lg text-white placeholder-slate-600 focus:outline-none transition-colors resize-none shadow-inner"
                    />
                    <div className="text-right text-[11px] font-mono text-slate-500 mt-1.5">
                      Shift + Enter para quebra de linha
                    </div>
                  </div>
                )}

                {/* Múltipla Escolha (Single Choice) */}
                {currentQuestion.type === 'single-choice' && currentQuestion.options && (
                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = formData[currentQuestion.id] === option.value;
                      const letter = letters[idx] || `${idx + 1}`;

                      return (
                        <div
                          key={option.value}
                          onClick={() => handleOptionSelect(option.value, currentQuestion.autoAdvanceOnSelect === true)}
                          className={`group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                              : 'bg-[#0a0414]/80 border-purple-950/50 hover:border-purple-500/50 hover:bg-[#0e061c]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Tecla / Letra de Atalho */}
                            <div
                              className={`shrink-0 w-7 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-purple-500 text-white border-purple-400'
                                  : 'bg-[#05010a] text-purple-300 border-purple-900/60 group-hover:border-purple-500/50'
                              }`}
                            >
                              {letter}
                            </div>

                            {/* Textos da Opção */}
                            <div>
                              <div className={`font-semibold text-sm sm:text-base transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                {option.label}
                              </div>
                              {option.description && (
                                <div className="text-xs text-slate-400 mt-0.5 font-normal">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ícone de Seleção */}
                          <div className="shrink-0 ml-3">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </div>
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mensagem de Erro de Validação com feedback visual */}
                {error && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm mt-3 animate-shake font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Barra de Ações Inferior (Botão Voltar e Avançar) */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-950/40">
                {/* Botão Voltar */}
                {currentStep > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-2 px-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div />
                )}

                {/* Botão Avançar / Concluir */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                    Pressione Enter ↵
                  </span>
                  
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-950/50 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/30 disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? 'Enviando...'
                        : currentStep === totalSteps - 1
                        ? 'Finalizar Aplicação'
                        : 'Continuar'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )
        )}

      </main>

    </div>
  );
};
