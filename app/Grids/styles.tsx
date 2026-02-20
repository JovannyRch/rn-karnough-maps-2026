import { StyleSheet } from "react-native";

const variablesStyles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
  },
  lefColumn: {
    width: 50,
    justifyContent: "center",
  },
  varText: {
    fontSize: 17,
    textAlign: "center",
  },
  vars: {
    flex: 1,
    height: 30,
  },
  varText5: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  vars5: {
    flex: 1,
    height: 10,
  },
});

export default variablesStyles;
