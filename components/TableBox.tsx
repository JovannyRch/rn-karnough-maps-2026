import useStore from "@/app/store";
import { nextSquareState } from "@/app/utils";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 32,
  },
  btnText: {
    textAlign: "center",
    color: "#3A7F1A",
    fontWeight: "800",
    fontSize: 18,
  },
});

export const TableBox = ({ index }: { index: number }) => {
  const { t } = useTranslation();
  const { values, setValues } = useStore();
  const pressScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const value = values[index];

  useEffect(() => {
    pulseScale.value = withSequence(
      withTiming(1.06, { duration: 80 }),
      withTiming(1, { duration: 130 }),
    );
  }, [pulseScale, value]);

  const touchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value * pulseScale.value }],
  }));

  const handleOnPress = (valueIndex: number) => {
    const newValues = [...values];
    newValues[valueIndex] = nextSquareState(values[valueIndex]);
    setValues(newValues);
  };

  return (
    <Animated.View style={touchAnimatedStyle}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t("common.accessibility.tableCell", {
          index,
          value,
        })}
        onPress={() => handleOnPress(index)}
        onPressIn={() => {
          pressScale.value = withTiming(0.94, { duration: 80 });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 120 });
        }}
      >
        <View style={styles.btn}>
          <Text style={styles.btnText}>{value}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
