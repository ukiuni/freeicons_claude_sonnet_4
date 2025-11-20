import React, { useEffect } from 'react';
import { copyToClipboard, downloadSVG } from '../utils/clipboard';
import './IconModal.css';

const IconModal = ({ icon, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // ESCキーで閉じる
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // スクロール防止
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleCopy = async () => {
    const success = await copyToClipboard(icon.svg);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadSVG(icon.svg, icon.id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!icon) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      data-testid="icon-modal"
    >
      <div className="modal-content">
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="閉じる"
          data-testid="modal-close"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="modal-icon-preview">
          <div 
            className="modal-icon-svg"
            dangerouslySetInnerHTML={{ __html: icon.svg }}
          />
        </div>

        <div className="modal-info">
          <h2 className="modal-title">{icon.title}</h2>
          <p className="modal-description">{icon.description}</p>
          
          {icon.tags && icon.tags.length > 0 && (
            <div className="modal-tags">
              {icon.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            onClick={handleCopy}
            className="modal-button primary"
            data-testid="modal-copy-button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'コピーしました！' : 'SVGをコピー'}
          </button>
          <button 
            onClick={handleDownload}
            className="modal-button secondary"
            data-testid="modal-download-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
            </svg>
            ダウンロード
          </button>
        </div>

        <div className="modal-code">
          <div className="code-header">
            <span>SVG Code</span>
          </div>
          <pre className="code-content">
            <code>{icon.svg}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default IconModal;
