/**
 * Meta Pixel (Facebook Pixel) — Utilitário centralizado
 *
 * Responsável por:
 * 1. Capturar UTM parameters da URL para atribuir leads às campanhas
 * 2. Disparar eventos padrão do Meta com proteção contra duplicação
 * 3. Enviar dados enriquecidos (qual CTA, campanha, etc.)
 *
 * Eventos disparados:
 * - PageView       → automático no index.html (base code)
 * - ViewContent    → clique em qualquer botão de CTA (com nome da seção)
 * - Lead           → submissão completa do formulário de qualificação
 */

// ——————————————————————————————————————————————————————————
// Tipos auxiliares
// ——————————————————————————————————————————————————————————

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
}

// ——————————————————————————————————————————————————————————
// UTM Capture & Persist
// ——————————————————————————————————————————————————————————

const UTM_STORAGE_KEY = 'contramao_utm_params';

/**
 * Lê os UTMs da URL atual. Se existirem, salva no sessionStorage
 * para persistir durante a navegação SPA sem perder a atribuição.
 * Se não houver UTMs na URL, tenta recuperar do sessionStorage.
 */
export function captureUtmParams(): UtmParams {
  const url = new URL(window.location.href);
  const keys: (keyof UtmParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

  const fromUrl: UtmParams = {};
  let hasAny = false;

  for (const key of keys) {
    const val = url.searchParams.get(key);
    if (val) {
      fromUrl[key] = val;
      hasAny = true;
    }
  }

  if (hasAny) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      /* storage indisponível */
    }
    return fromUrl;
  }

  // Tenta recuperar de sessão anterior (ex: usuário navegou e perdeu a query string)
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UtmParams;
  } catch {
    /* storage indisponível */
  }

  return {};
}

// ——————————————————————————————————————————————————————————
// Helpers de disparo de evento
// ——————————————————————————————————————————————————————————

/**
 * Wrapper seguro para fbq(). Não quebra se o pixel não estiver carregado.
 */
function safeFbq(...args: unknown[]): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

// ——————————————————————————————————————————————————————————
// Proteção contra duplicação por sessão
// ——————————————————————————————————————————————————————————

const firedEvents = new Set<string>();

/**
 * Gera uma chave única para um evento + parâmetros.
 * Impede que o mesmo evento seja disparado 2x na mesma sessão
 * (ex: o usuário clica 5x no mesmo CTA → só conta 1 ViewContent daquela seção).
 */
function dedupeKey(eventName: string, uniqueId?: string): string {
  return `${eventName}::${uniqueId || 'global'}`;
}

function shouldFire(eventName: string, uniqueId?: string): boolean {
  const key = dedupeKey(eventName, uniqueId);
  if (firedEvents.has(key)) return false;
  firedEvents.add(key);
  return true;
}

// ——————————————————————————————————————————————————————————
// Eventos Públicos
// ——————————————————————————————————————————————————————————

/**
 * 🔵 ViewContent — Disparado ao clicar em qualquer CTA do site.
 *
 * Parâmetros enviados ao Meta:
 * - content_name: qual seção/botão foi clicado (ex: "hero_cta", "mentor_cta")
 * - content_category: "cta_click"
 * - UTMs da campanha
 *
 * Sem deduplicação por seção — cada seção só dispara 1x por sessão,
 * mas seções diferentes disparam normalmente.
 */
export function trackCtaClick(sectionName: string): void {
  // Permite múltiplos cliques em CTAs DIFERENTES, mas não duplica o mesmo
  if (!shouldFire('ViewContent', sectionName)) return;

  const utms = captureUtmParams();

  safeFbq('track', 'ViewContent', {
    content_name: sectionName,
    content_category: 'cta_click',
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
    ...(utms.utm_content && { utm_content: utms.utm_content }),
  });
}

/**
 * Conta todos os cliques em CTA sem deduplicação (para medir volume total).
 * Dispara um evento customizado "CtaClickTotal" que aparece no
 * Gerenciador de Eventos como evento personalizado.
 */
export function trackCtaClickTotal(sectionName: string): void {
  const utms = captureUtmParams();

  safeFbq('trackCustom', 'CtaClickTotal', {
    content_name: sectionName,
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
  });
}

/**
 * 🟢 Lead — Disparado ao enviar com sucesso o formulário de qualificação.
 *
 * Este é O EVENTO PRINCIPAL para otimização de campanhas e cálculo de CPL.
 * O Meta usa este evento standard para otimizar a entrega dos anúncios.
 *
 * Parâmetros enviados ao Meta:
 * - content_name: "formulario_qualificacao"
 * - content_category: "lead_form"
 * - UTMs completos para atribuição de campanha
 *
 * Deduplicado: só dispara 1x por sessão, mesmo que o usuário
 * feche e reabra o formulário.
 */
export function trackLead(formData: Record<string, string>): void {
  if (!shouldFire('Lead', 'form_submission')) return;

  const utms = captureUtmParams();

  safeFbq('track', 'Lead', {
    content_name: 'formulario_qualificacao',
    content_category: 'lead_form',
    // UTMs para atribuição de campanha — essencial para calcular CPL por campanha
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_medium && { utm_medium: utms.utm_medium }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
    ...(utms.utm_content && { utm_content: utms.utm_content }),
    ...(utms.utm_term && { utm_term: utms.utm_term }),
    ...(utms.fbclid && { fbclid: utms.fbclid }),
    // Dados do lead para Advanced Matching (melhora a atribuição)
    ...(formData.email && { em: formData.email }),
    ...(formData.whatsapp && { ph: formData.whatsapp.replace(/\\D/g, '') }),
    ...(formData.nome && { fn: formData.nome.split(' ')[0]?.toLowerCase() }),
  });
}
