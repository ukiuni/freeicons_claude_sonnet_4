import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import IconGrid from './components/IconGrid';
import IconModal from './components/IconModal';
import { useIconSearch } from './hooks/useIconSearch';
import { usePagination } from './hooks/usePagination';
import { loadIcons } from './utils/iconLoader';
import './App.css';

function App() {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);

  // アイコンデータの読み込み
  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      const data = await loadIcons();
      setIcons(data);
      setLoading(false);
    };
    fetchIcons();
  }, []);

  // 検索機能
  const { filteredIcons } = useIconSearch(icons, searchQuery);

  // ページネーション（無限スクロール）
  const { displayedItems, observerTarget, hasMore, resetPagination } = usePagination(filteredIcons, 100);

  // 検索クエリ変更時にページネーションをリセット
  useEffect(() => {
    resetPagination();
  }, [searchQuery, resetPagination]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  const handleCloseModal = () => {
    setSelectedIcon(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner large"></div>
        <p>アイコンを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        totalIcons={icons.length}
        filteredCount={filteredIcons.length}
        searchQuery={searchQuery}
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <IconGrid 
        icons={displayedItems}
        onIconClick={handleIconClick}
        observerTarget={observerTarget}
        hasMore={hasMore}
      />

      {selectedIcon && (
        <IconModal 
          icon={selectedIcon}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
