import { useState } from 'react';
import { RoastResponse, AnnotationItem } from '../services/gemini';
import { 
  AlertTriangle, CheckCircle, User, DollarSign, Rocket, 
  Linkedin, Mail, ArrowLeft, Printer, Copy, Check,
  Zap, Flame, Shield, HelpCircle
} from 'lucide-react';

interface RoastDashboardProps {
  roast: RoastResponse;
  onReset: () => void;
  screenshotUrl: string | null;
}

export default function RoastDashboard({ roast, onReset, screenshotUrl }: RoastDashboardProps) {
  const [activeFixIndex, setActiveFixIndex] = useState<number>(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<AnnotationItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<'linkedin' | 'substack' | 'cta' | null>(null);

  // Score Color Helper
  const getScoreColor = (score: number) => {
    if (score >= 7.5) return '#10b981';
    if (score >= 4.5) return '#f59e0b';
    return '#f43f5e';
  };

  const getScoreRiskLabel = (score: number) => {
    if (score >= 7.5) return 'HEALTHY';
    if (score >= 4.5) return 'WARNING';
    return 'CRITICAL';
  };

  const getCritiqueColor = (type: string) => {
    switch (type) {
      case 'copy_fail': return 'var(--color-error)';
      case 'friction': return 'var(--color-warning)';
      case 'confusion': return 'var(--accent-purple)';
      case 'trust_signal': return 'var(--color-info)';
      default: return 'var(--text-muted)';
    }
  };

  const getTooltipClass = (xPercent: number) => {
    if (xPercent < 25) return 'tooltip-left';
    if (xPercent > 75) return 'tooltip-right';
    return '';
  };

  // Convert key names to readable text
  const formatScoreKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, type: 'linkedin' | 'substack' | 'cta') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const overallColor = getScoreColor(roast.overall_score);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (roast.overall_score / 10) * circumference;

  const getViralMetricColor = (metric: string, val: number) => {
    if (metric === 'pm_sanity_score') {
      return val >= 70 ? 'var(--color-success)' : val >= 40 ? 'var(--color-warning)' : 'var(--color-error)';
    }
    return val >= 80 ? 'var(--color-error)' : val >= 50 ? 'var(--color-warning)' : 'var(--color-success)';
  };

  const shareTextCTA = `🔥 I just got my startup roasted by AI Product Roast! 
Verdict: "${roast.one_line_verdict}"
Delusion Index: ${roast.viral_metrics.startup_delusion_index}% | Buzzword Density: ${roast.viral_metrics.buzzword_density}%

Roast your own landing page for free: github.com/sohamjanve3/ai-product-roast
Built by Soham Janve #AIProductRoast`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', margin: '20px auto 0', maxWidth: '1100px' }}>
      
      {/* Back & Export buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s ease'
          }}
          className="hover-primary"
        >
          <ArrowLeft size={16} /> Roast Another Product
        </button>
        <button
          onClick={() => window.print()}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={14} /> Export PDF Slide Deck
        </button>
      </div>

      {/* -------------------------------------------------------------
         SLIDE 1: OVERVIEW, ANNOTATED SCREENSHOT & VIRAL METRICS
         ------------------------------------------------------------- */}
      <div className="deck-slide">
        
        {/* Main Side-by-Side Presentation Layout */}
        <div className="slide-side-by-side" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          {/* Left Block: Verdict Card */}
          <div className="glass-card slide-verdict-card" style={{ 
            flex: '1 1 450px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '30px',
            minHeight: '380px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  color: 'var(--color-error)', 
                  fontWeight: 800, 
                  letterSpacing: '0.1em', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  <Flame size={12} /> TEARDOWN SLIDE 1
                </span>
                
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  letterSpacing: '0.05em', 
                  textTransform: 'uppercase',
                  color: overallColor,
                  background: `${overallColor}15`,
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  OVERALL: {roast.overall_score}/10
                </span>
              </div>
              
              <h2 style={{ fontSize: '38px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                {roast.product_name}
              </h2>
              
              <p style={{ 
                fontSize: '18px', 
                color: 'var(--text-primary)', 
                lineHeight: 1.5, 
                fontStyle: 'italic', 
                borderLeft: '4px solid var(--accent-crimson)', 
                paddingLeft: '16px',
                marginTop: '10px'
              }}>
                "{roast.one_line_verdict}"
              </p>
            </div>

            {/* Overall Score Dial */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
              <div className="score-circle-wrapper">
                <svg className="score-circle-svg">
                  <circle className="score-circle-bg" cx="60" cy="60" r={radius} />
                  <circle 
                    className="score-circle-fill" 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    stroke={overallColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{
                      filter: `drop-shadow(0 0 8px ${overallColor}44)`
                    }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '30px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                    {roast.overall_score}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Score
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: overallColor }}>
                  {getScoreRiskLabel(roast.overall_score)} STATUS
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  This product shows critical activation drop-offs. Substantial optimization needed to achieve baseline market conversions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Annotated Image Canvas */}
          <div className="slide-screenshot-column" style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} style={{ color: 'var(--accent-amber)' }} /> Interactive Visual Teardown (Hover indicators)
            </span>
            
            <div className="annotation-wrapper">
              {screenshotUrl ? (
                <div style={{ position: 'relative' }}>
                  <img src={screenshotUrl} alt="Screenshot audit" className="screenshot-image" />
                  {/* Dynamic Hotspots */}
                  {roast.annotations.map(hot => (
                    <div 
                      key={hot.id} 
                      className={`hotspot ${hot.critique_type}`}
                      style={{ left: `${hot.x_percent}%`, top: `${hot.y_percent}%` }}
                      onMouseEnter={() => setHoveredHotspot(hot)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                    >
                      {hot.id}
                      <div className={`hotspot-tooltip ${getTooltipClass(hot.x_percent)}`}>
                        <strong style={{ display: 'block', marginBottom: '4px', color: getCritiqueColor(hot.critique_type) }}>
                          {hot.id}. {hot.element_name} ({hot.critique_type.toUpperCase().replace('_', ' ')})
                        </strong>
                        {hot.commentary}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Mock Dashboard Wireframe for Demo Mode */
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
                  
                  {/* Mock Hotspots */}
                  {roast.annotations.map(hot => (
                    <div 
                      key={hot.id} 
                      className={`hotspot ${hot.critique_type}`}
                      style={{ left: `${hot.x_percent}%`, top: `${hot.y_percent}%` }}
                      onMouseEnter={() => setHoveredHotspot(hot)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                    >
                      {hot.id}
                      <div className={`hotspot-tooltip ${getTooltipClass(hot.x_percent)}`}>
                        <strong style={{ display: 'block', marginBottom: '4px', color: getCritiqueColor(hot.critique_type) }}>
                          {hot.id}. {hot.element_name} ({hot.critique_type.toUpperCase().replace('_', ' ')})
                        </strong>
                        {hot.commentary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive commentary feed below image (crucial for mobile & print layout) */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: 'var(--border-radius-sm)', 
              padding: '12px 16px', 
              border: '1px solid var(--surface-border)',
              minHeight: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {hoveredHotspot ? (
                <div>
                  <strong style={{ color: getCritiqueColor(hoveredHotspot.critique_type), fontSize: '13px' }}>
                    Marker {hoveredHotspot.id}: {hoveredHotspot.element_name} — 
                  </strong>
                  <span style={{ fontSize: '13px', color: '#f3f4f6' }}> {hoveredHotspot.commentary}</span>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={16} /> Hover over markers on the screenshot to view detailed visual critiques.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Viral Metrics Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ fontSize: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} className="fire-gradient-text" /> Viral Growth Metrics
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            
            {/* Startup Delusion Index */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Startup Delusion Index</span>
                <strong style={{ color: getViralMetricColor('startup_delusion_index', roast.viral_metrics.startup_delusion_index) }}>
                  {roast.viral_metrics.startup_delusion_index}%
                </strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${roast.viral_metrics.startup_delusion_index}%`, 
                  height: '100%', 
                  background: getViralMetricColor('startup_delusion_index', roast.viral_metrics.startup_delusion_index) 
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Founder hubris vs actual value proposition.</span>
            </div>

            {/* Buzzword Density */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Buzzword Density</span>
                <strong style={{ color: getViralMetricColor('buzzword_density', roast.viral_metrics.buzzword_density) }}>
                  {roast.viral_metrics.buzzword_density}%
                </strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${roast.viral_metrics.buzzword_density}%`, 
                  height: '100%', 
                  background: getViralMetricColor('buzzword_density', roast.viral_metrics.buzzword_density) 
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Marketing-hype terms density on screen.</span>
            </div>

            {/* VC Bait Potential */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>VC Bait Potential</span>
                <strong style={{ color: getViralMetricColor('vc_bait_potential', roast.viral_metrics.vc_bait_potential) }}>
                  {roast.viral_metrics.vc_bait_potential}%
                </strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${roast.viral_metrics.vc_bait_potential}%`, 
                  height: '100%', 
                  background: getViralMetricColor('vc_bait_potential', roast.viral_metrics.vc_bait_potential) 
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Probability of raising money before shutdown.</span>
            </div>

            {/* PM Sanity Score */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PM Sanity Score</span>
                <strong style={{ color: getViralMetricColor('pm_sanity_score', roast.viral_metrics.pm_sanity_score) }}>
                  {roast.viral_metrics.pm_sanity_score}%
                </strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${roast.viral_metrics.pm_sanity_score}%`, 
                  height: '100%', 
                  background: getViralMetricColor('pm_sanity_score', roast.viral_metrics.pm_sanity_score) 
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Logical UX soundness from a PM perspective.</span>
            </div>

          </div>
        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>

      </div>

      {/* -------------------------------------------------------------
         SLIDE 2: DETAILED SCORECARDS WITH STORY-DRIVEN DESCRIPTIONS
         ------------------------------------------------------------- */}
      <div className="deck-slide glass-card" style={{ padding: '30px' }}>
        <div style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '15px', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 800, letterSpacing: '0.15em' }}>
            TEARDOWN SLIDE 2
          </span>
          <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '4px' }}>
            UX Dimension Scorecards
          </h3>
        </div>

        <div className="scorecards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {Object.entries(roast.scores).map(([key, val]) => {
            const interpretation = roast.score_interpretations[key as keyof typeof roast.score_interpretations] || "";
            const categoryColor = getScoreColor(val);
            return (
              <div 
                key={key} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  background: 'rgba(255,255,255,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatScoreKey(key)}
                    </span>
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: 800, 
                      color: categoryColor, 
                      letterSpacing: '0.05em',
                      border: `1px solid ${categoryColor}33`,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      width: 'fit-content',
                      marginTop: '4px'
                    }}>
                      {getScoreRiskLabel(val)}
                    </span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: categoryColor }}>
                    {val}/10
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {interpretation}
                </p>

                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden', marginTop: 'auto' }}>
                  <div style={{ 
                    width: `${val * 10}%`, 
                    height: '100%', 
                    background: categoryColor,
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>

      </div>

      {/* -------------------------------------------------------------
         SLIDE 3: CRITIQUE POINTS (WHAT FAILS VS WHAT WORKS)
         ------------------------------------------------------------- */}
      <div className="deck-slide slide3-container">
        <div className="slide3-critique-deck" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', width: '100%' }}>
          
          {/* What Fails Card */}
          <div className="glass-card critique-fails-card" style={{ borderColor: 'rgba(244, 63, 94, 0.2)', padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 800, letterSpacing: '0.15em' }}>
                TEARDOWN SLIDE 3 (A)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-error)', marginTop: '4px' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Friction & Cognitive Noise</h3>
              </div>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyleType: 'none' }}>
              {roast.what_fails.map((fail, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', lineHeight: 1.5, color: '#f3f4f6' }}>
                  <span style={{ color: 'var(--color-error)', flexShrink: 0, fontWeight: 'bold', fontSize: '16px' }}>•</span>
                  <span>{fail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Works Card */}
          <div className="glass-card critique-works-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)', padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 800, letterSpacing: '0.15em' }}>
                TEARDOWN SLIDE 3 (B)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-success)', marginTop: '4px' }}>
                <CheckCircle size={22} />
                <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Intelligent Optimizations</h3>
              </div>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyleType: 'none' }}>
              {roast.what_works.map((work, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--color-success)', flexShrink: 0, fontWeight: 'bold' }}>✓</span>
                  <span>{work}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
         SLIDE 4: PRIORITIZED ACTION PLAN & PM NOTE
         ------------------------------------------------------------- */}
      <div className="deck-slide glass-card slide4-deck" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 800, letterSpacing: '0.15em' }}>
            TEARDOWN SLIDE 4
          </span>
          <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '4px' }}>
            Prioritized Roadmap & Strategy
          </h3>
        </div>

        <div className="slide4-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          
          {/* Top 3 Accordions */}
          <div className="fixes-accordion-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roast.top_3_fixes.map((fix, idx) => {
              const isActive = activeFixIndex === idx;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div 
                    className={`accordion-header ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveFixIndex(isActive ? -1 : idx)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        background: isActive ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.04)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: isActive ? '#fff' : 'var(--text-primary)' }}>
                        {fix.split(':')[0] || fix}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {isActive ? 'Hide' : 'Why it works'}
                    </span>
                  </div>

                  {isActive && (
                    <div className="accordion-content">
                      <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#f3f4f6' }}>
                        {fix.substring(fix.indexOf(':') + 1).trim() || fix}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PM Strategist Note */}
          <div className="pm-note-card" style={{ 
            background: 'rgba(255,255,255,0.01)', 
            border: '1px solid var(--surface-border)', 
            borderRadius: 'var(--border-radius-md)', 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} style={{ color: 'var(--accent-crimson)' }} /> Executive PM Guidance
            </h4>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
              {roast.pm_recommendation}
            </p>
          </div>

        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>

      </div>

      {/* -------------------------------------------------------------
         SLIDE 5: DISTRIBUTION & VIRALLY OPTIMIZED SOCIAL SHARING
         ------------------------------------------------------------- */}
      <div className="deck-slide">
        
        {/* Profile & Business Details */}
        <div className="slide5-top-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
              <User size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Target User Persona</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.likely_target_user}</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Monetization Model</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.likely_monetization_model}</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '10px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', color: '#fbbf24' }}>
              <Rocket size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Growth distribution Angle</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.best_growth_angle}</p>
            </div>
          </div>
        </div>

        {/* Viral Hooks Cards */}
        <div className="glass-card slide5-hooks-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 800, letterSpacing: '0.15em' }}>
              TEARDOWN SLIDE 5
            </span>
            <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '4px' }}>
              Viral Sharing Content
            </h3>
          </div>

          <div className="slide5-hooks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            
            {/* LinkedIn Hook */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#0077b5' }}>
                  <Linkedin size={16} /> LinkedIn Viral Hook
                </span>
                <button
                  onClick={() => handleCopy(roast.linkedin_hook, 'linkedin')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedLink === 'linkedin' ? 'var(--color-success)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedLink === 'linkedin' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink === 'linkedin' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
                "{roast.linkedin_hook}"
              </p>
            </div>

            {/* Substack Hook */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#ff5400' }}>
                  <Mail size={16} /> Substack Subject & Teaser
                </span>
                <button
                  onClick={() => handleCopy(roast.substack_hook, 'substack')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedLink === 'substack' ? 'var(--color-success)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedLink === 'substack' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedLink === 'substack' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
                "{roast.substack_hook}"
              </p>
            </div>

          </div>

          {/* Quick-copy Viral CTA */}
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.03)', 
            border: '1px solid rgba(244, 63, 94, 0.15)', 
            padding: '16px 20px', 
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '10px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <strong style={{ fontSize: '14px', color: '#fff' }}>Share your roast score to social media</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click copy to generate a beautifully structured template of your teardown.</span>
            </div>
            <button
              onClick={() => handleCopy(shareTextCTA, 'cta')}
              className="fire-glow-button"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {copiedLink === 'cta' ? <Check size={14} /> : <Copy size={14} />}
              {copiedLink === 'cta' ? 'Copied Viral Post!' : 'Copy Share Template'}
            </button>
          </div>

        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>

      </div>

      {/* -------------------------------------------------------------
         SLIDE 6: AUDIT EVIDENCE, CONFIDENCE & REFERENCE
         ------------------------------------------------------------- */}
      <div className="deck-slide glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 800, letterSpacing: '0.15em' }}>
            TEARDOWN REFERENCE
          </span>
          <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '4px' }}>
            Audit Evidence & Technical Reference
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: 'rgba(255,255,255,0.01)', padding: '12px 16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--surface-border)' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            Heuristic Audit Confidence rating: <strong style={{ color: 'var(--accent-emerald)' }}>{roast.confidence}%</strong>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Calculated on visual markers and layout structures.
          </span>
        </div>

        <div className="slide6-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h5 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 700 }}>Evidence Used in Roast:</h5>
            <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {roast.evidence_used.map((ev, i) => <li key={i}>{ev}</li>)}
            </ul>
          </div>
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h5 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 700 }}>Missing Information:</h5>
            <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {roast.missing_information.map((mi, i) => <li key={i}>{mi}</li>)}
            </ul>
          </div>
        </div>

        {/* Slide Footer / Attribution Watermark */}
        <div className="print-slide-footer">
          <span>linkedin.com/in/sohamjanve</span>
          <span>Teardown by Soham Janve • github.com/sohamjanve3/ai-product-roast</span>
        </div>

      </div>

    </div>
  );
}
