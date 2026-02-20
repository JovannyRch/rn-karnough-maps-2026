import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import {
  addAdListener,
  createInterstitialAd,
  hasAdMobInterstitialModule,
} from "@/utils/admobSupport";
import { buildMinimizationComparison } from "@/utils/minimizationComparator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const EQUIV_INTERSTITIAL_COUNTER_KEY = "@equiv_open_count";
const EQUIV_INTERSTITIAL_LAST_SHOWN_KEY = "@equiv_last_shown_at";
const EQUIV_INTERSTITIAL_EVERY_X_OPENS = 3;
const EQUIV_INTERSTITIAL_MIN_GAP_MS = 90 * 1000;

interface MinimizationComparisonCardProps {
  values: string[];
  variableQuantity: number;
  resultType: "SOP" | "POS";
  currentResult: string;
}

export default function MinimizationComparisonCard({
  values,
  variableQuantity,
  resultType,
  currentResult,
}: MinimizationComparisonCardProps) {
  const { isPro } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [showHeuristicHelp, setShowHeuristicHelp] = useState(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState<any>(null);
  const interstitialOpenCountRef = useRef(0);
  const interstitialLastShownAtRef = useRef(0);
  const interstitialPolicyReadyRef = useRef(false);
  const comparison = useMemo(
    () =>
      buildMinimizationComparison({
        values,
        variableQuantity,
        resultType,
        currentResult,
      }),
    [values, variableQuantity, resultType, currentResult],
  );

  useEffect(() => {
    if (isPro) {
      interstitialPolicyReadyRef.current = true;
      return;
    }

    (async () => {
      try {
        const [countRaw, lastShownRaw] = await Promise.all([
          AsyncStorage.getItem(EQUIV_INTERSTITIAL_COUNTER_KEY),
          AsyncStorage.getItem(EQUIV_INTERSTITIAL_LAST_SHOWN_KEY),
        ]);

        interstitialOpenCountRef.current = countRaw ? Number(countRaw) || 0 : 0;
        interstitialLastShownAtRef.current = lastShownRaw
          ? Number(lastShownRaw) || 0
          : 0;
      } catch {
      } finally {
        interstitialPolicyReadyRef.current = true;
      }
    })();
  }, [isPro]);

  useEffect(() => {
    if (isPro || !hasAdMobInterstitialModule) {
      return;
    }

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
  }, [isPro]);

  const maybeShowEquivalentInterstitial = async () => {
    if (isPro || !interstitialPolicyReadyRef.current) {
      return;
    }

    interstitialOpenCountRef.current += 1;
    void AsyncStorage.setItem(
      EQUIV_INTERSTITIAL_COUNTER_KEY,
      String(interstitialOpenCountRef.current),
    );

    const now = Date.now();
    const dueByFrequency =
      interstitialOpenCountRef.current % EQUIV_INTERSTITIAL_EVERY_X_OPENS === 0;
    const dueByCooldown =
      now - interstitialLastShownAtRef.current >= EQUIV_INTERSTITIAL_MIN_GAP_MS;

    if (
      !interstitialLoaded ||
      !interstitial ||
      !dueByFrequency ||
      !dueByCooldown
    ) {
      return;
    }

    try {
      await interstitial.show();
      const shownAt = Date.now();
      interstitialLastShownAtRef.current = shownAt;
      void AsyncStorage.setItem(
        EQUIV_INTERSTITIAL_LAST_SHOWN_KEY,
        String(shownAt),
      );
    } catch {}
  };

  const onToggleEquivalentSolutions = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    await maybeShowEquivalentInterstitial();
    setExpanded(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Comparador de minimización</Text>

      {/*  <View style={styles.row}>
        <Text style={styles.label}>Tu resultado</Text>
        <Text style={styles.value}>{currentResult || "—"}</Text>
      </View>
 */}
      <View style={styles.row}>
        <Text style={styles.label}>Quine-McCluskey</Text>
        <Text style={styles.value}>{comparison.exactExpression}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Heurístico (tipo Espresso)</Text>
        <Text style={styles.value}>{comparison.heuristicExpression}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.helperText}>
          Validado por tabla de verdad en celdas definidas (se ignoran X).
        </Text>
        {comparison.currentResultEquivalent !== null && (
          <Text
            style={[
              styles.badge,
              comparison.currentResultEquivalent
                ? styles.badgeOk
                : styles.badgeWarn,
            ]}
          >
            {comparison.currentResultEquivalent
              ? "Tu resultado es equivalente"
              : "Tu resultado difiere del exacto"}
          </Text>
        )}
        <Text style={styles.metaText}>
          {comparison.hasMultipleEquivalent
            ? `Hay ${comparison.equivalentSolutions} soluciones mínimas equivalentes.`
            : "Se encontró una solución mínima única."}
        </Text>
        <View style={styles.heuristicRow}>
          <Text
            style={[
              styles.badge,
              comparison.heuristicIsOptimal ? styles.badgeOk : styles.badgeWarn,
            ]}
          >
            {comparison.heuristicIsOptimal
              ? "Heurística óptima"
              : "Heurística no óptima"}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.helpButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setShowHeuristicHelp((prev) => !prev)}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </Pressable>
        </View>
        {showHeuristicHelp && (
          <View style={styles.helpCard}>
            <Text style={styles.helpCardText}>
              Óptima: la heurística encontró una forma mínima. No óptima: la
              expresión funciona, pero puede simplificarse más.
            </Text>
          </View>
        )}
      </View>

      {comparison.hasMultipleEquivalent && (
        <View style={styles.expandSection}>
          <Pressable
            style={({ pressed }) => [
              styles.expandButton,
              expanded && styles.expandButtonActive,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              void onToggleEquivalentSolutions();
            }}
          >
            <View style={styles.expandButtonContent}>
              <View style={styles.expandPill}>
                <Text style={styles.expandPillText}>
                  {comparison.equivalentSolutions}
                </Text>
              </View>
              <Text style={styles.expandButtonText}>
                {expanded
                  ? "Ocultar soluciones equivalentes"
                  : "Ver soluciones equivalentes"}
              </Text>
              <Text style={styles.expandChevron}>{expanded ? "▲" : "▼"}</Text>
            </View>
          </Pressable>

          {expanded &&
            comparison.exactExpressions.map((expression, index) => (
              <View key={`${expression}-${index}`} style={styles.solutionRow}>
                <Text style={styles.solutionIndex}>#{index + 1}</Text>
                <Text style={styles.solutionText}>{expression}</Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
  },
  title: {
    color: DUO.ink,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    color: DUO.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "800",
    marginBottom: 2,
  },
  value: {
    color: DUO.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  metaRow: {
    marginTop: 4,
    gap: 8,
  },
  metaText: {
    color: DUO.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  helperText: {
    color: DUO.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#fff",
  },
  badgeOk: {
    backgroundColor: DUO.green,
  },
  badgeWarn: {
    backgroundColor: DUO.orange,
  },
  heuristicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helpButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  helpButtonText: {
    color: DUO.blueDark,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
  },
  helpCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: "#F7FBF2",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  helpCardText: {
    color: DUO.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  expandSection: {
    marginTop: 10,
    gap: 8,
  },
  expandButton: {
    alignSelf: "stretch",
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#93D96B",
    backgroundColor: "#F2FFE8",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  expandButtonActive: {
    backgroundColor: "#E7FBD8",
  },
  expandButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expandPill: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: DUO.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  expandPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
  expandButtonText: {
    color: DUO.blueDark,
    fontWeight: "800",
    fontSize: 13,
    flex: 1,
  },
  expandChevron: {
    color: DUO.blueDark,
    fontSize: 12,
    fontWeight: "900",
  },
  solutionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  solutionIndex: {
    color: DUO.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 1,
  },
  solutionText: {
    flex: 1,
    color: DUO.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});
