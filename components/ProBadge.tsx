import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProButtonProps {
  navigation: any;
}

export function ProButton({ navigation }: ProButtonProps) {
  const { isPro } = useStore();

  if (isPro) {
    return (
      <View style={styles.proBadge}>
        <Text style={styles.proEmoji}>👑</Text>
        <Text style={styles.proTextActive}>PRO</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => navigation.navigate("ProScreen")}
      style={({ pressed }) => [styles.proButton, pressed && styles.proPressed]}
    >
      <Text style={styles.starIcon}>⭐</Text>
      <Text style={styles.proText}>PRO</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  proButton: {
    backgroundColor: DUO.orange,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: DUO.orangeDark,
  },
  proBadge: {
    backgroundColor: DUO.green,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: DUO.greenDark,
  },
  proPressed: {
    transform: [{ translateY: 1 }],
  },
  starIcon: {
    fontSize: 15,
    marginRight: 4,
  },
  proEmoji: {
    fontSize: 15,
    marginRight: 4,
  },
  proText: {
    fontWeight: "800",
    color: "white",
    fontSize: 12,
  },
  proTextActive: {
    fontWeight: "800",
    color: "white",
    fontSize: 12,
  },
});
