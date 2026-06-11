import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { getGroupColor } from "@/constants/groupColors";
import { hapticSelect } from "@/utils/haptics";
import Icon from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface StepByStepPanelProps {
  /** Distance from the bottom edge, mirrors the result dock placement. */
  bottom: number;
}

/**
 * Guided walkthrough of the solution: one panel per group explaining which
 * cells it covers, which variables drop out and the resulting term, plus a
 * final step that assembles the full expression. Replaces the result dock
 * while `stepIndex` is non-null.
 */
const StepByStepPanel = ({ bottom }: StepByStepPanelProps) => {
  const { t } = useTranslation();
  const {
    stepIndex,
    setStepIndex,
    groupsInfo,
    setFocusedGroupIndex,
    resultType,
    vectorResult,
  } = useStore();

  if (stepIndex === null || groupsInfo.length === 0) {
    return null;
  }

  const total = groupsInfo.length;
  const isFinal = stepIndex >= total;
  const info = isFinal ? null : groupsInfo[Math.min(stepIndex, total - 1)];
  const target = resultType === "SOP" ? "1" : "0";

  const exit = () => {
    hapticSelect();
    setStepIndex(null);
    setFocusedGroupIndex(null);
  };

  const goTo = (next: number) => {
    if (next < 0) {
      return;
    }
    if (next > total) {
      exit();
      return;
    }
    hapticSelect();
    setStepIndex(next);
    setFocusedGroupIndex(next < total ? next : null);
  };

  return (
    <View style={[styles.panel, { bottom }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {isFinal
            ? t("steps.finalTitle")
            : t("steps.title", { current: stepIndex + 1, total })}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("steps.exit")}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressed,
          ]}
          onPress={exit}
        >
          <Icon name="close" size={16} color={DUO.ink} />
        </Pressable>
      </View>

      {isFinal ? (
        <>
          <Text style={styles.body}>{t("steps.finalBody")}</Text>
          <View style={styles.expressionRow}>
            {vectorResult.map((item, index) => (
              <Text
                key={`${item.value}-${index}`}
                style={[styles.expressionItem, item.style]}
              >
                {item.value}
              </Text>
            ))}
          </View>
        </>
      ) : info ? (
        <>
          <Text style={styles.body}>
            {t("steps.covered", { count: info.cellCount, target })}{" "}
            {info.eliminatedVariables.length > 0
              ? t("steps.eliminated", {
                  variables: info.eliminatedVariables.join(", "),
                })
              : t("steps.eliminatedNone")}
          </Text>
          <View style={styles.termRow}>
            <Text style={styles.body}>{t("steps.termIntro")}</Text>
            <View
              style={[
                styles.termChip,
                { borderColor: getGroupColor(info.groupIndex) },
              ]}
            >
              <View
                style={[
                  styles.termDot,
                  { backgroundColor: getGroupColor(info.groupIndex) },
                ]}
              />
              <Text style={styles.termText}>{info.termMath}</Text>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.navRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("steps.back")}
          disabled={stepIndex === 0}
          style={({ pressed }) => [
            styles.navButton,
            stepIndex === 0 && styles.navButtonDisabled,
            pressed && stepIndex !== 0 && styles.pressed,
          ]}
          onPress={() => goTo(stepIndex - 1)}
        >
          <Text
            style={[
              styles.navButtonText,
              stepIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            {t("steps.back")}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFinal ? t("steps.done") : t("steps.next")}
          style={({ pressed }) => [
            styles.navButtonPrimary,
            pressed && styles.pressed,
          ]}
          onPress={() => goTo(stepIndex + 1)}
        >
          <Text style={styles.navButtonPrimaryText}>
            {isFinal ? t("steps.done") : t("steps.next")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 12,
    right: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    padding: 14,
    shadowColor: DUO.ink,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    color: DUO.blueDark,
    fontWeight: "900",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DUO.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.bg,
  },
  body: {
    color: DUO.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  termChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: DUO.bg,
  },
  termDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  termText: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 15,
  },
  expressionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 8,
  },
  expressionItem: {
    fontSize: 17,
    fontWeight: "900",
  },
  navRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  navButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.45,
  },
  navButtonText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 14,
  },
  navButtonTextDisabled: {
    color: DUO.muted,
  },
  navButtonPrimary: {
    flex: 1.4,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: DUO.green,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonPrimaryText: {
    color: DUO.white,
    fontWeight: "900",
    fontSize: 14,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});

export default StepByStepPanel;
