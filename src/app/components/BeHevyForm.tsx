import { useState, useRef } from 'react';

export default function BeHevyForm() {
  const [cvFormData, setCvFormData] = useState({
    name: '',
    howHeavy: ''
  });
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({
    name: '',
    howHeavy: '',
    file: ''
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
    setErrors({ name: '', howHeavy: '', file: '' });
    let isValid = true;
    const newErrors = { ...errors };
    if (cvFormData.name.trim() === '') {
      newErrors.name = 'Name is required.';
      isValid = false;
    }
    const howHeavyError = validateHowHeavyField(cvFormData.howHeavy);
    if (howHeavyError) {
      newErrors.howHeavy = howHeavyError;
      isValid = false;
    }
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
    } catch {
      setFormMessage('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tab-content pt-6">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-2 text-center">
        WE HIRE NO EXCUSES
      </h1>
      <p className="text-gray-700 leading-relaxed text-center mb-8">
        We&apos;re not looking for just anyone. We&apos;re looking for those who are too HEVY for ordinary companies.
      </p>
      <form onSubmit={handleCvSubmit} className="space-y-6">
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
  );
} 