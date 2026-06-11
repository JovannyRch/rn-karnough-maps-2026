import useStore from "@/app/store";
import { BoxColor } from "@/app/types/types";
import { nextSquareState } from "@/app/utils";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface GridBoxProps {
  index: number;

  row: number;
  column: number;
}

const GridBox = ({ index, row, column }: GridBoxProps) => {
  const { t } = useTranslation();
  const {
    boxColors,
    values,
    setValues,
    resultType,
    focusedGroupIndex,
    stepIndex,
  } = useStore();

  const boxes: BoxColor[] = useMemo(() => {
    return boxColors.filter((box) => {
      return box.row === row && box.column === column;
    });
  }, [boxColors, row, column]);

  const handleOnPress = (index: number) => {
    const newValues = [...values];
    newValues[index] = nextSquareState(values[index]);
    setValues(newValues);
  };

  const value = values[index];
  const pressScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withSequence(
      withTiming(1.08, { duration: 90 }),
      withTiming(1, { duration: 140 }),
    );
  }, [pulseScale, value]);

  const touchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value * pulseScale.value }],
  }));

  return (
    <View style={styles.box}>
      <Animated.View style={[styles.touchAnim, touchAnimatedStyle]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t("common.accessibility.mapCell", {
            index,
            value,
          })}
          style={styles.touch}
          onPress={() => handleOnPress(index)}
          onPressIn={() => {
            pressScale.value = withTiming(0.95, { duration: 80 });
          }}
          onPressOut={() => {
            pressScale.value = withTiming(1, { duration: 120 });
          }}
        >
          <Text
            style={{
              ...styles.index,
            }}
          >
            {index}
          </Text>
          <View style={styles.containerText}>
            <Text
              style={{
                ...styles.value,
                fontWeight:
                  resultType === "SOP" && value === "1"
                    ? "bold"
                    : resultType === "POS" && value === "0"
                      ? "bold"
                      : "normal",
              }}
            >
              {value}
            </Text>
          </View>
          {boxes
            .filter(
              // In step-by-step mode, groups beyond the current step stay hidden.
              ({ groupIndex }) =>
                stepIndex === null ||
                typeof groupIndex !== "number" ||
                groupIndex <= stepIndex,
            )
            .map(({ style, row, column, groupIndex }) => (
              <View
                key={`#${row},${column},${groupIndex ?? "na"},${style.borderColor}`}
                style={[
                  styles.overlayBox,
                  style,
                  focusedGroupIndex !== null &&
                    groupIndex !== focusedGroupIndex &&
                    styles.overlayMuted,
                  focusedGroupIndex !== null &&
                    groupIndex === focusedGroupIndex &&
                    styles.overlayFocused,
                ]}
              />
            ))}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    height: 60,
    borderWidth: 0.3,
    borderColor: "black",
    justifyContent: "center",
    backgroundColor: "#C7D0D8",
  },
  touch: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  containerText: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  touchAnim: {
    flex: 1,
  },

  index: {
    textAlign: "left",
    width: "auto",
    paddingLeft: 3,
    fontSize: 12,
    position: "absolute",
    top: 2,
    left: 2,
  },
  overlayBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  overlayMuted: {
    opacity: 0.14,
  },
  overlayFocused: {
    opacity: 0.8,
  },
  value: {
    fontSize: 23,
    textAlign: "center",
    color: "black",
  },
});
export default GridBox;
