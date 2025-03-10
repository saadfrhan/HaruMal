import { useRouter, usePathname, Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  const currentRoute = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#C52D2D",
          tabBarInactiveTintColor: "#3E2723",
          headerStyle: {
            backgroundColor: "#FFF8E3",
          },
          headerTitleStyle: {
            color: "#C52D2D",
            fontWeight: "bold",
          },
          tabBarStyle: {
            backgroundColor: "#FFF8E3",
            borderTopWidth: 1,
            // borderTopColor: "#E5C285",
            height: 60,
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "heart-sharp" : "heart-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/")}
        >
          <Icon
            name="home"
            size={28}
            color={currentRoute === "/" ? "yellow" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/favorites")}
        >
          <Icon
            name="favorite"
            size={28}
            color={currentRoute === "/favorites" ? "yellow" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/settings")}
        >
          <Icon
            name="settings"
            size={28}
            color={currentRoute === "/settings" ? "yellow" : "white"}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#C52D2D",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 10,
  },
});
