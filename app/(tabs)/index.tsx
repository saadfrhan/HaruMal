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
import * as Speech from "expo-speech";
import { usePhraseStore } from "../../store";
import { Phrase } from "../../types";

import { Picker } from "@react-native-picker/picker";

export default function HomeScreen() {
  const phrases = usePhraseStore((state) => state.phrases);
  const loadPhrases = usePhraseStore((state) => state.loadPhrases);
  const toggleFavoritePhrase = usePhraseStore(
    (state) => state.toggleFavoritePhrase
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number>();

  useEffect(() => {
    loadPhrases();
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

  const [selectedCategory, setSelectedCategory] = useState(""); // To store selected category

  const filteredPhrases = phrases.filter(
    (phrase) =>
      (phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phrase.korean.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? phrase.category === selectedCategory : true)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🟠 하루말 (HaruMal)</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search phrases..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Greetings" value="greetings" />
        <Picker.Item label="Food" value="food" />
      </Picker>

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
                onPress={() => toggleFavoritePhrase(item.id)}
              >
                <Icon
                  name={item.favorite ? "favorite" : "favorite-outline"}
                  size={25}
                  color="#C52D2D"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    padding: 10,
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
    color: "#3E2723",
  },
  romanization: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
  },
  english: {
    fontSize: 18,
    fontWeight: "bold",
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
});
