import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, HelpCircle, BookOpen, Layers, 
  ChevronRight, Award, Lock, FileText, CheckCircle2 
} from 'lucide-react';

export default function AboutSection() {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      title: '1. Text Normalization',
      short: 'Clean input text',
      desc: 'Removes HTML tags, URLs, non-alphabetic punctuation, and converts all characters to lowercase to prevent noise in word structures.'
    },
    {
      title: '2. Tokenization & Padding',
      short: 'Map words to indices',
      desc: 'Translates cleaned text into a sequence of integer IDs using a pre-trained tokenizer. The sequence is capped or padded to exactly 200 word tokens.'
    },
    {
      title: '3. Dense Embedding Layer',
      short: 'Semantic representation',
      desc: 'Projects each word token index into a dense multidimensional embedding space. Synonyms or semantically related words are positioned closer together.'
    },
    {
      title: '4. LSTM Recurrent Layer',
      short: 'Contextual dependencies',
      desc: 'A Long Short-Term Memory network reads word vectors sequentially, capturing contextual dependencies, negations, and ordering nuances.'
    },
    {
      title: '5. Dense classification',
      short: 'Pattern mapping',
      desc: 'Maps the sequential context vector output by the LSTM to a final dense layer with dropout regularizers to prevent overfitting.'
    },
    {
      title: '6. Sigmoid Output Activation',
      short: 'Authenticity thresholding',
      desc: 'Applies a sigmoid activation function to output a raw probability between 0.0 (Legitimate) and 1.0 (Fraudulent). Posts scoring above 0.7 trigger a Fraud Alert.'
    }
  ];

  const safetyGuidelines = [
    {
      title: 'Verify Company Web Domains',
      desc: 'Scammers often register domain names that mimic real firms (e.g., careers-goldmansachs.com instead of goldmansachs.com). Always check the domain creation date.'
    },
    {
      title: 'Official Corporate Application Portal',
      desc: 'Apply directly on the employer\'s official website. Legitimate companies do not hire entirely through chat apps or public email directories (like Gmail or Yahoo).'
    },
    {
      title: 'Never Pay for Recruiter Materials',
      desc: 'Genuine employers NEVER require candidate payment for training manuals, interview devices, software packages, or onboarding clearances.'
    },
    {
      title: 'Validate Recruiter Profiles',
      desc: 'Verify the identity of the recruiter contacting you by cross-referencing their name on official professional networks like LinkedIn.'
    }
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 text-left">
      {/* Background glow */}
      <div className="glow-bg bottom-20 left-20"></div>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Technical Overview & Best Practices
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Project Insights & Model Architecture
        </h2>
        <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          This system was developed to research deep learning lexical classifiers for cybercrime prevention. It leverages pre-trained recurrent neural architectures to model semantic representations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Model Pipeline Explanatory (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pipeline Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              LSTM Classification Pipeline
            </h3>

            {/* Steps navigation and visualization */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              
              {/* Left sidebar nav */}
              <div className="sm:col-span-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 border-b sm:border-b-0 sm:border-r border-slate-800">
                {pipelineSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold text-left shrink-0 transition-all ${
                      activeStep === idx 
                        ? 'bg-indigo-600/15 text-indigo-400 border-l-2 border-indigo-500' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {step.short}
                  </button>
                ))}
              </div>

              {/* Right content view */}
              <div className="sm:col-span-8 flex flex-col justify-center min-h-[160px] sm:pl-4">
                <h4 className="text-base font-bold text-white mb-2">
                  {pipelineSteps[activeStep].title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {pipelineSteps[activeStep].desc}
                </p>
              </div>

            </div>

            {/* SVG Visual Flow Diagram (Modern CSS/SVG) */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Model Tensor Flow diagram
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 flex justify-between items-center overflow-x-auto gap-2">
                
                {/* Node 1 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                    TXT
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Job Text</span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0" />

                {/* Node 2 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center font-bold text-xs text-indigo-400">
                    [200]
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Tokens</span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0" />

                {/* Node 3 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                    EMB
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Embedding</span>
                </div>

                <ChevronRight className="w-4 h-4 text-indigo-500/40 shrink-0" />

                {/* Node 4 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                    LSTM
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Sequence</span>
                </div>

                <ChevronRight className="w-4 h-4 text-purple-500/40 shrink-0" />

                {/* Node 5 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-purple-400">
                    FC
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Dense</span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-700 shrink-0" />

                {/* Node 6 */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                    SIG
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">Probability</span>
                </div>

              </div>
            </div>

          </div>

          {/* Dataset & Contributor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/20 border border-slate-800/40 backdrop-blur-md">
              <Award className="w-5 h-5 text-indigo-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-2">Model Accuracy Validation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on the EMSCAD (Employment Metadata Syndicate) dataset containing ~18,000 real job postings. Employs Synthetic Minority Over-sampling Technique (SMOTE) to handle class imbalance, yielding a validated test accuracy of 98%.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/20 border border-slate-800/40 backdrop-blur-md">
              <FileText className="w-5 h-5 text-indigo-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-2">Dual Format Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimized to save in native H5 format (for server inference via Flask backend) and TF Lite format (for portable, low-footprint offline applications).
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Security Guildelines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-400" />
              Scam Prevention Checklist
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Job scams are rising globally. Online predators pose as recruiter agencies to steal identity credentials, personal bank details, or money. Apply these checks to verify job postings:
            </p>

            <div className="space-y-4">
              {safetyGuidelines.map((guide, idx) => (
                <div key={idx} className="flex gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm mb-1">{guide.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{guide.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
