import React from 'react';
import { Link } from 'react-router-dom';
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
      <nav className="header-nav">
        <Link to="/terms" className="nav-link" data-testid="terms-link">
          利用規約
        </Link>
      </nav>
    </header>
  );
};

export default Header;
