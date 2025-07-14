'use client';

import { useState } from 'react';
import Image from 'next/image';
import ClientApplicationForm from './components/ClientApplicationForm';
import BeHevyForm from './components/BeHevyForm';
import { useLanguage } from './i18n/LanguageContext';
import { translations } from './i18n/translations';

export default function Home() {
  const [activeTab, setActiveTab] = useState('weAreHevy');
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
      {/* Selector de idioma arriba a la derecha, fuera del contenedor */}
      <div className="fixed top-6 right-8 z-20">
        <nav className="flex gap-1 text-base select-none">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`bg-transparent border-none p-0 m-0 cursor-pointer font-sans transition-all duration-150 focus:outline-none ${language === 'en' ? 'font-bold text-black' : 'text-gray-500'} hover:underline`}
            style={{ textDecoration: language === 'en' ? 'underline' : 'none' }}
          >
            EN
          </button>
          <span className="text-gray-400 font-bold">/</span>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`bg-transparent border-none p-0 m-0 cursor-pointer font-sans transition-all duration-150 focus:outline-none ${language === 'es' ? 'font-bold text-black' : 'text-gray-500'} hover:underline`}
            style={{ textDecoration: language === 'es' ? 'underline' : 'none' }}
          >
            ES
          </button>
        </nav>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative">
        {/* Header con logo */}
        <header className="text-center mb-8">
          <Image
            src="/hevy_growth_logo.jpg"
            alt="HEVY Logo"
            width={192}
            height={192}
            className="mx-auto mb-6 w-28 h-auto"
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
            {t.weAreHevy}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beHevy')}
            className={`tab-button px-4 py-2 text-lg text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200 ${
              activeTab === 'beHevy' ? 'active' : ''
            }`}
          >
            {t.beHevy}
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'weAreHevy' && <ClientApplicationForm />}
        {activeTab === 'beHevy' && <BeHevyForm />}
        <style jsx>{`
          .tab-button.active {
            border-bottom: 3px solid #000;
            font-weight: bold;
            color: #000;
          }
        `}</style>
      </div>
      </div>
    </div>
  );
}
