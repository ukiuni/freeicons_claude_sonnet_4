import React, { useState } from 'react';
import { copyToClipboard, downloadSVG } from '../utils/clipboard';
import './IconCard.css';

const IconCard = ({ icon, onIconClick }) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copyToClipboard(icon.svg);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadSVG(icon.svg, icon.id);
  };

  return (
    <div
      className="icon-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onIconClick(icon)}
      data-testid="icon-card"
    >
      <div className="icon-preview">
        <div 
          className="icon-svg"
          dangerouslySetInnerHTML={{ __html: icon.svg }}
        />
      </div>
      
      <div className="icon-info">
        <h3 className="icon-title">{icon.title}</h3>
      </div>

      {showActions && (
        <div className="icon-actions">
          <button
            onClick={handleCopy}
            className="action-button"
            title="SVGコードをコピー"
            data-testid="copy-button"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="action-button"
            title="SVGファイルをダウンロード"
            data-testid="download-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
            </svg>
          </button>
        </div>
      )}

      {copied && (
        <div className="copied-toast">
          コピーしました！
        </div>
      )}
    </div>
  );
};

export default IconCard;
