'use client';

import { useState } from 'react';
import Image from 'next/image';
import ClientApplicationForm from './components/ClientApplicationForm';
import BeHevyForm from './components/BeHevyForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('weAreHevy');

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {/* Header with logo */}
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

        {/* Tab Content */}
        {activeTab === 'weAreHevy' && <ClientApplicationForm />}
        {activeTab === 'beHevy' && <BeHevyForm />}
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
