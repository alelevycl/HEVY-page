import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientApplicationForm, { validateClientForm } from '../app/components/ClientApplicationForm';
import { LanguageProvider } from '../app/i18n/LanguageContext';
import { translations } from '../app/i18n/translations';

jest.mock('@/lib/gtag', () => ({ event: jest.fn() }));
global.fetch = jest.fn();

const renderWithProvider = (ui: React.ReactNode) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

const t = translations['en'];

describe('ClientApplicationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos los campos requeridos', () => {
    renderWithProvider(<ClientApplicationForm />);
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project description/i)).toBeInTheDocument();
  });

  describe('validateClientForm', () => {
    it('retorna errores cuando todos los campos están vacíos', () => {
      const formData = {
        companyName: '',
        contactPerson: '',
        clientEmail: '',
        projectDescription: ''
      };
      
      const result = validateClientForm(formData, t);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.companyName).toBe(t.companyNameRequired);
      expect(result.errors.contactPerson).toBe(t.contactPersonRequired);
      expect(result.errors.clientEmail).toBe(t.emailRequired);
      expect(result.errors.projectDescription).toBe(t.projectDescriptionRequired);
    });

    it('retorna errores cuando el email es inválido', () => {
      const formData = {
        companyName: 'Test Company',
        contactPerson: 'Test Person',
        clientEmail: 'invalid-email',
        projectDescription: 'Test description'
      };
      
      const result = validateClientForm(formData, t);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.clientEmail).toBe(t.validEmail);
      expect(result.errors.companyName).toBe('');
      expect(result.errors.contactPerson).toBe('');
      expect(result.errors.projectDescription).toBe('');
    });

    it('retorna válido cuando todos los campos están correctos', () => {
      const formData = {
        companyName: 'Test Company',
        contactPerson: 'Test Person',
        clientEmail: 'test@email.com',
        projectDescription: 'Test description'
      };
      
      const result = validateClientForm(formData, t);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.companyName).toBe('');
      expect(result.errors.contactPerson).toBe('');
      expect(result.errors.clientEmail).toBe('');
      expect(result.errors.projectDescription).toBe('');
    });

    it('retorna válido cuando el email tiene formato correcto', () => {
      const formData = {
        companyName: 'Test Company',
        contactPerson: 'Test Person',
        clientEmail: 'user.name@domain.co.uk',
        projectDescription: 'Test description'
      };
      
      const result = validateClientForm(formData, t);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.clientEmail).toBe('');
    });
  });

  it('envía el formulario correctamente y dispara evento de Analytics', async () => {
    const { event } = await import('@/lib/gtag');
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    renderWithProvider(<ClientApplicationForm />);
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Empresa Test' } });
    fireEvent.change(screen.getByLabelText(/contact person/i), { target: { value: 'Persona Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText(/project description/i), { target: { value: 'Descripción de prueba para el proyecto.' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(event).toHaveBeenCalledWith({
        action: 'submit_form',
        category: 'Form',
        label: 'Client Application',
      });
      expect(screen.getByText(/application sent/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error si la API falla', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    renderWithProvider(<ClientApplicationForm />);
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Empresa Test' } });
    fireEvent.change(screen.getByLabelText(/contact person/i), { target: { value: 'Persona Test' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText(/project description/i), { target: { value: 'Descripción de prueba para el proyecto.' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText(t.connectionError)).toBeInTheDocument();
    });
  });
}); 