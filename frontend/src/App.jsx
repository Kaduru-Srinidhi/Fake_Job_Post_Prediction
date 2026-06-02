import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PredictSection from './components/PredictSection';
import AboutSection from './components/AboutSection';
import { Shield } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col min-h-screen bg-[#060814] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Routing */}
      <main className="flex-grow">
        {activeTab === 'home' && <HeroSection setActiveTab={setActiveTab} />}
        {activeTab === 'predict' && <PredictSection />}
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Unified Premium Footer */}
      <footer className="border-t border-slate-900 bg-[#04060f] py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-400">JobShield.AI</span>
            <span>— LSTM Recruitment Fraud Classifier</span>
          </div>
          <div>
            <span>Developed for Final Year ML Project Evaluation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
