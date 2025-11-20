import { useState, useEffect, useCallback, useRef } from 'react';

// シンプルなページネーション実装（仮想スクロールの代替として軽量）
export const usePagination = (items, itemsPerPage = 100) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState([]);
  const observerTarget = useRef(null);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // 表示するアイテムを計算
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedItems(items.slice(startIndex, endIndex));
  }, [items, currentPage, itemsPerPage]);

  // Intersection Observerで無限スクロール実装
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [currentPage, totalPages]);

  // 検索時にページをリセット
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    displayedItems,
    currentPage,
    totalPages,
    hasMore: currentPage < totalPages,
    observerTarget,
    resetPagination
  };
};
