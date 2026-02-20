import { View, Text, StyleSheet } from "react-native";

const DiagonalBox = ({ text1, text2 }: { text1: string; text2: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.textTop}>{text1}</Text>
      <Text style={styles.textBottom}>{text2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  line: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    transform: [{ rotate: "45deg" }],
    alignSelf: "center",
  },
  textTop: {
    position: "absolute",
    top: 10,
    left: 0,
    fontSize: 16,
    fontWeight: "bold",
  },
  textBottom: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DiagonalBox;
