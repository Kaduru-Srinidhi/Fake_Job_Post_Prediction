import React from 'react';
import { ShieldCheck, Cpu, Zap, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

export default function HeroSection({ setActiveTab }) {
  const stats = [
    { label: 'Detection Accuracy', value: '98%', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Core Architecture', value: 'LSTM', icon: Cpu, color: 'text-indigo-400' },
    { label: 'Inference speed', value: '< 2.0s', icon: Zap, color: 'text-amber-400' },
  ];

  const features = [
    {
      title: 'Semantic Context Analysis',
      description: 'Goes beyond keyword matching to analyze structural and semantic patterns within descriptions.',
      icon: Cpu,
      borderColor: 'border-indigo-500/20',
      glowColor: 'bg-indigo-500/10',
    },
    {
      title: 'Instant Scam Flagging',
      description: 'Detects warning signs like security deposits, suspicious email formats, and unusual job terms.',
      icon: AlertTriangle,
      borderColor: 'border-rose-500/20',
      glowColor: 'bg-rose-500/10',
    },
    {
      title: 'TFLite & Keras Dual Engine',
      description: 'Configured for high-speed edge devices and native neural net servers with absolute fallback reliability.',
      icon: ShieldCheck,
      borderColor: 'border-emerald-500/20',
      glowColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="glow-bg top-10 left-10"></div>
      <div className="glow-bg bottom-10 right-10"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <ShieldCheck className="w-3.5 h-3.5" />
          AI-Powered Security for Job Seekers
        </div>

        {/* Big Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight select-none">
          Verify Job Openings. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Detect Scams Instantly.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
          Protect yourself from recruitment fraud. Our advanced deep learning model analyzes job details, company structure, and requirements to expose fake postings in real-time.
        </p>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <button
            onClick={() => setActiveTab('predict')}
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
          >
            Start Analyzing Postings
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-700 text-slate-300 hover:text-white font-semibold transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            Model & Architecture
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800/60 shadow-lg hover:border-slate-700/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`p-3 rounded-xl bg-slate-950 mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl bg-slate-900/30 border ${feature.borderColor} backdrop-blur-md relative overflow-hidden group hover:border-slate-700/60 hover:bg-slate-900/40 transition-all duration-300 text-left`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full ${feature.glowColor} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                <div className="inline-flex p-3.5 rounded-2xl bg-slate-950/80 text-indigo-400 mb-6 relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
