import { useState, useEffect } from 'react';
import { Flame, ShieldAlert, Key, Terminal } from 'lucide-react';
import UploadZone from './components/UploadZone';
import RoastDashboard from './components/RoastDashboard';
import { roastProduct, demoRoast, RoastResponse } from './services/gemini';

interface TerminalLine {
  text: string;
  type: 'info' | 'scan' | 'crit' | 'success';
}

const SIMULATED_LOGS: TerminalLine[] = [
  { text: "[INFO] Initializing AI Product Roast Engine...", type: 'info' },
  { text: "[SCAN] Analyzing visual hierarchy & layout grid...", type: 'scan' },
  { text: "[SCAN] Running OCR copy parsing on Hero Header...", type: 'scan' },
  { text: "[CRITICAL] Buzzword soup detected: 'Leverage AI to Hyper-Optimize' found.", type: 'crit' },
  { text: "[SCAN] Scanning primary CTA conversion paths...", type: 'scan' },
  { text: "[CRITICAL] Conversion leak: stripe oauth required prior to core utility value.", type: 'crit' },
  { text: "[SCAN] Evaluating visual sidebar modules...", type: 'scan' },
  { text: "[WARN] Cognitive clutter: DB reads displayed alongside business MRR stats.", type: 'crit' },
  { text: "[SCAN] Checking credibility indicators & secure headers...", type: 'scan' },
  { text: "[WARN] Trust gap: SOC2, GDPR, or customer proof missing.", type: 'crit' },
  { text: "[INFO] Estimating Startup Delusion Index...", type: 'info' },
  { text: "[INFO] Drafting action plan & social hooks...", type: 'info' },
  { text: "[SUCCESS] Teardown finished. Rendering dashboard.", type: 'success' }
];

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLogs, setLoadingLogs] = useState<TerminalLine[]>([]);
  const [visibleHotspots, setVisibleHotspots] = useState<number[]>([]);
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

  // Run scanner simulation with logs typewriter output & dynamic hotspot rendering
  const runTeardownSimulation = (resultData: RoastResponse, callback: () => void) => {
    setLoading(true);
    setLoadingLogs([]);
    setVisibleHotspots([]);
    setError(null);

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < SIMULATED_LOGS.length) {
        setLoadingLogs(prev => [...prev, SIMULATED_LOGS[logIndex]]);
        
        // Dynamically pop in hotspots during the scan!
        if (logIndex === 3) setVisibleHotspots(prev => [...prev, 1]); // Hero
        if (logIndex === 5) setVisibleHotspots(prev => [...prev, 2]); // Stripe CTA
        if (logIndex === 7) setVisibleHotspots(prev => [...prev, 3]); // Sidebar
        if (logIndex === 9) setVisibleHotspots(prev => [...prev, 4]); // Footer
        
        logIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setRoastResult(resultData);
          setLoading(false);
          callback();
        }, 1000);
      }
    }, 600);

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

    try {
      setLoading(true);
      setLoadingLogs([{ text: "[INFO] Fetching analysis from Gemini multimodal API...", type: 'info' }]);
      setError(null);

      // Trigger actual API call first
      const result = await roastProduct(apiKey, file, context);
      
      // Once data returns, run the beautiful scanner animation to present it
      runTeardownSimulation(result, () => {});
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred during analysis.");
      setScreenshotUrl(null);
    }
  };

  const handleTryDemo = () => {
    setScreenshotUrl(null); // Triggers mock SVG wireframe display
    runTeardownSimulation(demoRoast, () => {});
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
            <Flame size={28} style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.4))' }} />
          </span>
          <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
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
          /* "Scanner Lab" Active Loading State */
          <div className="glass-card" style={{ 
            maxWidth: '800px', 
            margin: '30px auto', 
            textAlign: 'center', 
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} className="fire-gradient-text" /> Running Multimodal Heuristic Audit...
            </h3>

            {/* Scanning Box container */}
            <div className="scan-container" style={{ width: '100%', maxHeight: '380px' }}>
              <div className="laser-line"></div>
              
              {screenshotUrl ? (
                /* Real user image scanned */
                <div style={{ position: 'relative', width: '100%', maxHeight: '380px', overflow: 'hidden' }}>
                  <img src={screenshotUrl} alt="Scan Target" className="screenshot-image" style={{ width: '100%', height: 'auto' }} />
                  {/* Progressive hotspots */}
                  {demoRoast.annotations.map(hot => visibleHotspots.includes(hot.id) && (
                    <div 
                      key={hot.id} 
                      className={`hotspot ${hot.critique_type}`}
                      style={{ left: `${hot.x_percent}%`, top: `${hot.y_percent}%` }}
                    >
                      {hot.id}
                    </div>
                  ))}
                </div>
              ) : (
                /* SVG Wireframe dashboard scanned in Demo Mode */
                <div className="mock-dashboard-wireframe">
                  <div className="mock-dashboard-header">
                    <span className="mock-dashboard-logo">SaaSifyMetrics AI</span>
                    <div style={{ width: '60px', height: '14px', background: '#1c1c28', borderRadius: '4px' }}></div>
                  </div>
                  <div className="mock-dashboard-body">
                    <div className="mock-dashboard-sidebar">
                      <div className="mock-dashboard-sidebar-item"></div>
                      <div className="mock-dashboard-sidebar-item" style={{ width: '80%' }}></div>
                      <div className="mock-dashboard-sidebar-item"></div>
                    </div>
                    <div className="mock-dashboard-main">
                      <div className="mock-dashboard-hero-title"></div>
                      <div className="mock-dashboard-cta"></div>
                      <div className="mock-dashboard-charts-grid">
                        <div className="mock-dashboard-chart-card"></div>
                        <div className="mock-dashboard-chart-card"></div>
                        <div className="mock-dashboard-chart-card"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progressive hotspots */}
                  {demoRoast.annotations.map(hot => visibleHotspots.includes(hot.id) && (
                    <div 
                      key={hot.id} 
                      className={`hotspot ${hot.critique_type}`}
                      style={{ left: `${hot.x_percent}%`, top: `${hot.y_percent}%` }}
                    >
                      {hot.id}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Terminal output */}
            <div className="terminal-window">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '10px' }}>
                <Terminal size={14} /> <span>AUDIT_LOG_STREAM: active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {loadingLogs.map((log, idx) => (
                  <div key={idx} className={`terminal-line ${log.type}`}>
                    {log.text}
                  </div>
                ))}
              </div>
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
        fontSize: '12px' 
      }}>
        <p>© 2026 AI Product Roast. Strictly constructive tear-downs. No feelings were harmed in the making of this report.</p>
      </footer>

    </div>
  );
}
