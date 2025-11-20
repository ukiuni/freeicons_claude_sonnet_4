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
      const titleMatch = icon.title.toLowerCase().includes(query);
      const descriptionMatch = icon.description.toLowerCase().includes(query);
      const tagsMatch = icon.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || descriptionMatch || tagsMatch;
    });

    setIsSearching(false);
    return results;
  }, [icons, searchQuery]);

  return { filteredIcons, isSearching };
};
