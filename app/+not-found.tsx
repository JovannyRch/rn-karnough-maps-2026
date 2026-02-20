import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Esta pantalla no existe.</Text>
        <Text style={styles.link}>Vuelve atrás para continuar.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7FBF2",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C2A1A",
    textAlign: "center",
  },
  link: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#1CB0F6",
  },
});
