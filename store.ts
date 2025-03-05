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
    set({ loading: true });
    const phrases = await getPhrases();
    if (phrases.length === 0) {
      await setupDatabase();
      set({ loading: true });
      set({ phrases: await getPhrases() });
    }
    set({ phrases, loading: false });
  },

  // Load favorite phrases
  loadFavorites: async () => {
    set({ loading: true });
    const favoritePhrases = await getFavoritePhrases();
    set({ favoritePhrases, loading: false });
  },

  // Toggle favorite status
  toggleFavoritePhrase: async (phraseId) => {
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
  },

  // Remove from favorites
  removeFavoritePhrase: async (phraseId) => {
    await removeFavorite(phraseId);
    set((state) => ({
      favoritePhrases: state.favoritePhrases.filter((p) => p.id !== phraseId),
    }));
  },

  // Remove all favorites
  clearAllFavorites: async () => {
    await removeAllFavorites();
    set({ favoritePhrases: [] });
  },
}));
