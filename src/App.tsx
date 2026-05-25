import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Flame, ShieldAlert, Key, Terminal, Linkedin } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', textAlign: 'center', borderColor: 'var(--color-error)' }}>
          <h3 style={{ color: 'var(--color-error)', marginBottom: '10px' }}>Teardown Engine Crashed</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
            The PM bot hit an unexpected error rendering the dashboard.
          </p>
          <pre style={{ 
            background: '#000', 
            color: '#ff4b2b', 
            padding: '16px', 
            borderRadius: '4px', 
            fontSize: '12px', 
            textAlign: 'left', 
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            maxHeight: '250px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            lineHeight: 1.4
          }}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="fire-glow-button" 
            style={{ marginTop: '20px', fontSize: '13px' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
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
        const logItem = SIMULATED_LOGS[logIndex];
        setLoadingLogs(prev => [...prev, logItem]);
        
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
      
      {/* Floating LinkedIn Creator Pill */}
      <a 
        href="https://www.linkedin.com/in/sohamjanve" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-creator-pill no-print"
      >
        <span className="pill-avatar">SJ</span>
        <span className="pill-text">Connect with Soham Janve</span>
        <span className="pill-icon"><Linkedin size={12} /></span>
      </a>

      {/* GitHub Corner Ribbon */}
      <a 
        href="https://github.com/sohamjanve3/ai-product-roast" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="github-corner no-print" 
        aria-label="View source on GitHub"
      >
        <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: '#e11d48', color: '#fff', position: 'absolute', top: 0, border: 0, right: 0, zIndex: 1000 }} aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,97.5 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
        </svg>
      </a>

      {/* App Header */}
      <header className="app-header">
        <div className="brand">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4b2b' }}>
            <Flame size={28} style={{ filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.4))' }} />
          </span>
          <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
            AI <span className="fire-gradient-text">Product Roast</span> <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '8px' }} className="no-print">by Soham Janve</span>
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
          <ErrorBoundary>
            <RoastDashboard 
              roast={roastResult} 
              onReset={handleReset} 
              screenshotUrl={screenshotUrl} 
            />
          </ErrorBoundary>
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
      }} className="no-print">
        <p style={{ marginBottom: '8px' }}>
          © 2026 AI Product Roast. Strictly constructive tear-downs. No feelings were harmed.
        </p>
        <p>
          Designed & Built by <a href="https://www.linkedin.com/in/sohamjanve" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px dotted var(--text-muted)' }} className="hover-primary">Soham Janve</a> • Open Sourced on <a href="https://github.com/sohamjanve3/ai-product-roast" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px dotted var(--text-muted)' }} className="hover-primary">GitHub</a>
        </p>
      </footer>

    </div>
  );
}
