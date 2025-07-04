import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';

export default function ClientApplicationForm() {
  const { language } = useLanguage();
  const t = translations[language];
  const [clientFormData, setClientFormData] = useState({
    companyName: '',
    contactPerson: '',
    clientEmail: '',
    clientPhone: '',
    projectDescription: ''
  });
  const [clientIsSubmitting, setClientIsSubmitting] = useState(false);
  const [clientFormMessage, setClientFormMessage] = useState('');
  const [errors, setErrors] = useState({
    companyName: '',
    contactPerson: '',
    clientEmail: '',
    projectDescription: ''
  });

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      companyName: '',
      contactPerson: '',
      clientEmail: '',
      projectDescription: ''
    });
    let isValid = true;
    const newErrors = { ...errors };
    if (clientFormData.companyName.trim() === '') {
      newErrors.companyName = t.companyNameRequired;
      isValid = false;
    }
    if (clientFormData.contactPerson.trim() === '') {
      newErrors.contactPerson = t.contactPersonRequired;
      isValid = false;
    }
    if (clientFormData.clientEmail.trim() === '') {
      newErrors.clientEmail = t.emailRequired;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientFormData.clientEmail)) {
      newErrors.clientEmail = t.validEmail;
      isValid = false;
    }
    if (clientFormData.projectDescription.trim() === '') {
      newErrors.projectDescription = t.projectDescriptionRequired;
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    setClientIsSubmitting(true);
    setClientFormMessage(t.sendingApplication);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', clientFormData.companyName);
      formDataToSend.append('contactPerson', clientFormData.contactPerson);
      formDataToSend.append('clientEmail', clientFormData.clientEmail);
      formDataToSend.append('clientPhone', clientFormData.clientPhone);
      formDataToSend.append('projectDescription', clientFormData.projectDescription);
      formDataToSend.append('formType', 'contactForm');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formDataToSend
      });
      if (response.ok) {
        setClientFormMessage(t.applicationSent);
        setClientFormData({
          companyName: '',
          contactPerson: '',
          clientEmail: '',
          clientPhone: '',
          projectDescription: ''
        });
      } else {
        const errorData = await response.json();
        setClientFormMessage(`${t.errorSendingApplication} ${errorData.error || t.connectionError}`);
      }
    } catch {
      setClientFormMessage(t.connectionError);
    } finally {
      setClientIsSubmitting(false);
    }
  };

  return (
    <div className="tab-content pt-6">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-4 text-center">
        {t.weDoHevyStuff}
      </h2>
      <p className="text-gray-700 leading-relaxed text-center mb-6">
        {t.weDoHevyDesc}
      </p>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {t.thinkYouCan}
      </h3>
      <form onSubmit={handleClientSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            {t.companyName}
          </label>
          <input
            type="text"
            id="companyName"
            value={clientFormData.companyName}
            onChange={(e) => setClientFormData({...clientFormData, companyName: e.target.value})}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.companyName && (
            <p className="text-red-600 text-xs mt-2">{errors.companyName}</p>
          )}
        </div>
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
            {t.contactPerson}
          </label>
          <input
            type="text"
            id="contactPerson"
            value={clientFormData.contactPerson}
            onChange={(e) => setClientFormData({...clientFormData, contactPerson: e.target.value})}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.contactPerson && (
            <p className="text-red-600 text-xs mt-2">{errors.contactPerson}</p>
          )}
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            {t.email}
          </label>
          <input
            type="email"
            id="clientEmail"
            value={clientFormData.clientEmail}
            onChange={(e) => setClientFormData({...clientFormData, clientEmail: e.target.value})}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.clientEmail && (
            <p className="text-red-600 text-xs mt-2">{errors.clientEmail}</p>
          )}
        </div>
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
            {t.phone}
          </label>
          <input
            type="tel"
            id="clientPhone"
            value={clientFormData.clientPhone}
            onChange={(e) => setClientFormData({...clientFormData, clientPhone: e.target.value})}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
            {t.projectDescription}
          </label>
          <textarea
            id="projectDescription"
            value={clientFormData.projectDescription}
            onChange={(e) => setClientFormData({...clientFormData, projectDescription: e.target.value})}
            rows={4}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
          />
          {errors.projectDescription && (
            <p className="text-red-600 text-xs mt-2">{errors.projectDescription}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={clientIsSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out disabled:opacity-50"
        >
          {clientIsSubmitting ? t.sending : t.letsDoHevy}
        </button>
        {clientFormMessage && (
          <p className={`text-center text-sm mt-4 ${
            clientFormMessage.includes('Error') ? 'text-red-600' : 
            clientFormMessage.includes('éxito') || clientFormMessage.includes('successfully') ? 'text-green-600' : 'text-gray-600'
          }`}>
            {clientFormMessage}
          </p>
        )}
      </form>
    </div>
  );
} 