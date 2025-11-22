import { useState, useEffect, useMemo } from 'react';

export const useIconSearch = (icons, searchQuery) => {
  const [isSearching, setIsSearching] = useState(false);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return icons;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    
    const results = icons.filter(icon => {
      // 英語フィールドでの検索
      const titleMatch = icon.title.toLowerCase().includes(query);
      const descriptionMatch = icon.description.toLowerCase().includes(query);
      const tagsMatch = icon.tags?.some(tag => tag.toLowerCase().includes(query));
      
      // 日本語フィールドでの検索
      const titleJaMatch = icon.titleJa?.toLowerCase().includes(query);
      const descriptionJaMatch = icon.descriptionJa?.toLowerCase().includes(query);
      const tagsJaMatch = icon.tagsJa?.some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || descriptionMatch || tagsMatch || 
             titleJaMatch || descriptionJaMatch || tagsJaMatch;
    });

    setIsSearching(false);
    return results;
  }, [icons, searchQuery]);

  return { filteredIcons, isSearching };
};
