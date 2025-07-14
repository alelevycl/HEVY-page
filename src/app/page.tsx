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
      {/* Language Selector */}
      <div className="fixed top-6 right-8 z-20">
        <nav className="flex gap-1 text-base select-none" aria-label="Selector de idioma">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`bg-transparent border-none p-0 m-0 cursor-pointer font-sans transition-all duration-150 focus:outline-none ${language === 'en' ? 'font-bold text-black' : 'text-gray-500'} hover:underline`}
            style={{ textDecoration: language === 'en' ? 'underline' : 'none' }}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
          <span className="text-gray-400 font-bold" aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`bg-transparent border-none p-0 m-0 cursor-pointer font-sans transition-all duration-150 focus:outline-none ${language === 'es' ? 'font-bold text-black' : 'text-gray-500'} hover:underline`}
            style={{ textDecoration: language === 'es' ? 'underline' : 'none' }}
            aria-pressed={language === 'es'}
          >
            ES
          </button>
        </nav>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <section className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative">
          {/* Header con logo */}
          <header className="text-center mb-8">
            <Image
              src="/hevy_growth_logo.jpg"
              alt="HEVY - Latin America&apos;s Digital Growth Accelerator Logo"
              width={192}
              height={192}
              className="mx-auto mb-6 w-28 h-auto"
              priority
            />
            <h1 className="sr-only">HEVY: Latin America&apos;s Digital Growth Accelerator</h1>
          </header>

          {/* Tab Navigation */}
          <nav className="flex justify-center border-b border-gray-200 mb-6" role="tablist" aria-label="Secciones principales">
            <button
              type="button"
              onClick={() => setActiveTab('weAreHevy')}
              className={`tab-button px-4 py-2 text-lg text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200 ${
                activeTab === 'weAreHevy' ? 'active' : ''
              }`}
              role="tab"
              aria-selected={activeTab === 'weAreHevy'}
              aria-controls="weAreHevy-panel"
              id="weAreHevy-tab"
            >
              {t.weAreHevy}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('beHevy')}
              className={`tab-button px-4 py-2 text-lg text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200 ${
                activeTab === 'beHevy' ? 'active' : ''
              }`}
              role="tab"
              aria-selected={activeTab === 'beHevy'}
              aria-controls="beHevy-panel"
              id="beHevy-tab"
            >
              {t.beHevy}
            </button>
          </nav>

          {/* Tab Content */}
          <div role="tabpanel" id="weAreHevy-panel" aria-labelledby="weAreHevy-tab" className={activeTab === 'weAreHevy' ? '' : 'hidden'}>
            {activeTab === 'weAreHevy' && <ClientApplicationForm />}
          </div>
          <div role="tabpanel" id="beHevy-panel" aria-labelledby="beHevy-tab" className={activeTab === 'beHevy' ? '' : 'hidden'}>
            {activeTab === 'beHevy' && <BeHevyForm />}
          </div>

          <style jsx>{`
            .tab-button.active {
              border-bottom: 3px solid #000;
              font-weight: bold;
              color: #000;
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}
