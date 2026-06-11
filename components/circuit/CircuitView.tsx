import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { getGroupColor } from "@/constants/groupColors";
import { hapticSelect } from "@/utils/haptics";
import Icon from "@expo/vector-icons/MaterialIcons";
import CircuitDiagram from "./CircuitDiagram";
import { buildDecoderScene, buildMuxScene } from "./implementations";
import { buildCircuitScene } from "./layout";
import {
  CircuitVariant,
  formatTermLabel,
  parseCircuitModel,
} from "./model";
import ZoomableView from "./ZoomableView";

interface CircuitViewProps {
  variant: CircuitVariant;
  onVariantChange: (variant: CircuitVariant) => void;
  compact: boolean;
  onCompactChange: (compact: boolean) => void;
  fullscreen?: boolean;
  /** When provided, shows a corner expand button that opens fullscreen. */
  onExpand?: () => void;
}

const CircuitView = ({
  variant,
  onVariantChange,
  compact,
  onCompactChange,
  fullscreen = false,
  onExpand,
}: CircuitViewProps) => {
  const { t } = useTranslation();
  const {
    resultType,
    circuitVector,
    variables,
    values,
    variableQuantity,
    variableRotation,
    focusedGroupIndex,
    setFocusedGroupIndex,
  } = useStore();
  const [inlineWidth, setInlineWidth] = useState(0);

  const isBlockVariant = variant === "mux" || variant === "decoder";

  const model = useMemo(
    () => parseCircuitModel(circuitVector, resultType),
    [circuitVector, resultType],
  );

  const scene = useMemo(() => {
    if (model.kind !== "network") {
      return null;
    }
    if (variant === "mux") {
      return buildMuxScene(values, variableQuantity, variableRotation, variables);
    }
    if (variant === "decoder") {
      return buildDecoderScene(
        values,
        variableQuantity,
        variableRotation,
        variables,
      );
    }
    return buildCircuitScene(model, variables, variant, compact);
  }, [
    model,
    variables,
    variant,
    compact,
    values,
    variableQuantity,
    variableRotation,
  ]);

  const selectedTerm =
    focusedGroupIndex !== null && focusedGroupIndex < model.terms.length
      ? focusedGroupIndex
      : null;

  const handleSelectTerm = (termIndex: number) => {
    hapticSelect();
    setFocusedGroupIndex(selectedTerm === termIndex ? null : termIndex);
  };

  if (model.kind === "empty") {
    return <View style={styles.empty} />;
  }

  if (model.kind === "constant") {
    return (
      <View style={styles.constantCard}>
        <Text style={styles.constantText}>{`F = ${model.constant}`}</Text>
      </View>
    );
  }

  if (!scene) {
    return <View style={styles.empty} />;
  }

  const variantNote =
    variant === "nand"
      ? t("result.circuit.nandNote")
      : variant === "nor"
        ? t("result.circuit.norNote")
        : variant === "mux"
          ? t("result.circuit.muxNote", {
              size: 2 ** (variableQuantity - 1),
              variable: variables[variableQuantity - 1],
            })
          : variant === "decoder"
            ? t("result.circuit.decoderNote", {
                inputs: variableQuantity,
                outputs: 2 ** variableQuantity,
              })
            : null;

  const inlineScale =
    inlineWidth > 0 ? Math.min(1, (inlineWidth - 12) / scene.width) : 1;

  const diagram = (
    <CircuitDiagram
      scene={scene}
      selectedTerm={isBlockVariant ? null : selectedTerm}
      onSelectTerm={isBlockVariant ? undefined : handleSelectTerm}
    />
  );

  return (
    <View style={fullscreen ? styles.rootFullscreen : styles.root}>
      {onExpand && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("result.accessibility.fullscreen")}
          hitSlop={6}
          style={({ pressed }) => [
            styles.expandButton,
            pressed && styles.expandButtonPressed,
          ]}
          onPress={() => {
            hapticSelect();
            onExpand();
          }}
        >
          <Icon name="fullscreen" size={20} color={DUO.blueDark} />
        </Pressable>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.variantScroll, onExpand && styles.variantScrollInset]}
        contentContainerStyle={styles.variantRow}
      >
        {(
          [
            ["standard", t("result.circuit.standard")],
            ["nand", t("result.circuit.nandOnly")],
            ["nor", t("result.circuit.norOnly")],
            ["mux", t("result.circuit.mux")],
            ["decoder", t("result.circuit.decoder")],
          ] as const
        ).map(([value, label]) => {
          const active = variant === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
              style={[styles.variantChip, active && styles.variantChipActive]}
              onPress={() => {
                hapticSelect();
                onVariantChange(value);
              }}
            >
              <Text
                style={[
                  styles.variantChipText,
                  active && styles.variantChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {variantNote && <Text style={styles.note}>{variantNote}</Text>}

      {!isBlockVariant && (
        <View style={styles.metaRow}>
          <Text style={styles.statsText}>
            {t("result.circuit.stats", {
              gates: scene.stats.gates,
              inputs: scene.stats.inputs,
              levels: scene.stats.levels,
            })}
          </Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: compact }}
            accessibilityLabel={t("result.circuit.compact")}
            style={[styles.compactChip, compact && styles.compactChipActive]}
            onPress={() => {
              hapticSelect();
              onCompactChange(!compact);
            }}
          >
            <Text
              style={[
                styles.compactChipText,
                compact && styles.compactChipTextActive,
              ]}
            >
              {t("result.circuit.compact")}
            </Text>
          </Pressable>
        </View>
      )}

      {!isBlockVariant && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.legendRow}
        style={styles.legendScroll}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedTerm === null }}
          style={[
            styles.legendChip,
            selectedTerm === null && styles.legendChipActive,
          ]}
          onPress={() => setFocusedGroupIndex(null)}
        >
          <Text
            style={[
              styles.legendChipText,
              selectedTerm === null && styles.legendChipTextActive,
            ]}
          >
            {t("grid.groups.all")}
          </Text>
        </Pressable>
        {model.terms.map((term) => {
          const active = selectedTerm === term.index;
          const label = formatTermLabel(term, resultType);
          return (
            <Pressable
              key={`term-${term.index}`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
              style={[styles.legendChip, active && styles.legendChipActive]}
              onPress={() => handleSelectTerm(term.index)}
            >
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: getGroupColor(term.index) },
                ]}
              />
              <Text
                style={[
                  styles.legendChipText,
                  active && styles.legendChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      )}

      {fullscreen ? (
        <>
          <View style={styles.zoomArea}>
            <ZoomableView
              contentWidth={scene.width}
              contentHeight={scene.height}
            >
              {diagram}
            </ZoomableView>
          </View>
          <Text style={styles.hint}>{t("result.circuit.zoomHint")}</Text>
        </>
      ) : (
        <>
          <View
            style={styles.inlineArea}
            onLayout={(event) =>
              setInlineWidth(event.nativeEvent.layout.width)
            }
          >
            {inlineWidth > 0 && (
              <View
                style={{
                  width: scene.width * inlineScale,
                  height: scene.height * inlineScale,
                }}
              >
                <View
                  style={{
                    width: scene.width,
                    height: scene.height,
                    transform: [
                      { translateX: -(scene.width * (1 - inlineScale)) / 2 },
                      { translateY: -(scene.height * (1 - inlineScale)) / 2 },
                      { scale: inlineScale },
                    ],
                  }}
                >
                  {diagram}
                </View>
              </View>
            )}
          </View>
          <Text style={styles.hint}>{t("result.circuit.tapHint")}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: DUO.card,
    paddingTop: 10,
    paddingBottom: 12,
  },
  rootFullscreen: {
    flex: 1,
    backgroundColor: DUO.card,
    paddingTop: 10,
    paddingBottom: 8,
  },
  empty: {
    minHeight: 200,
    backgroundColor: DUO.card,
  },
  constantCard: {
    minHeight: 180,
    margin: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  constantText: {
    color: DUO.slate,
    fontSize: 30,
    fontWeight: "900",
  },
  variantScroll: {
    flexGrow: 0,
  },
  variantScrollInset: {
    marginRight: 50,
  },
  expandButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  expandButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  variantRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
  },
  variantChip: {
    paddingHorizontal: 14,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  variantChipActive: {
    borderColor: DUO.blue,
    backgroundColor: DUO.blueSoft,
  },
  variantChipText: {
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 13,
  },
  variantChipTextActive: {
    color: DUO.blueDark,
  },
  note: {
    color: DUO.muted,
    fontSize: 11.5,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 8,
  },
  statsText: {
    flex: 1,
    color: DUO.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  compactChip: {
    minHeight: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  compactChipActive: {
    borderColor: DUO.blue,
    backgroundColor: DUO.blueSoft,
  },
  compactChipText: {
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 11,
  },
  compactChipTextActive: {
    color: DUO.blueDark,
  },
  legendScroll: {
    flexGrow: 0,
    marginTop: 10,
  },
  legendRow: {
    gap: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  legendChip: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.greenFaint,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendChipActive: {
    borderColor: DUO.blue,
    backgroundColor: DUO.blueSoft,
  },
  legendChipText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 12,
  },
  legendChipTextActive: {
    color: DUO.blueDark,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inlineArea: {
    marginTop: 12,
    marginHorizontal: 12,
    alignItems: "center",
  },
  zoomArea: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    overflow: "hidden",
  },
  hint: {
    color: DUO.muted,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
  },
});

export default CircuitView;
