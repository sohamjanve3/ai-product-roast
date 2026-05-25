import { useState, useEffect } from 'react';
import { Flame, ShieldAlert, Key } from 'lucide-react';
import UploadZone from './components/UploadZone';
import RoastDashboard from './components/RoastDashboard';
import { roastProduct, demoRoast, RoastResponse } from './services/gemini';

const LOADING_STAGES = [
  "Reading landing page copy & searching for buzzword soup...",
  "Sizing up primary Call to Action (CTA) friction...",
  "Evaluating trust signals (or lack thereof)...",
  "Assessing activation flow & founder ego levels...",
  "Drafting brutally honest feedback deck..."
];

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const [roastResult, setRoastResult] = useState<RoastResponse | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync API Key from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };

  // Simulates the funny PM loading stages
  const runLoadingSimulation = (callback: () => void) => {
    setLoading(true);
    setLoadingStage(0);
    setError(null);

    const interval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev >= LOADING_STAGES.length - 1) {
          clearInterval(interval);
          callback();
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return interval;
  };

  const handleAnalyze = async (file: File, context: string) => {
    if (!apiKey) {
      setError("Please set a Gemini API Key first or use 'Try Demo Roast'.");
      return;
    }

    // Set preview URL
    const previewUrl = URL.createObjectURL(file);
    setScreenshotUrl(previewUrl);

    let activeInterval: any;

    try {
      // Start loading simulation
      activeInterval = runLoadingSimulation(() => {});

      // Trigger actual API call
      const result = await roastProduct(apiKey, file, context);
      
      clearInterval(activeInterval);
      setRoastResult(result);
      setLoading(false);
    } catch (err: any) {
      if (activeInterval) clearInterval(activeInterval);
      setLoading(false);
      setError(err?.message || "An unexpected error occurred during analysis.");
      setScreenshotUrl(null);
    }
  };

  const handleTryDemo = () => {
    setScreenshotUrl(null);
    runLoadingSimulation(() => {
      setRoastResult(demoRoast);
      setLoading(false);
    });
  };

  const handleReset = () => {
    setRoastResult(null);
    setScreenshotUrl(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* App Header */}
      <header className="app-header">
        <div className="brand">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4b2b' }}>
            <Flame size={32} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 75, 43, 0.4))' }} />
          </span>
          <h1 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)' }}>
            AI <span className="fire-gradient-text">Product Roast</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {apiKey && (
            <button
              onClick={() => handleApiKeyChange('')}
              className="config-btn"
              title="Clear API Key"
            >
              <Key size={14} /> Clear Key
            </button>
          )}
        </div>
      </header>

      {/* Main Area */}
      <main className="main-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Error notification */}
        {error && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 20px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--color-error)'
          }}>
            <ShieldAlert size={20} />
            <p style={{ fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {loading ? (
          /* Loading State screen */
          <div className="glass-card" style={{ 
            maxWidth: '600px', 
            margin: '40px auto', 
            textAlign: 'center', 
            padding: '50px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <Flame 
                size={64} 
                style={{ 
                  color: '#ff4b2b',
                  animation: 'flamePulse 1.5s infinite ease-in-out',
                  filter: 'drop-shadow(0 0 12px rgba(255, 75, 43, 0.5))'
                }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)' }}>Roasting in progress...</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', minHeight: '40px', lineHeight: 1.5 }}>
                {LOADING_STAGES[loadingStage]}
              </p>
            </div>

            {/* Fake progress bar track */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${((loadingStage + 1) / LOADING_STAGES.length) * 100}%`, 
                height: '100%', 
                background: 'var(--primary-gradient)',
                borderRadius: '2px',
                transition: 'width 0.5s ease-in-out'
              }} />
            </div>
          </div>
        ) : roastResult ? (
          /* Dashboard Results screen */
          <RoastDashboard 
            roast={roastResult} 
            onReset={handleReset} 
            screenshotUrl={screenshotUrl} 
          />
        ) : (
          /* Upload / Start screen */
          <UploadZone 
            onAnalyze={handleAnalyze} 
            onTryDemo={handleTryDemo}
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '30px', 
        borderTop: '1px solid var(--surface-border)', 
        color: 'var(--text-muted)', 
        fontSize: '13px' 
      }}>
        <p>© 2026 AI Product Roast. No feelings were harmed in the making of this landing page.</p>
      </footer>

    </div>
  );
}
