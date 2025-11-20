import React from 'react';
import './Header.css';

const Header = ({ totalIcons, filteredCount, searchQuery }) => {
  return (
    <header className="header" data-testid="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Free SVG Icons</h1>
          <p className="header-subtitle">高品質なSVGアイコンライブラリ</p>
        </div>
        <div className="header-stats">
          {searchQuery ? (
            <span className="icon-count">
              {filteredCount.toLocaleString()} / {totalIcons.toLocaleString()} icons
            </span>
          ) : (
            <span className="icon-count">
              {totalIcons.toLocaleString()} icons
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
