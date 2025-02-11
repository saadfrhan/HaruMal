import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Speech from "expo-speech";
import { setupDatabase, getPhrases, insertPhrases, toggleFavorite } from "../database";
import { Phrase } from "../types";
import { Link } from "expo-router";

export default function App() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [play, setPlay] = useState(false);
    const [loading, setLoading] = useState(true);

    
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await setupDatabase();
        await insertPhrases();
        const data = await getPhrases();
        if (data.length > 0) {
          setPhrases(data);
          console.log(JSON.stringify(data, null, 2));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const phrase = !loading && phrases[currentIndex] || {
    id: 0,
    korean: "로딩 중...", // "Loading..."
    romanization: "",
    english: "",
    category: "",
    favorite: 0,
  };

  const speakKorean = () => {
    if (!phrase.korean || play) return;
    setPlay(true);
    Speech.speak(phrase.korean, {
      language: "ko-KR",
      onDone: () => setPlay(false),
      onStopped: () => setPlay(false),
    });
  };

  const toggleSpeech = () => {
    if (play) {
      Speech.stop();
      setPlay(false);
    } else {
      speakKorean();
    }
  };

  const getNextPhrase = () => {
    if (phrases.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
  };

  const addToFavorite = async () => {
    await toggleFavorite(phrase.id);
    setPhrases((prevPhrases) =>
      prevPhrases.map((p) =>
        p.id === phrase.id ? { ...p, favorite: p.favorite ? 0 : 1 } : p
      )
    );
  };

  return (
    <ImageBackground source={require("./assets/hanji-bg.png")} style={styles.container}>
      <Text style={styles.header}>🟠 하루말 (HaruMal)</Text>

      <View style={styles.card}>
        <Text style={styles.korean}>{phrase.korean}</Text>
        <Text style={styles.romanization}>{phrase.romanization}</Text>
        <Text style={styles.english}>{phrase.english}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={addToFavorite}>
          <Icon name={phrase.favorite ? "favorite" : "favorite-outline"} size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.speakButton} onPress={toggleSpeech}>
          <Icon name={play ? "pause" : "play-arrow"} size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getNextPhrase}>
          <Icon name="skip-next" size={38} color="white" />
        </TouchableOpacity>
      </View>

      <Link href="/settings" style={{
        ...styles.button,
        position: "absolute",
        bottom: 20,
        right: 20,
      }}>
          <Icon name="favorite" size={38} color="white" />
        </Link>

      <StatusBar style="auto" />
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C52D2D",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF8E3",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5C285",
  },
  korean: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    color: "#3E2723",
  },
  romanization: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    color: "#444",
  },
  english: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "#C52D2D",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  speakButton: {
    backgroundColor: "#1C5C2E",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
});
