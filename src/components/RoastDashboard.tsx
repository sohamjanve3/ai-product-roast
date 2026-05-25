import { useState } from 'react';
import { RoastResponse } from '../services/gemini';
import { 
  AlertTriangle, CheckCircle, ArrowRight, User, DollarSign, Rocket, 
  Linkedin, Mail, ArrowLeft, Printer, ShieldAlert, Sparkles, Copy, Check 
} from 'lucide-react';

interface RoastDashboardProps {
  roast: RoastResponse;
  onReset: () => void;
  screenshotUrl: string | null;
}

export default function RoastDashboard({ roast, onReset, screenshotUrl }: RoastDashboardProps) {
  const [activeFixIndex, setActiveFixIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<'linkedin' | 'substack' | null>(null);

  // Score Color Helper
  const getScoreColor = (score: number) => {
    if (score >= 7.5) return 'var(--color-success)';
    if (score >= 4.5) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  // Convert key names to readable text
  const formatScoreKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, type: 'linkedin' | 'substack') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const overallColor = getScoreColor(roast.overall_score);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Normalize score out of 10
  const dashOffset = circumference - (roast.overall_score / 10) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', margin: '20px auto 0', maxWidth: '1100px' }}>
      
      {/* Back & Export buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <Printer size={14} /> Export Report
        </button>
      </div>

      {/* Hero Overview Card */}
      <div className="glass-card" style={{ 
        display: 'flex', 
        gap: '30px', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        padding: '36px',
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Score Ring */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
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
              <div style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--text-primary)' }}>
                {roast.overall_score}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                / 10
              </div>
            </div>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 700, 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase',
            color: overallColor,
            background: `${overallColor}12`,
            padding: '4px 10px',
            borderRadius: '12px'
          }}>
            {roast.overall_score >= 7.5 ? 'Good' : roast.overall_score >= 4.5 ? 'Average' : 'Critical'}
          </span>
        </div>

        {/* Verdict Details */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--color-error)', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} /> Teardown Verdict
            </span>
          </div>
          <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            {roast.product_name}
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-primary)', 
            lineHeight: 1.5, 
            fontStyle: 'italic', 
            borderLeft: '3px solid #ff4b2b', 
            paddingLeft: '16px',
            marginTop: '10px'
          }}>
            "{roast.one_line_verdict}"
          </p>
        </div>

        {/* Screenshot mini-preview if uploaded */}
        {screenshotUrl && (
          <div style={{ 
            width: '180px', 
            height: '110px', 
            overflow: 'hidden', 
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid var(--surface-border)',
            flexShrink: 0
          }}>
            <img src={screenshotUrl} alt="Analyzed Page" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      {/* Grid of Scores & Mini Progress Bars */}
      <div>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Detailed Scorecard
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(roast.scores).map(([key, val]) => (
            <div key={key} className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatScoreKey(key)}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: getScoreColor(val) }}>
                  {val}/10
                </span>
              </div>
              {/* Custom Track and Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${val * 10}%`, 
                  height: '100%', 
                  background: getScoreColor(val),
                  borderRadius: '3px',
                  boxShadow: `0 0 6px ${getScoreColor(val)}77`
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Works vs What Fails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginTop: '10px' }}>
        
        {/* What Fails Card */}
        <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.2)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-error)' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Critique & Friction points</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyleType: 'none' }}>
            {roast.what_fails.map((fail, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: 1.5, color: '#f3f4f6' }}>
                <span style={{ color: 'var(--color-error)', flexShrink: 0, fontWeight: 'bold' }}>•</span>
                <span>{fail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Works Card */}
        <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-success)' }}>
            <CheckCircle size={20} />
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>What Works</h3>
          </div>
          {roast.what_works.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyleType: 'none' }}>
              {roast.what_works.map((work, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--color-success)', flexShrink: 0, fontWeight: 'bold' }}>✓</span>
                  <span>{work}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>
              No redeeming elements identified in this screenshot.
            </p>
          )}
        </div>
      </div>

      {/* Top 3 Prioritized Fixes */}
      <div className="glass-card" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '6px' }}>
            Top 3 High-Impact Fixes
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Action plan for the next 30 days to optimize conversions and activation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      background: isActive ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: isActive ? '#fff' : 'var(--text-primary)' }}>
                      {fix.split(':')[0] || fix}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isActive ? 'Hide Detail' : 'Show Why it Works'} <ArrowRight size={12} style={{ transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </span>
                </div>

                {isActive && (
                  <div className="accordion-content">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#f3f4f6' }}>
                        {fix.substring(fix.indexOf(':') + 1).trim() || fix}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        alignItems: 'center', 
                        background: 'rgba(255, 75, 43, 0.04)', 
                        padding: '10px 14px', 
                        borderRadius: '4px',
                        borderLeft: '3px solid #ff4b2b',
                        fontSize: '13px'
                      }}>
                        <ShieldAlert size={16} style={{ color: '#ff4b2b', flexShrink: 0 }} />
                        <span><strong>PM Implementation Logic:</strong> Prioritize this change to bypass immediate onboarding friction, directly shortening the user's path to experiencing product value.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Positioning Brief */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '10px' }}>
        
        {/* Target Profile */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
            <User size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Likely Target User</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.likely_target_user}</p>
          </div>
        </div>

        {/* Business Model */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
            <DollarSign size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Likely Monetization</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.likely_monetization_model}</p>
          </div>
        </div>

        {/* Growth Angle */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ padding: '10px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', color: '#fbbf24' }}>
            <Rocket size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Best Growth Angle</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roast.best_growth_angle}</p>
          </div>
        </div>
      </div>

      {/* Detailed PM Recommendation Note */}
      <div className="glass-card" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
          Product Strategist Note
        </h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
          {roast.pm_recommendation}
        </p>
      </div>

      {/* Social Hook Content Generators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', marginTop: '10px' }}>
        
        {/* LinkedIn Hook card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
            "{roast.linkedin_hook}"
          </p>
        </div>

        {/* Substack Newsletter Teaser */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#ff5400' }}>
              <Mail size={16} /> Substack Teader / Subject Line
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
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
            "{roast.substack_hook}"
          </p>
        </div>
      </div>

      {/* Meta details & confidence metrics */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0, 0, 0, 0.1)', borderColor: 'rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Roast Confidence Rating: <strong>{roast.confidence}%</strong>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Calculated on visual markers and layout structures.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <h5 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Evidence Used in Roast:</h5>
            <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {roast.evidence_used.map((ev, i) => <li key={i}>{ev}</li>)}
            </ul>
          </div>
          <div>
            <h5 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Missing Information:</h5>
            <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {roast.missing_information.map((mi, i) => <li key={i}>{mi}</li>)}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
