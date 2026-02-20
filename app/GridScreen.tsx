import ExportSessionPDFButton from "@/components/ExportSessionPDFButton";
import { MyBannerAd } from "@/components/MyBannerAd";
import { ProButton } from "@/components/ProBadge";
import TableView from "@/components/TableView";
import { DUO } from "@/constants/duoTheme";
import {
  addExerciseHistoryEntry,
  ExerciseHistoryEntry,
} from "@/utils/exerciseHistory";
import {
  addAdListener,
  createInterstitialAd,
  hasAdMobCoreModule,
  hasAdMobInterstitialModule,
  initializeMobileAds,
} from "@/utils/admobSupport";
import Icon from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clipboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FourVariables from "./Grids/FourVariablesGrid";
import ThreeVariablesGrid from "./Grids/ThreeVariablesGrid";
import TwoVariablesGrid from "./Grids/TwoVariablesGrid";
import useDebounce from "./hooks/useDebounce";
import useSquares from "./hooks/useSquares";
import useStore from "./store";
import { KMaps } from "./utils/KMaps";

interface GridScreenProps {
  navigation: any;
  route?: any;
}

const INTERSTITIAL_COUNTER_KEY = "@interstitial_result_open_count";
const INTERSTITIAL_LAST_SHOWN_KEY = "@interstitial_last_shown_at";
const INTERSTITIAL_EVERY_X_RESULT_OPENS = 4;
const INTERSTITIAL_MIN_GAP_MS = 90 * 1000;
const ESTIMATED_BANNER_HEIGHT = 56;
const RESULT_DOCK_HEIGHT = 84;

