import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../app/components/Footer';
import { LanguageProvider, useLanguage } from '../app/i18n/LanguageContext';
import React from 'react';

jest.mock('@/lib/gtag', () => ({
  event: jest.fn(),
}));

const renderWithProvider = (ui: React.ReactNode) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('Footer', () => {
  it('renderiza el texto en inglés por defecto', () => {
    renderWithProvider(<Footer />);
    expect(screen.getByText(/follow us on/i)).toBeInTheDocument();
  });

  it('renderiza el texto en español cuando el idioma es cambiado', () => {
    // Componente auxiliar para cambiar el idioma
    function Wrapper() {
      const { setLanguage } = useLanguage();
      React.useEffect(() => { setLanguage('es'); }, [setLanguage]);
      return <Footer />;
    }
    renderWithProvider(<Wrapper />);
    expect(screen.getByText(/síguenos en/i)).toBeInTheDocument();
  });

  it('dispara el evento de Analytics al hacer click en LinkedIn', () => {
    const { event } = require('@/lib/gtag');
    renderWithProvider(<Footer />);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(event).toHaveBeenCalledWith({
      action: 'click_linkedin',
      category: 'Social',
      label: 'Footer Linkedin',
    });
  });
}); 