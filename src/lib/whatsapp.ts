const digits = String(import.meta.env.VITE_WHATSAPP_NUMBER || '5592982363086').replace(/\D/g, '');
const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';

export function whatsappLink(text: string): string {
  return `${base}?text=${encodeURIComponent(text)}`;
}

export const WA_HELLO = whatsappLink('Olá! Gostaria de informações sobre os serviços do MF Escritório Jurídico.');