export default function GridScreen({ navigation, route }: GridScreenProps) {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState<any>(null);
  const [copyFeedbackVisible, setCopyFeedbackVisible] = useState(false);
  const [isVariableMenuOpen, setIsVariableMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const interstitialOpenCountRef = useRef(0);
  const interstitialLastShownAtRef = useRef(0);
  const interstitialPolicyReadyRef = useRef(false);
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const viewSwitchProgress = useSharedValue(1);
  const resultDockScale = useSharedValue(1);
  const copyBadgeOpacity = useSharedValue(0);
  const copyBadgeTranslateY = useSharedValue(-6);

  const {
    result,
    vectorResult,
    setResult,
    setBoxColors,
    variableQuantity,
    setVariableQuantity,
    setAllValues,
    setValues,
    resultType,
    setVectorResult,
    setCircuitVector,
    setView,
    view,
    setResultType,
    isPro,
    rotateVariables,
    variableRotation,
  } = useStore();

  const squares = useSquares();
  const heroFade = useSharedValue(0);
  const heroLift = useSharedValue(16);
  const gridFade = useSharedValue(0);
  const lastLoadedHistoryIdRef = useRef<string | null>(null);

  const getResult = (solutionType: "POS" | "SOP") => {
    if (squares) {
      const kMap = new KMaps(
        variableQuantity,
        solutionType,
        squares,
        variableRotation,
      );
      kMap.Algorithm();
      setResult(kMap.getMathExpression());
      setBoxColors(kMap.getBoxColors());
      setVectorResult(kMap.getVectorResult());
      setCircuitVector(kMap.getCircuitVector());
    }
  };

  useDebounce(
    () => {
      getResult(resultType);
    },
    0,
    [squares, resultType, variableRotation],
  );

  useEffect(() => {
    heroFade.value = withTiming(1, { duration: 320 });
    heroLift.value = withTiming(0, { duration: 320 });
    gridFade.value = withTiming(1, { duration: 380 });
  }, [gridFade, heroFade, heroLift]);

  useEffect(() => {
    viewSwitchProgress.value = 0.72;
    viewSwitchProgress.value = withTiming(1, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [view, viewSwitchProgress]);

  useEffect(() => {
    if (!result && vectorResult.length === 0) {
      return;
    }

    resultDockScale.value = withSequence(
      withTiming(0.98, { duration: 80 }),
      withSpring(1, { damping: 11, stiffness: 260 }),
    );
  }, [result, resultDockScale, vectorResult.length]);

  useEffect(() => {
    if (isPro) {
      interstitialPolicyReadyRef.current = true;
      return;
    }

    (async () => {
      try {
        const [countRaw, lastShownRaw] = await Promise.all([
          AsyncStorage.getItem(INTERSTITIAL_COUNTER_KEY),
          AsyncStorage.getItem(INTERSTITIAL_LAST_SHOWN_KEY),
        ]);

        interstitialOpenCountRef.current = countRaw ? Number(countRaw) || 0 : 0;
        interstitialLastShownAtRef.current = lastShownRaw
          ? Number(lastShownRaw) || 0
          : 0;
      } catch (error) {
        console.log("Failed loading interstitial pacing state", error);
      } finally {
        interstitialPolicyReadyRef.current = true;
      }
    })();
  }, [isPro]);

  useEffect(() => {
    const historyEntry: ExerciseHistoryEntry | undefined =
      route?.params?.historyEntryToLoad;

    if (!historyEntry) {
      return;
    }

    if (lastLoadedHistoryIdRef.current === historyEntry.id) {
      return;
    }

    lastLoadedHistoryIdRef.current = historyEntry.id;

    setVariableQuantity(historyEntry.variableQuantity);
    setResultType(historyEntry.resultType);
    setValues(historyEntry.values);
    setView("map");

    navigation.setParams({
      historyEntryToLoad: undefined,
    });
  }, [
    navigation,
    route?.params?.historyEntryToLoad,
    setResultType,
    setValues,
    setVariableQuantity,
    setView,
  ]);

  useEffect(() => {
    if (hasAdMobCoreModule) {
      initializeMobileAds()
        .then(() => {
          console.log("AdMob initialized");
        })
        .catch(() => {});
    }

    if (!isPro && hasAdMobInterstitialModule) {
      const adInstance = createInterstitialAd("ca-app-pub-4665787383933447/6321320097");
      if (!adInstance) {
        return;
      }
      setInterstitial(adInstance);

      const unsubscribeLoaded = addAdListener(adInstance, "adLoaded", () => {
        setInterstitialLoaded(true);
      });

      const unsubscribeClosed = addAdListener(adInstance, "adDismissed", () => {
        setInterstitialLoaded(false);
        void Promise.resolve(adInstance.load()).catch(() => {});
      });

      const unsubscribeError = addAdListener(adInstance, "adFailedToLoad", () => {
        setInterstitialLoaded(false);
      });

      void Promise.resolve(adInstance.load()).catch(() => {
        setInterstitialLoaded(false);
      });

      return () => {
        unsubscribeLoaded.remove();
        unsubscribeClosed.remove();
        unsubscribeError.remove();
      };
    }

    setInterstitial(null);
    setInterstitialLoaded(false);
  }, [isPro]);

  const variableOptions = useMemo(
    () => [
      { label: "2 Variables", value: 2 },
      { label: "3 Variables", value: 3 },
      { label: "4 Variables", value: 4 },
    ],
    [],
  );

  const resultPlainText = useMemo(() => {
    if (vectorResult.length > 0) {
      return vectorResult.map((item) => item.value).join("");
    }
    return result;
  }, [result, vectorResult]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const openResultScreen = () => {
    if (!result) {
      return;
    }

    const navigateToResult = () => {
      void addExerciseHistoryEntry({
        variableQuantity,
        resultType,
        values: [...useStore.getState().values],
        result,
        isFavorite: false,
      });

      navigation.navigate("ResultScreen", {
        result,
        resultType,
      });
    };

    if (isPro || !interstitialPolicyReadyRef.current) {
      navigateToResult();
      return;
    }

    interstitialOpenCountRef.current += 1;
    AsyncStorage.setItem(
      INTERSTITIAL_COUNTER_KEY,
      String(interstitialOpenCountRef.current),
    ).catch(() => {});

    const now = Date.now();
    const dueByFrequency =
      interstitialOpenCountRef.current % INTERSTITIAL_EVERY_X_RESULT_OPENS ===
      0;
    const dueByCooldown =
      now - interstitialLastShownAtRef.current >= INTERSTITIAL_MIN_GAP_MS;

    if (interstitialLoaded && interstitial && dueByFrequency && dueByCooldown) {
      interstitial
        .show()
        .then(() => {
          const shownAt = Date.now();
          interstitialLastShownAtRef.current = shownAt;
          AsyncStorage.setItem(
            INTERSTITIAL_LAST_SHOWN_KEY,
            String(shownAt),
          ).catch(() => {});
          navigateToResult();
        })
        .catch(() => {
          navigateToResult();
        });
      return;
    }

    navigateToResult();
  };

  const handleCopyResult = () => {
    if (!resultPlainText) {
      return;
    }

    Clipboard.setString(resultPlainText);

    resultDockScale.value = withSequence(
      withTiming(0.97, { duration: 70 }),
      withSpring(1, { damping: 10, stiffness: 260 }),
    );

    setCopyFeedbackVisible(true);
    copyBadgeOpacity.value = 0;
    copyBadgeTranslateY.value = -6;
    copyBadgeOpacity.value = withTiming(1, { duration: 160 });
    copyBadgeTranslateY.value = withTiming(0, { duration: 160 });

    if (copyFeedbackTimeoutRef.current) {
      clearTimeout(copyFeedbackTimeoutRef.current);
    }

    copyFeedbackTimeoutRef.current = setTimeout(() => {
      copyBadgeOpacity.value = withTiming(0, { duration: 180 });
      copyBadgeTranslateY.value = withTiming(-6, { duration: 180 });
      setCopyFeedbackVisible(false);
    }, 950);
  };

  const gridSwitchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: viewSwitchProgress.value,
    transform: [{ translateY: (1 - viewSwitchProgress.value) * 10 }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroFade.value,
    transform: [{ translateY: heroLift.value }],
  }));

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroFade.value,
    transform: [{ translateY: heroLift.value }],
  }));

  const gridFadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gridFade.value,
  }));

  const resultDockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultDockScale.value }],
  }));

  const copyBadgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: copyBadgeOpacity.value,
    transform: [{ translateY: copyBadgeTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Reanimated.View style={[styles.header, headerAnimatedStyle]}>
        <View>
          <Text style={styles.badge}>ESTUDIO GUIADO</Text>
          <Text style={styles.title}>Mapas de Karnaugh</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.historyButton,
              pressed && styles.historyButtonPressed,
            ]}
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Icon name="history" size={18} color="#fff" />
          </Pressable>
          <ProButton navigation={navigation} />
        </View>
      </Reanimated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Reanimated.View style={[styles.controlsCard, controlsAnimatedStyle]}>
          <View style={styles.controlRow}>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Variables</Text>
              <VariableSelector
                options={variableOptions}
                value={variableQuantity}
                isOpen={isVariableMenuOpen}
                onToggle={() => setIsVariableMenuOpen((prev) => !prev)}
                onSelect={(nextValue) => {
                  setVariableQuantity(nextValue);
                  setIsVariableMenuOpen(false);
                }}
              />
            </View>

            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Tipo</Text>
              <View style={styles.segmentedControl}>
                <ChoiceButton
                  text="SOP"
                  active={resultType === "SOP"}
                  onPress={() => setResultType("SOP")}
                />
                <ChoiceButton
                  text="POS"
                  active={resultType === "POS"}
                  onPress={() => setResultType("POS")}
                />
              </View>
            </View>
          </View>

          <View style={styles.controlRow}>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Vista</Text>
              <View style={styles.segmentedControl}>
                <ChoiceButton
                  text="Mapa"
                  active={view === "map"}
                  onPress={() => setView("map")}
                />
                <ChoiceButton
                  text="Tabla"
                  active={view === "table"}
                  onPress={() => setView("table")}
                />
              </View>
            </View>

            <View style={styles.controlItem}>
              {view === "map" && (
                <>
                  <Text style={styles.controlLabel}></Text>
                  <ActionButton
                    label="Rotar variables"
                    active={variableRotation > 0}
                    onPress={rotateVariables}
                  />
                </>
              )}
            </View>
          </View>

          <View style={styles.quickActionsRow}>
            <Text style={styles.quickActionsLabel}>Llenar con</Text>
            <QuickChip onPress={() => setAllValues("1")} label="1s" />
            <QuickChip onPress={() => setAllValues("0")} label="0s" />
            <QuickChip onPress={() => setAllValues("X")} label="Xs" />
          </View>
          <ExportSessionPDFButton compact disabled={!result} />
        </Reanimated.View>

        <Reanimated.View
          style={[
            styles.gridContainer,
            gridFadeAnimatedStyle,
            gridSwitchAnimatedStyle,
          ]}
        >
          {view === "map" && (
            <>
              {variableQuantity == 2 && <TwoVariablesGrid />}
              {variableQuantity == 3 && <ThreeVariablesGrid />}
              {variableQuantity == 4 && <FourVariables />}
            </>
          )}

          {view === "table" && <TableView />}
        </Reanimated.View>

        <View
          style={[
            styles.bottomSpacer,
            {
              height:
                RESULT_DOCK_HEIGHT +
                insets.bottom +
                (isPro ? 16 : ESTIMATED_BANNER_HEIGHT + 16),
            },
          ]}
        />
      </ScrollView>

      <Reanimated.View
        style={[
          styles.resultDock,
          {
            bottom: insets.bottom + (isPro ? 8 : ESTIMATED_BANNER_HEIGHT + 8),
          },
          resultDockAnimatedStyle,
        ]}
      >
        <Pressable
          style={styles.resultDockTextBlock}
          onPress={handleCopyResult}
          disabled={!resultPlainText}
        >
          <Text style={styles.resultDockLabel}>Resultado</Text>
          {vectorResult.length > 0 ? (
            <View style={styles.resultDockVector}>
              {vectorResult.map((item, index) => (
                <Text
                  key={`${item.value}-${index}`}
                  style={[styles.resultDockItem, item.style]}
                >
                  {item.value}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.resultDockValue} numberOfLines={1}>
              Selecciona valores para obtener la expresión
            </Text>
          )}
          {!!resultPlainText && (
            <Text style={styles.resultDockHint}>Toca para copiar</Text>
          )}
        </Pressable>
        {copyFeedbackVisible && (
          <Reanimated.View style={[styles.copyBadge, copyBadgeAnimatedStyle]}>
            <Text style={styles.copyBadgeText}>Copiado</Text>
          </Reanimated.View>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.resultDockButton,
            !result && styles.resultDockButtonDisabled,
            pressed && !!result && styles.resultDockButtonPressed,
          ]}
          onPress={openResultScreen}
          disabled={!result}
        >
          <Text style={styles.resultDockButtonText}>Circuito</Text>
        </Pressable>
      </Reanimated.View>
      {!isPro && <MyBannerAd />}
    </SafeAreaView>
  );
}

