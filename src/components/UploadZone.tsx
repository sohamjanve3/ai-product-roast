import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Key, AlertCircle, Info } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (file: File, context: string) => void;
  onTryDemo: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function UploadZone({ onAnalyze, onTryDemo, apiKey, onApiKeyChange }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contextText, setContextText] = useState('');
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onAnalyze(selectedFile, contextText);
    }
  };

  const saveApiKey = () => {
    onApiKeyChange(tempKey);
    setShowKeyDrawer(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', margin: '40px auto 0', maxWidth: '800px' }}>
      
      {/* Brand Teaser */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '36px', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '12px' }}>
          Get <span className="fire-gradient-text">Brutally Honest</span> Product Feedback
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Drop in a screenshot of your landing page, SaaS dashboard, or signup flow. Our PM bot will critique your conversion rates, value prop, and UX. No sugar coating.
        </p>
      </div>

      {/* Main Upload Box */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Drag/Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          style={{
            border: '2px dashed ' + (dragActive ? 'var(--color-error)' : 'var(--surface-border)'),
            borderRadius: 'var(--border-radius-md)',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'rgba(255, 75, 43, 0.05)' : 'rgba(255, 255, 255, 0.01)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          
          {imagePreview ? (
            <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Upload preview" 
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--border-radius-sm)' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ImageIcon size={12} /> Replace Image
              </div>
            </div>
          ) : (
            <>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(255, 75, 43, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#ff4b2b',
                marginBottom: '8px'
              }}>
                <Upload size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Drag and drop screenshot here</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Supports PNG, JPG, JPEG up to 10MB</p>
            </>
          )}
        </div>

        {/* Text Context Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Additional Context <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            <span title="Add context like who the target users are, what the page is for, or business goals." style={{ cursor: 'pointer', display: 'inline-flex', color: 'var(--text-muted)' }}>
              <Info size={14} />
            </span>
          </label>
          <textarea
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder="e.g. This is the new sign-up flow for our AI newsletter builder. We are targeting freelance copywriters, and our primary goal is increasing email submissions."
            style={{
              width: '100%',
              minHeight: '80px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        {/* Action Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--surface-border)', paddingTop: '20px' }}>
          
          {/* API Key configuration status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowKeyDrawer(!showKeyDrawer)}
              style={{
                background: 'transparent',
                border: 'none',
                color: apiKey ? 'var(--color-success)' : 'var(--color-warning)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'underline'
              }}
            >
              <Key size={14} />
              {apiKey ? "Gemini Key Configured ✓" : "Set Gemini API Key for custom uploads"}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Try Demo Button */}
            <button
              type="button"
              onClick={onTryDemo}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--surface-border)',
                padding: '12px 20px',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
            >
              <Sparkles size={16} style={{ color: '#ffbb00' }} />
              Try Demo Roast
            </button>

            {/* Submit Roast Button */}
            <button
              type="submit"
              disabled={!selectedFile}
              className="fire-glow-button"
              style={{
                fontSize: '14px'
              }}
            >
              Roast My Product
            </button>
          </div>
        </div>

        {/* API Key Modal / Expandable Drawer */}
        {showKeyDrawer && (
          <div style={{
            background: 'rgba(255, 75, 43, 0.04)',
            border: '1px solid rgba(255, 75, 43, 0.2)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '16px',
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} /> Enter your Gemini API Key
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              To roast custom screenshots, supply a Google Gemini API Key. It runs entirely in your browser and is saved securely in your local browser storage. Get a free key at the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#ff4b2b', textDecoration: 'underline' }}>Google AI Studio</a>.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={saveApiKey}
                style={{
                  background: '#ff4b2b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                Save
              </button>
            </div>
            {!apiKey && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--color-warning)', fontSize: '12px' }}>
                <AlertCircle size={12} />
                <span>Without an API key, you can only run the preloaded demo teardown.</span>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
