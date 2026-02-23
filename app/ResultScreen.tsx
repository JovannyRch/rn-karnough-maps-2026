import { CircuitComponent } from "@/components/Circuit";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import DownloadPDFButton from "@/components/DownloadPDFButton";
import ExportSessionPDFButton from "@/components/ExportSessionPDFButton";
import MinimizationComparisonCard from "@/components/MinimizationComparisonCard";
import { MyBannerAd } from "@/components/MyBannerAd";
import { ProButton } from "@/components/ProBadge";
import ResultRow from "@/components/ResultRow";
import { DUO } from "@/constants/duoTheme";
import useStore from "./store";

interface ResultScreenProps {
  navigation: any;
}

const ResultScreen = ({ navigation }: ResultScreenProps) => {
  const { isPro, adsMutedUntil, resultType, variableQuantity, values, result } =
    useStore();
  const adsSuppressed = isPro || adsMutedUntil > Date.now();
  const insets = useSafeAreaInsets();
  const fade = useSharedValue(0);
  const lift = useSharedValue(14);
  const [isCircuitFullscreen, setIsCircuitFullscreen] = useState(false);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 300 });
    lift.value = withTiming(0, { duration: 300 });
  }, [fade, lift]);

  const entranceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: lift.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Reanimated.View style={[styles.header, entranceAnimatedStyle]}>
        <View>
          <Text style={styles.badge}>SALIDA LÓGICA</Text>
          <Text style={styles.title}>Circuito</Text>
        </View>
        <ProButton navigation={navigation} />
      </Reanimated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (adsSuppressed ? 20 : 84) },
        ]}
      >
        <Reanimated.View style={[styles.content, entranceAnimatedStyle]}>
          <ResultRow />
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>Tipo: {resultType}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>Variables: {variableQuantity}</Text>
            </View>
          </View>
          <View style={styles.actionsRow}>
            <DownloadPDFButton compact />
            {/* <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Editar mapa</Text>
            </Pressable> */}
          </View>
          <ExportSessionPDFButton />
          <MinimizationComparisonCard
            values={values}
            variableQuantity={variableQuantity}
            resultType={resultType}
            currentResult={result}
          />
          <Text style={styles.sectionTitle}>Diagrama del circuito</Text>
          <Pressable
            style={({ pressed }) => [
              styles.fullscreenButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setIsCircuitFullscreen(true)}
          >
            <Text style={styles.fullscreenButtonText}>
              Ver en pantalla completa
            </Text>
          </Pressable>
          <View style={styles.circuitCard}>
            <CircuitComponent />
          </View>
        </Reanimated.View>
      </ScrollView>
      {!adsSuppressed && <MyBannerAd />}

      <Modal
        visible={isCircuitFullscreen}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsCircuitFullscreen(false)}
      >
        <SafeAreaView style={styles.fullscreenContainer}>
          <View style={styles.fullscreenHeader}>
            <Text style={styles.fullscreenTitle}>Circuito</Text>
            <Pressable
              style={({ pressed }) => [
                styles.fullscreenCloseButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setIsCircuitFullscreen(false)}
            >
              <Text style={styles.fullscreenCloseText}>Cerrar</Text>
            </Pressable>
          </View>
          <View style={styles.fullscreenCircuitCard}>
            <CircuitComponent
              bottomPadding={adsSuppressed ? 24 : 96 + insets.bottom}
              enableZoom
            />
          </View>
          {!adsSuppressed && <MyBannerAd />}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    fontSize: 27,
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  metaPill: {
    backgroundColor: DUO.greenSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  metaText: {
    color: "#3A7F1A",
    fontWeight: "800",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  backButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 14,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
  },
  sectionTitle: {
    paddingHorizontal: 14,
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginVertical: 6,
  },
  circuitCard: {
    marginHorizontal: 12,
    marginTop: 0,
    marginBottom: 12,
    minHeight: 300,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    overflow: "hidden",
  },
  fullscreenButton: {
    marginHorizontal: 12,
    marginBottom: 8,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenButtonText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 13,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: DUO.bg,
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
  },
  fullscreenTitle: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 20,
  },
  fullscreenCloseButton: {
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenCloseText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 13,
  },
  fullscreenCircuitCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    overflow: "hidden",
  },
});

export default ResultScreen;
