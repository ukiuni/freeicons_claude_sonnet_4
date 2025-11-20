import React from 'react';
import IconCard from './IconCard';
import './IconGrid.css';

const IconGrid = ({ icons, onIconClick, observerTarget, hasMore }) => {
  if (icons.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="empty-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2>アイコンが見つかりませんでした</h2>
        <p>検索条件を変更してみてください</p>
      </div>
    );
  }

  return (
    <div className="icon-grid-container">
      <div className="icon-grid" data-testid="icon-grid">
        {icons.map(icon => (
          <IconCard
            key={icon.id}
            icon={icon}
            onIconClick={onIconClick}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={observerTarget} className="loading-trigger">
          <div className="loading-spinner"></div>
          <p>読み込み中...</p>
        </div>
      )}
    </div>
  );
};

export default IconGrid;
