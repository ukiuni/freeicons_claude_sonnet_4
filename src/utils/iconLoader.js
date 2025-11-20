// アイコンデータを読み込み
export const loadIcons = async () => {
  try {
    const response = await fetch('/freesvgicons/data/icons.json');
    if (!response.ok) {
      throw new Error('Failed to load icons');
    }
    const icons = await response.json();
    return icons;
  } catch (error) {
    console.error('Error loading icons:', error);
    return [];
  }
};