interface ChoiceButtonProps {
  text: string;
  active: boolean;
  onPress: () => void;
}

interface VariableOption {
  label: string;
  value: 2 | 3 | 4;
}

interface VariableSelectorProps {
  options: VariableOption[];
  value: 2 | 3 | 4;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: 2 | 3 | 4) => void;
}

const VariableSelector = ({
  options,
  value,
  isOpen,
  onToggle,
  onSelect,
}: VariableSelectorProps) => {
  const selectedItem = options.find((option) => option.value === value);

  return (
    <View>
      <Pressable onPress={onToggle} style={styles.dropdownButtonStyle}>
        <Text style={styles.dropdownButtonTxtStyle}>
          {selectedItem?.label || `${value} Variables`}
        </Text>
        <Icon
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={DUO.muted}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownMenuInline}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.dropdownItemStyle,
                option.value === value && styles.dropdownItemSelected,
                pressed && styles.choiceButtonPressed,
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text style={styles.dropdownItemTxtStyle}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const ChoiceButton = ({ text, active, onPress }: ChoiceButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.choiceButton,
        active && styles.choiceButtonActive,
        pressed && styles.choiceButtonPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.choiceButtonText,
          active && styles.choiceButtonTextActive,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

interface ActionButtonProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  emphasis?: boolean;
  onPress: () => void;
}

const ActionButton = ({
  label,
  active,
  disabled,
  emphasis,
  onPress,
}: ActionButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        active && styles.actionButtonActive,
        emphasis && active && styles.actionButtonEmphasis,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.actionButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          active && styles.actionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const QuickChip = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickActionButton,
        pressed && styles.quickActionButtonPressed,
      ]}
    >
      <Text style={styles.quickActionButtonText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DUO.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  badge: {
    color: DUO.blueDark,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1,
  },
  title: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 19,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: DUO.blue,
    borderBottomWidth: 3,
    borderBottomColor: DUO.blueDark,
    alignItems: "center",
    justifyContent: "center",
  },
  historyButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  controlsCard: {
    backgroundColor: DUO.card,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 10,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DUO.border,
    shadowColor: "#96BC7C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  controlRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  controlItem: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: DUO.muted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 8,
  },
  choiceButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F8EC",
    borderWidth: 1,
    borderColor: DUO.border,
  },
  choiceButtonActive: {
    backgroundColor: DUO.green,
    borderBottomWidth: 4,
    borderBottomColor: DUO.greenDark,
    borderColor: DUO.green,
  },
  choiceButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  choiceButtonText: {
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 14,
  },
  choiceButtonTextActive: {
    color: "#FFFFFF",
  },
  actionButton: {
    minHeight: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F8EC",
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    borderBottomWidth: 3,
    borderBottomColor: DUO.borderStrong,
    paddingHorizontal: 12,
  },
  actionButtonActive: {
    backgroundColor: DUO.green,
    borderColor: DUO.green,
    borderBottomColor: DUO.greenDark,
  },
  actionButtonEmphasis: {
    backgroundColor: DUO.blue,
    borderColor: DUO.blue,
    borderBottomColor: DUO.blueDark,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: DUO.muted,
  },
  actionButtonTextActive: {
    color: "#FFFFFF",
  },
  quickActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DUO.border,
  },
  quickActionsLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: DUO.muted,
    marginRight: 2,
  },
  quickActionButton: {
    backgroundColor: DUO.yellow,
    borderBottomWidth: 3,
    borderBottomColor: "#D9A700",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickActionButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  quickActionButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6A5600",
  },
  gridContainer: {
    padding: 12,
    paddingTop: 14,
  },
  dropdownButtonStyle: {
    minHeight: 44,
    backgroundColor: "#F2F8EC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DUO.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    fontWeight: "700",
    color: DUO.ink,
  },
  dropdownMenuStyle: {
    backgroundColor: DUO.card,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: DUO.border,
    shadowColor: "#7EA16B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownMenuInline: {
    backgroundColor: DUO.card,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: DUO.border,
    overflow: "hidden",
  },
  dropdownItemStyle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F6EB",
  },
  dropdownItemSelected: {
    backgroundColor: DUO.greenSoft,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    fontWeight: "600",
    color: DUO.ink,
  },
  bottomSpacer: {
    height: 0,
  },
  resultDock: {
    position: "absolute",
    left: 12,
    right: 12,
    minHeight: RESULT_DOCK_HEIGHT,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#8FB579",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  resultDockTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  resultDockLabel: {
    fontSize: 11,
    color: DUO.muted,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  resultDockValue: {
    fontSize: 14,
    color: DUO.ink,
    fontWeight: "700",
  },
  resultDockHint: {
    marginTop: 4,
    fontSize: 11,
    color: DUO.blueDark,
    fontWeight: "700",
  },
  resultDockVector: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    maxHeight: 38,
    overflow: "hidden",
  },
  resultDockItem: {
    fontSize: 16,
    fontWeight: "800",
    color: DUO.ink,
  },
  resultDockButton: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.blue,
    borderBottomWidth: 3,
    borderBottomColor: DUO.blueDark,
  },
  resultDockButtonDisabled: {
    backgroundColor: "#B9D9EA",
    borderBottomColor: "#A0C3D4",
  },
  resultDockButtonPressed: {
    transform: [{ translateY: 1 }],
  },
  resultDockButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  copyBadge: {
    position: "absolute",
    top: -10,
    left: 14,
    backgroundColor: DUO.green,
    borderBottomWidth: 2,
    borderBottomColor: DUO.greenDark,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  copyBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
