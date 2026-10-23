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

      // Enter para avançar (exceto em textarea que aceita Shift+Enter)
      if (e.key === 'Enter' && !isSubmitted) {
        if (currentQuestion?.type === 'textarea' && e.shiftKey) {
          return; // Permite quebra de linha com Shift+Enter
        }
        if (currentQuestion?.type !== 'single-choice') {
          e.preventDefault();
          handleNext();
        }
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
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-lg mb-3">
              {successScreen.message}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mb-8">
              {successScreen.submessage}
            </p>

            {/* Botão de Fechar / Concluir */}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7c3aed] text-white font-bold text-base shadow-xl shadow-purple-950/50 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/30"
            >
              <span>{successScreen.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                          onClick={() => handleOptionSelect(option.value, currentQuestion.autoAdvanceOnSelect)}
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
