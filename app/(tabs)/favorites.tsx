import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "expo-router";
import * as Speech from "expo-speech";
import { usePhraseStore } from "../../store";
import { Phrase } from "../../types";

export default function FavoritesScreen() {
  const favoritePhrases = usePhraseStore((state) => state.favoritePhrases);
  const loading = usePhraseStore((state) => state.loading);
  const loadFavorites = usePhraseStore((state) => state.loadFavorites);
  const removeFavoritePhrase = usePhraseStore(
    (state) => state.removeFavoritePhrase
  );
  const clearAllFavorites = usePhraseStore((state) => state.clearAllFavorites);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number>();

  useEffect(() => {
    loadFavorites();
  }, []);

  const speakKorean = (phrase: Phrase) => {
    if (!phrase.korean || playingId === phrase.id) return;
    setPlayingId(phrase.id);
    Speech.speak(phrase.korean, {
      language: "ko-KR",
      onDone: () => setPlayingId(undefined),
      onStopped: () => setPlayingId(undefined),
    });
  };

  const toggleSpeech = (phrase: Phrase) => {
    if (playingId === phrase.id) {
      Speech.stop();
      setPlayingId(undefined);
    } else {
      speakKorean(phrase);
    }
  };

  const filteredPhrases = favoritePhrases.filter((phrase) =>
    phrase.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⭐ Favorite Phrases</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search favorites..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : filteredPhrases.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite phrases yet!</Text>
      ) : (
        <FlatList
          data={filteredPhrases}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.korean}>{item.korean}</Text>
              <Text style={styles.romanization}>{item.romanization}</Text>
              <Text style={styles.english}>{item.english}</Text>

              <View>
                <Icon
                  style={styles.speakButton}
                  onPress={() => toggleSpeech(item)}
                  name={playingId === item.id ? "pause" : "play-arrow"}
                  size={32}
                  color="white"
                />
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => removeFavoritePhrase(item.id)}
                >
                  <Icon name="favorite" size={25} color="#C52D2D" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {favoritePhrases.length > 0 && (
        <TouchableOpacity
          style={styles.removeAllButton}
          onPress={clearAllFavorites}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Remove All Favorites
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#FFF8E3",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C52D2D",
    textAlign: "center",
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  korean: {
    fontSize: 24,
    fontWeight: "bold",
    // textAlign: "center",
    color: "#3E2723",
  },
  romanization: {
    fontSize: 16,
    fontStyle: "italic",
    // textAlign: "center",
    color: "#666",
  },
  english: {
    fontSize: 18,
    fontWeight: "bold",
    // textAlign: "center",
    color: "#444",
  },
  speakButton: {
    color: "#1C5C2E",
    position: "absolute",
    right: 32,
    bottom: -4,
  },
  favoriteButton: {
    backgroundColor: "#fff",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  removeAllButton: {
    backgroundColor: "#C52D2D",
    padding: 10,
    borderRadius: 10,
    marginBlock: 10,
  },
  loadingText: { fontSize: 20, color: "#555" },
  noFavoritesText: { fontSize: 20, color: "#555" },
});
