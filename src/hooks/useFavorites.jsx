import { useState } from 'react'

const STORAGE_KEY = 'powDayFavorites';

const getInitialFavorites = () => {
  const storedFavorites = localStorage.getItem(STORAGE_KEY);

  if (!storedFavorites) return [];

  // Support existing comma-separated values while migrating to JSON storage.
  try {
    const parsedFavorites = JSON.parse(storedFavorites);
    if (Array.isArray(parsedFavorites)) {
      return parsedFavorites.map((id) => String(id));
    }
  } catch {
    // Fall through to legacy parsing.
  }

  return storedFavorites.split(',').filter(Boolean).map((id) => String(id));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(getInitialFavorites);

  const toggleFavorite = (resortId) => {
    const normalizedId = String(resortId);

    setFavorites((prevFavorites) => {
      const nextFavorites = prevFavorites.includes(normalizedId)
        ? prevFavorites.filter((id) => id !== normalizedId)
        : [...prevFavorites, normalizedId];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  };

  return { favorites, toggleFavorite };
};
