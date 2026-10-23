export type FieldType = 'text' | 'email' | 'tel' | 'single-choice' | 'textarea';

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export interface FormQuestion {
  id: string;
  type: FieldType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
  autoAdvanceOnSelect?: boolean; // Se true, ao clicar na opção de single-choice já avança
}

export interface FormConfig {
  webhookUrl?: string; // Endpoint opcional para enviar os dados via POST (ex: Make, n8n, CRM, Zapier)
  successScreen: {
    badge: string;
    title: string;
    highlight: string;
    message: string;
    submessage: string;
    ctaText: string;
    whatsappDirectUrl?: string;
  };
  questions: FormQuestion[];
}

export const FORM_CONFIG: FormConfig = {
  // Integração direta com Google Sheets (Google Apps Script Web App)
  webhookUrl: "https://script.google.com/macros/s/AKfycbx9I9n4GFBuljmD9YB2_9zRh-lRpBNl6aOJxr7xFBgOjnWOGlDoq785z5tE2wpKZ3Ju3Q/exec",

  successScreen: {
    badge: "Aplicação Enviada",
    title: "Aplicação Recebida com ",
    highlight: "Sucesso!",
    message: "Recebemos suas informações. Nossa equipe de especialistas em TikTok Ads está analisando o momento da sua operação.",
    submessage: "Entraremos em contato via WhatsApp nas próximas 24 horas úteis caso o seu perfil seja selecionado para a implementação.",
    ctaText: "Voltar para o site",
  },

  questions: [
    {
      id: "nome",
      type: "text",
      title: "Para começar, qual é o seu nome completo?",
      subtitle: "Como gostaria de ser chamado durante a nossa sessão estratégica?",
      placeholder: "Digite seu nome e sobrenome...",
      required: true,
    },
    {
      id: "email",
      type: "email",
      title: "Qual é o seu melhor e-mail profissional?",
      subtitle: "Enviaremos o resumo do diagnóstico e os detalhes do agendamento por aqui.",
      placeholder: "exemplo@seudominio.com",
      required: true,
    },
    {
      id: "whatsapp",
      type: "tel",
      title: "Qual é o seu WhatsApp com DDD?",
      subtitle: "Nosso time entrará em contato diretamente por este número para validar seu perfil.",
      placeholder: "(11) 99999-9999",
      required: true,
    },
    {
      id: "perfil",
      type: "single-choice",
      title: "Qual é o momento atual da sua operação no digital?",
      subtitle: "Selecione a opção que melhor descreve o seu modelo de negócio hoje:",
      autoAdvanceOnSelect: true,
      required: true,
      options: [
        {
          label: "Operação Saturada no Meta Ads",
          value: "saturado_meta",
          description: "Rodo tráfego pago no Meta e o CAC/leilão está encarecendo a margem.",
        },
        {
          label: "E-commerce & Dropshipping",
          value: "ecommerce_drop",
          description: "Quero escalar produtos físicos usando vídeos curtos e compras por impulso.",
        },
        {
          label: "Agência ou Gestor de Tráfego",
          value: "agencia_gestor",
          description: "Quero dominar TikTok Ads para gerar ROI absurdo e reter mais clientes.",
        },
        {
          label: "Infoproduto ou Operação Digital em Escala",
          value: "infoproduto_escala",
          description: "Quero escala previsível, contas blindadas e fim da contingência diária.",
        },
      ],
    },
    {
      id: "faturamento",
      type: "single-choice",
      title: "Qual é a sua média de faturamento mensal hoje?",
      subtitle: "Isso nos ajuda a desenhar a estratégia exata de orçamento e esteira para o seu nível.",
      autoAdvanceOnSelect: true,
      required: true,
      options: [
        {
          label: "Ainda não faturo / Começando do zero",
          value: "comecando_zero",
        },
        {
          label: "Até R$ 10.000 / mês",
          value: "ate_10k",
        },
        {
          label: "De R$ 10.000 a R$ 50.000 / mês",
          value: "10k_a_50k",
        },
        {
          label: "De R$ 50.000 a R$ 100.000 / mês",
          value: "50k_a_100k",
        },
        {
          label: "Acima de R$ 100.000 / mês (Operação Consolidada)",
          value: "acima_100k",
        },
      ],
    },
    {
      id: "desafio",
      type: "textarea",
      title: "Qual é o seu principal desafio ou objetivo com a consultoria?",
      subtitle: "Conte em poucas linhas o que está travando sua escala hoje ou qual meta quer bater no TikTok Ads.",
      placeholder: "Ex: Já invisto no Meta mas quero destravar vendas no TikTok Ads com CAC barato e blindagem de contas...",
      required: true,
    },
  ],
};
