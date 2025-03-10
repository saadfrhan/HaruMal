import { create } from "zustand";
import {
  setupDatabase,
  getPhrases,
  getFavoritePhrases,
  toggleFavorite,
  removeFavorite,
  removeAllFavorites,
} from "./database";
import { Phrase } from "./types";

type PhraseStore = {
  phrases: Phrase[];
  favoritePhrases: Phrase[];
  loading: boolean;
  loadPhrases: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavoritePhrase: (phraseId: number) => Promise<void>;
  removeFavoritePhrase: (phraseId: number) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
};

export const usePhraseStore = create<PhraseStore>((set) => ({
  phrases: [],
  favoritePhrases: [],
  loading: true,

  // Load all phrases
  loadPhrases: async () => {
    try {
      set({ loading: true });
      await setupDatabase();
      const phrases = await getPhrases();
      set({ phrases, loading: false });
    } catch (error) {
      console.error("Failed to load phrases:", error);
      set({ loading: false });
    }
  },

  // Load favorite phrases
  loadFavorites: async () => {
    try {
      set({ loading: true });
      const favoritePhrases = await getFavoritePhrases();
      set({ favoritePhrases, loading: false });
    } catch (error) {
      console.error("Failed to load favorite phrases:", error);
      set({ loading: false });
    }
  },

  // Toggle favorite status
  toggleFavoritePhrase: async (phraseId) => {
    try {
      set((state) => ({
        phrases: state.phrases.map((p) =>
          p.id === phraseId ? { ...p, favorite: p.favorite === 0 ? 1 : 0 } : p
        ),
        favoritePhrases: state.favoritePhrases.some((p) => p.id === phraseId)
          ? state.favoritePhrases.filter((p) => p.id !== phraseId)
          : [
              ...state.favoritePhrases,
              state.phrases.find((p) => p.id === phraseId)!,
            ],
      }));
      await toggleFavorite(phraseId);
    } catch (error) {
      console.error("Failed to toggle favorite phrase:", error);
    }
  },

  // Remove from favorites
  removeFavoritePhrase: async (phraseId) => {
    try {
      await removeFavorite(phraseId);
      set((state) => ({
        favoritePhrases: state.favoritePhrases.filter((p) => p.id !== phraseId),
      }));
    } catch (error) {
      console.error("Failed to remove favorite phrase:", error);
    }
  },

  // Remove all favorites
  clearAllFavorites: async () => {
    try {
      await removeAllFavorites();
      set({ favoritePhrases: [] });
    } catch (error) {
      console.error("Failed to clear all favorite phrases:", error);
    }
  },
}));
