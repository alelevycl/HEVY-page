declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-0KH5JDRCH8';

// Envía un evento personalizado a Google Analytics
export function event({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
} 