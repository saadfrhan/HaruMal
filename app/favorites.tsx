import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Speech from "expo-speech";
import { Link } from "expo-router";
import { usePhraseStore } from "../store";
import { Phrase } from "../types";

export default function Favorites() {
  const {
    favoritePhrases,
    loading,
    loadFavorites,
    removeFavoritePhrase,
    clearAllFavorites,
  } = usePhraseStore();

  useEffect(() => {
    loadFavorites(); // Fetch favorites when component mounts
  }, []);

  const speakKorean = (text: string) => {
    Speech.speak(text, {
      language: "ko-KR",
    });
  };

  const renderItem = ({ item }: { item: Phrase }) => (
    <View style={styles.listItem}>
      <View style={styles.textContainer}>
        <Text style={styles.korean} numberOfLines={2} ellipsizeMode="tail">
          {item.korean}
        </Text>
        <Text
          style={styles.romanization}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.romanization}
        </Text>
        <Text style={styles.english} numberOfLines={2} ellipsizeMode="tail">
          {item.english}
        </Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => speakKorean(item.korean)}
        >
          <Icon name="play-arrow" size={33} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => removeFavoritePhrase(item.id)}
        >
          <Icon name="favorite" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("./assets/hanji-bg.png")}
      style={styles.container}
    >
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : favoritePhrases.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite phrases yet!</Text>
      ) : (
        <FlatList
          data={favoritePhrases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {favoritePhrases.length > 0 && (
        <TouchableOpacity
          style={styles.removeAllButton}
          onPress={clearAllFavorites} // Zustand function
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Remove All Favorites
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Link href="/">
            <Icon name="arrow-back" size={30} color="white" />
          </Link>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  listContainer: { width: "100%", paddingBottom: 20 },
  listItem: {
    backgroundColor: "#FFF8E3",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5C285",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    width: "100%",
  },
  textContainer: { flex: 1, paddingRight: 10, justifyContent: "center" },
  korean: { fontSize: 20, fontWeight: "900", color: "#3E2723" },
  romanization: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
    marginTop: 4,
  },
  english: { fontSize: 16, fontWeight: "bold", color: "#555", marginTop: 6 },
  buttonGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  playButton: {
    backgroundColor: "#1C5C2E",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  favoriteButton: {
    backgroundColor: "#C52D2D",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  loadingText: { fontSize: 20, color: "#555" },
  noFavoritesText: { fontSize: 20, color: "#555" },
  removeAllButton: {
    backgroundColor: "#C52D2D",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  backButtonContainer: { position: "absolute", bottom: 20, left: 20 },
  backButton: {
    backgroundColor: "#C52D2D",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});
