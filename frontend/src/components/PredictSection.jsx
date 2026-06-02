import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Cpu, AlertTriangle, Loader2, Copy, Check, 
  Trash2, Download, History, ArrowRight, Info, AlertCircle 
} from 'lucide-react';

const PRESETS = {
  legit: `Title: Software Engineer
Company: Goldman Sachs
Location: Bengaluru, India
Description: Develop scalable software, architect low-latency infrastructure, and leverage machine learning to turn data into action.
Requirements:
- Bachelor's in Computer Science or related field
- Strong fundamentals in distributed systems and databases
- Proficiency in algorithm design and analysis
- Experience with programming languages and runtime systems
How to Apply: Visit the Goldman Sachs careers page: https://www.goldmansachs.com/careers/our-firm/engineering`,
  
  fraud: `Title: Junior Developer - Immediate Hiring
Company: Future AI Solutions
Location: Remote
Description: Seeking enthusiastic developers to work on AI projects with international clients. No experience needed.
Requirements:
- No experience required; basic Python preferred
- Must have a laptop with internet access
How to Apply: Apply via careers@futureaisolutions.com. A refundable ₹4,999 deposit is required for training materials.`
};

export default function PredictSection() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('veri_job_history');
    if (saved) {
      try {
        setScanHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleCopyPreset = (type) => {
    setInputText(PRESETS[type]);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const runPrediction = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Call our JSON API
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ combined_text: inputText })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API error occurred');
      }

      const finalResult = {
        classification: data.result, // "Fraudulent" or "Legitimate"
        rawScore: data.prediction,  // float
        confidence: data.confidence, // percentage (float)
        scannedAt: new Date().toLocaleTimeString(),
        redFlags: analyzeFlags(inputText, data.result)
      };

      setResult(finalResult);

      // Add to Scan History
      const updatedHistory = [
        {
          textSnippet: inputText.slice(0, 60) + (inputText.length > 60 ? '...' : ''),
          classification: data.result,
          confidence: data.confidence,
          timestamp: new Date().toLocaleTimeString()
        },
        ...scanHistory.slice(0, 4) // Keep last 5 scans
      ];
      setScanHistory(updatedHistory);
      localStorage.setItem('veri_job_history', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection failed. Please verify that the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Rule-based heuristic flag analyzer (extra final year feature!)
  const analyzeFlags = (text, classification) => {
    const flags = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('deposit') || lowerText.includes('refundable') || lowerText.includes('payment') || lowerText.includes('fees')) {
      flags.push({
        title: 'Financial Request',
        desc: 'Mentions deposit, fees, or refundable payments, which is a classic hiring scam indicator.',
        severity: 'high'
      });
    }

    if (lowerText.includes('no experience') || lowerText.includes('no qualifications') || lowerText.includes('immediate hiring')) {
      flags.push({
        title: 'Low Entry Barriers',
        desc: 'Promotes immediate hiring with zero experience or skills, often used to bait candidates.',
        severity: 'medium'
      });
    }

    // Check for public email domain addresses in how to apply
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatch) {
      const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com', 'yandex.com'];
      const hasPublicEmail = emailMatch.some(email => {
        const domain = email.split('@')[1]?.toLowerCase();
        return publicDomains.includes(domain);
      });
      if (hasPublicEmail) {
        flags.push({
          title: 'Generic Email Address',
          desc: 'Job listings requiring application via public email providers (Gmail, Yahoo, etc.) rather than an official corporate domain.',
          severity: 'high'
        });
      }
    }

    if (lowerText.includes('telegram') || lowerText.includes('whatsapp') || lowerText.includes('chat app')) {
      flags.push({
        title: 'Informal Communication Channels',
        desc: 'Requests interview or communication via WhatsApp, Telegram, or other chat platforms.',
        severity: 'medium'
      });
    }

    if (classification === 'Fraudulent' && flags.length === 0) {
      flags.push({
        title: 'Syntactic Pattern Alert',
        desc: 'Our LSTM model flagged this listing based on lexical anomalies and text formatting patterns common in scam database entries.',
        severity: 'high'
      });
    }

    return flags;
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportText = `JOB POST AUTHENTICATION REPORT
Scanned At: ${new Date().toLocaleString()}
Verdict: ${result.classification.toUpperCase()}
Confidence Score: ${result.confidence.toFixed(2)}%
Raw Model Score: ${result.rawScore.toFixed(4)}

Detected Warning Flags:
${result.redFlags.length > 0 
  ? result.redFlags.map((f, i) => `${i+1}. [${f.severity.toUpperCase()}] ${f.title}: ${f.desc}`).join('\n')
  : 'None detected.'}

Original Job Description scanned:
----------------------------------------
${inputText}
----------------------------------------
JobShield AI - LSTM Prediction System`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JobShield_Report_${result.classification}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('veri_job_history');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10">
      {/* Background glow */}
      <div className="glow-bg top-20 right-20"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          Recruitment Verification Hub
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Input your job post text, description, requirements, or application details. Our LSTM deep neural network will analyze the lexical semantics and return a classification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Inputs and Templates (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Scanner Card */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Analyze Job Listing
            </h3>

            <form onSubmit={runPrediction} className="space-y-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste the full job posting text here (including title, description, and application requirements)..."
                  className="w-full h-80 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none text-sm leading-relaxed"
                  disabled={loading}
                />
                
                {/* Word Counter */}
                <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-500">
                  {inputText.trim().split(/\s+/).filter(Boolean).length} words | {inputText.length} chars
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading || !inputText}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-3 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Input
                </button>

                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Verify Authenticity
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick-Test Templates Section */}
          <div className="p-6 rounded-3xl bg-slate-900/20 border border-slate-800/40 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Quick-Test Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Legit Preset */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-800 transition-colors flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    Goldman Sachs - Engineer
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {PRESETS.legit}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyPreset('legit')}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-colors"
                >
                  {copiedType === 'legit' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Loaded Template!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Load Template
                    </>
                  )}
                </button>
              </div>

              {/* Fraud Preset */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-800 transition-colors flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    Future AI Solutions (Deposit)
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {PRESETS.fraud}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyPreset('fraud')}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800 transition-colors"
                >
                  {copiedType === 'fraud' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Loaded Template!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Load Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Loading, Results & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Loading Screen */}
          {loading && (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center min-h-[300px] animate-pulse">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <Cpu className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Running Neural Semantics Audit
              </h3>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Our LSTM Deep Neural Network model is tokenizing inputs and computing probability coefficients...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md flex gap-4 text-left">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-bold text-rose-400 text-sm mb-1">Inference Execution Failed</h4>
                <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in text-left">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Analysis Verdict
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Scanned: {result.scannedAt}
                </span>
              </div>

              {/* Big Badge Result */}
              {result.classification === 'Legitimate' ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-400">Legitimate Post</h3>
                    <p className="text-xs text-emerald-300/80 leading-relaxed mt-0.5">
                      Model indicates a standard genuine job opportunity configuration.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
                    <ShieldAlert className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-rose-400">Fraud Alert Detected</h3>
                    <p className="text-xs text-rose-300/80 leading-relaxed mt-0.5">
                      Extreme caution recommended. Lexical anomalies matched known recruitment scams.
                    </p>
                  </div>
                </div>
              )}

              {/* Confidence Gauge */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-slate-300">Model Confidence</span>
                  <span className={`text-base font-extrabold ${result.classification === 'Legitimate' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.confidence.toFixed(2)}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.classification === 'Legitimate' 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-orange-500 to-rose-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                  <span>0.0 (LEGITIMATE)</span>
                  <span>0.7 (THRESHOLD)</span>
                  <span>1.0 (FRAUDULENT)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Sigmoid Probability Coefficient: <code className="text-slate-300 px-1 py-0.5">{result.rawScore.toFixed(5)}</code></span>
                </div>
              </div>

              {/* Red Flags Accordion List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Warning Sign Analysis
                </h4>
                
                {result.redFlags.length === 0 ? (
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    No structural heuristic red flags matched.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {result.redFlags.map((flag, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                          flag.severity === 'high' 
                            ? 'bg-rose-500/5 border-rose-500/10' 
                            : 'bg-amber-500/5 border-amber-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <AlertTriangle className={`w-4 h-4 shrink-0 ${flag.severity === 'high' ? 'text-rose-400' : 'text-amber-400'}`} />
                          <span className={`font-bold ${flag.severity === 'high' ? 'text-rose-300' : 'text-amber-300'}`}>
                            {flag.title}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            flag.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {flag.severity}
                          </span>
                        </div>
                        <p className="text-slate-400">{flag.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Report Downloader Action */}
              <button
                onClick={handleDownloadReport}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white border border-slate-700/80 transition-colors shadow-inner"
              >
                <Download className="w-4 h-4" />
                Export Analytical PDF/Text Report
              </button>

            </div>
          )}

          {/* If no result and not loading, show prompt */}
          {!loading && !result && (
            <div className="p-8 rounded-3xl bg-slate-900/10 border border-slate-800/30 backdrop-blur-md flex flex-col items-center justify-center text-center min-h-[300px]">
              <ShieldCheck className="w-12 h-12 text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                Awaiting Verification Scan
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Paste your text into the editor and hit verify to run our neural classification models and heuristics filters.
              </p>
            </div>
          )}

          {/* Scan History list */}
          {scanHistory.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/10 border border-slate-800/30 backdrop-blur-md text-left">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  Recent Session Audits
                </h3>
                <button 
                  onClick={handleClearHistory}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2">
                {scanHistory.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 flex justify-between items-center text-xs"
                  >
                    <div className="space-y-1">
                      <p className="text-slate-300 font-medium truncate max-w-[180px] sm:max-w-[240px]">
                        {item.textSnippet}
                      </p>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Audited at {item.timestamp}
                      </span>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.classification === 'Legitimate' 
                        ? 'bg-emerald-500/15 text-emerald-400' 
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {item.classification}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
