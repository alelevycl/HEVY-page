'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState('weAreHevy');
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientIsSubmitting, setClientIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [clientFormMessage, setClientFormMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data states
  const [cvFormData, setCvFormData] = useState({
    name: '',
    howHeavy: ''
  });

  const [clientFormData, setClientFormData] = useState({
    companyName: '',
    contactPerson: '',
    clientEmail: '',
    clientPhone: '',
    projectDescription: ''
  });

  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    howHeavy: '',
    file: '',
    companyName: '',
    contactPerson: '',
    clientEmail: '',
    projectDescription: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('No file chosen');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateHowHeavyField = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const MIN_WORDS = 10;
    
    if (text.trim() === '') {
      return 'This field is required.';
    } else if (words.length < MIN_WORDS) {
      return `You must write at least ${MIN_WORDS} words. You have ${words.length}.`;
    }
    return '';
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: '',
      howHeavy: '',
      file: '',
      companyName: '',
      contactPerson: '',
      clientEmail: '',
      projectDescription: ''
    });

    let isValid = true;
    const newErrors = { ...errors };

    // Validate name
    if (cvFormData.name.trim() === '') {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    // Validate howHeavy
    const howHeavyError = validateHowHeavyField(cvFormData.howHeavy);
    if (howHeavyError) {
      newErrors.howHeavy = howHeavyError;
      isValid = false;
    }

    // Validate file
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      newErrors.file = 'You must attach your CV (PDF).';
      isValid = false;
    } else if (file.type !== 'application/pdf') {
      newErrors.file = 'Error: Please upload PDF files only.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setFormMessage('Sending your CV, please wait...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', cvFormData.name);
      formDataToSend.append('howHeavy', cvFormData.howHeavy);
      if (file) {
        formDataToSend.append('cvFile', file);
      }

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setFormMessage('CV sent successfully! We will contact you soon.');
        setCvFormData({ name: '', howHeavy: '' });
        setFileName('No file chosen');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        setFormMessage(`Error sending CV: ${errorData.message || 'An issue occurred.'}`);
      }
    } catch (error) {
      setFormMessage('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: '',
      howHeavy: '',
      file: '',
      companyName: '',
      contactPerson: '',
      clientEmail: '',
      projectDescription: ''
    });

    let isValid = true;
    const newErrors = { ...errors };

    // Validate company name
    if (clientFormData.companyName.trim() === '') {
      newErrors.companyName = 'Company Name is required.';
      isValid = false;
    }

    // Validate contact person
    if (clientFormData.contactPerson.trim() === '') {
      newErrors.contactPerson = 'Contact Person is required.';
      isValid = false;
    }

    // Validate email
    if (clientFormData.clientEmail.trim() === '') {
      newErrors.clientEmail = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientFormData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate project description
    if (clientFormData.projectDescription.trim() === '') {
      newErrors.projectDescription = 'Project Description is required.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setClientIsSubmitting(true);
    setClientFormMessage('Sending your application, please wait...');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', clientFormData.companyName);
      formDataToSend.append('contactPerson', clientFormData.contactPerson);
      formDataToSend.append('clientEmail', clientFormData.clientEmail);
      formDataToSend.append('clientPhone', clientFormData.clientPhone);
      formDataToSend.append('projectDescription', clientFormData.projectDescription);

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setClientFormMessage('Application sent successfully! We will contact you soon.');
        setClientFormData({
          companyName: '',
          contactPerson: '',
          clientEmail: '',
          clientPhone: '',
          projectDescription: ''
        });
      } else {
        const errorData = await response.json();
        setClientFormMessage(`Error sending application: ${errorData.message || 'An issue occurred.'}`);
      }
    } catch (error) {
      setClientFormMessage('Connection error. Please try again later.');
    } finally {
      setClientIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {/* Header with logo */}
        <header className="text-center mb-8">
          <Image
            src="/SCR-20250702-imvp.png"
            alt="HEVY Logo"
            width={192}
            height={192}
            className="mx-auto mb-6 rounded-lg w-48 h-auto"
          />
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('weAreHevy')}
            className={`tab-button px-4 py-2 text-lg text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200 ${
              activeTab === 'weAreHevy' ? 'active' : ''
            }`}
          >
            We are HEVY
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beHevy')}
            className={`tab-button px-4 py-2 text-lg text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200 ${
              activeTab === 'beHevy' ? 'active' : ''
            }`}
          >
            Be HEVY
          </button>
        </div>

        {/* Tab Content - We are HEVY (Client Application Form) */}
        {activeTab === 'weAreHevy' && (
          <div className="tab-content pt-6">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-4 text-center">
              We do HEVY stuff
            </h2>
            <p className="text-gray-700 leading-relaxed text-center mb-6">
              We take businesses and kick them into high gear with savage innovation, explosive growth, and hardcore digital transformation. If you're looking for comfort and safety, look elsewhere.
            </p>

            {/* Client Application Form */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Think you can handle HEVY? Tell us.
            </h3>
            <form onSubmit={handleClientSubmit} className="space-y-6">
              {/* Company Name field */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name:
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

              {/* Contact Person field */}
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person:
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

              {/* Email field */}
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
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

              {/* Phone field */}
              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional):
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  value={clientFormData.clientPhone}
                  onChange={(e) => setClientFormData({...clientFormData, clientPhone: e.target.value})}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Project Description field */}
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description:
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

              {/* Submit button for client application */}
              <button
                type="submit"
                disabled={clientIsSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out disabled:opacity-50"
              >
                {clientIsSubmitting ? 'Sending...' : "Let's do HEVY stuff"}
              </button>
              {clientFormMessage && (
                <p className={`text-center text-sm mt-4 ${
                  clientFormMessage.includes('Error') ? 'text-red-600' : 
                  clientFormMessage.includes('successfully') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {clientFormMessage}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Tab Content - Be HEVY (Form) */}
        {activeTab === 'beHevy' && (
          <div className="tab-content pt-6">
            {/* "WE HIRE NO EXCUSES" y descripción */}
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-2 text-center">
              WE HIRE NO EXCUSES
            </h1>
            <p className="text-gray-700 leading-relaxed text-center mb-8">
              We're not looking for just anyone. We're looking for those who are too HEVY for ordinary companies.
            </p>
            {/* CV Upload Form */}
            <form onSubmit={handleCvSubmit} className="space-y-6">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={cvFormData.name}
                  onChange={(e) => setCvFormData({...cvFormData, name: e.target.value})}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2">{errors.name}</p>
                )}
              </div>

              {/* "Tell us why you are HEVY" text area */}
              <div>
                <label htmlFor="howHeavy" className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us why you are HEVY
                </label>
                <textarea
                  id="howHeavy"
                  value={cvFormData.howHeavy}
                  onChange={(e) => setCvFormData({...cvFormData, howHeavy: e.target.value})}
                  rows={4}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
                />
                {errors.howHeavy && (
                  <p className="text-red-600 text-xs mt-2">{errors.howHeavy}</p>
                )}
              </div>

              {/* Attach PDF field */}
              <div>
                <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Attach CV (PDF only):
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="file"
                    id="cvFile"
                    ref={fileInputRef}
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="py-2 px-4 rounded-lg border border-gray-300 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Choose File
                  </button>
                  <span className="ml-2 text-sm text-gray-500">{fileName}</span>
                </div>
                {errors.file && (
                  <p className="text-red-600 text-xs mt-2">{errors.file}</p>
                )}
              </div>

              {/* Submit button with CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'I want to be HEVY'}
              </button>
              {formMessage && (
                <p className={`text-center text-sm mt-4 ${
                  formMessage.includes('Error') ? 'text-red-600' : 
                  formMessage.includes('successfully') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {formMessage}
                </p>
              )}
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-button.active {
          border-bottom: 3px solid #000;
          font-weight: bold;
          color: #000;
        }
      `}</style>
    </div>
  );
}
