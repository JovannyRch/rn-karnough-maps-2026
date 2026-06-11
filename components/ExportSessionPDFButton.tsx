import useStore from "@/app/store";
import { CircuitVariant } from "@/components/circuit/model";
import { buildCircuitSvg } from "@/components/circuit/sceneToSvg";
import {
  addAdListener,
  createInterstitialAd,
  hasAdMobInterstitialModule,
} from "@/utils/admobSupport";
import { generateSessionPDF } from "@/utils/pdfGenerator";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useEffect, useRef, useState } from "react";
import { TestIds } from "react-native-google-mobile-ads";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";

const INTERSTITIAL_EXPORT_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-4665787383933447/6321320097";
const INTERSTITIAL_WAIT_TIMEOUT_MS = 3000;
const INTERSTITIAL_POLL_MS = 120;

interface ExportSessionPDFButtonProps {
  compact?: boolean;
  disabled?: boolean;
  circuitVariant?: CircuitVariant;
  circuitCompact?: boolean;
}

const ExportSessionPDFButton: FC<ExportSessionPDFButtonProps> = ({
  compact = false,
  disabled = false,
  circuitVariant = "standard",
  circuitCompact = false,
}) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWaitingAd, setIsWaitingAd] = useState(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState<any>(null);
  const {
    resultType,
    variableQuantity,
    circuitVector,
    result,
    values,
    variableRotation,
    vectorResult,
    boxColors,
    variables,
    isPro,
    adsMutedUntil,
  } = useStore();
  const adsSuppressed = isPro || adsMutedUntil > Date.now();
  const pendingExportAfterAdRef = useRef(false);
  const interstitialLoadedRef = useRef(false);

  useEffect(() => {
    if (adsSuppressed || !hasAdMobInterstitialModule) {
      return;
    }

    const adInstance = createInterstitialAd(INTERSTITIAL_EXPORT_UNIT_ID);
    if (!adInstance) {
      return;
    }
    setInterstitialAd(adInstance);

    const unsubscribeLoaded = addAdListener(adInstance, "adLoaded", () => {
      setInterstitialLoaded(true);
      interstitialLoadedRef.current = true;
    });

    const unsubscribeClosed = addAdListener(adInstance, "adDismissed", () => {
      setInterstitialLoaded(false);
      interstitialLoadedRef.current = false;
      void Promise.resolve(adInstance.load()).catch(() => {});
      if (!pendingExportAfterAdRef.current) {
        return;
      }
      pendingExportAfterAdRef.current = false;
      setIsWaitingAd(false);
      void performExport();
    });

    const unsubscribeFailed = addAdListener(adInstance, "adFailedToLoad", () => {
      setInterstitialLoaded(false);
      interstitialLoadedRef.current = false;
    });

    void Promise.resolve(adInstance.load()).catch(() => {
      setInterstitialLoaded(false);
      interstitialLoadedRef.current = false;
    });

    return () => {
      unsubscribeLoaded.remove();
      unsubscribeClosed.remove();
      unsubscribeFailed.remove();
    };
  }, [adsSuppressed]);

  useEffect(() => {
    interstitialLoadedRef.current = interstitialLoaded;
  }, [interstitialLoaded]);

  const performExport = async () => {
    try {
      setIsGenerating(true);
      const uri = await generateSessionPDF({
        resultType,
        variableQuantity,
        circuitVector,
        resultExpression: result,
        values,
        variableRotation,
        vectorResult,
        boxColors,
        variables,
        circuitSvg:
          buildCircuitSvg({
            circuitVector,
            resultType,
            variables,
            variant: circuitVariant,
            compact: circuitCompact,
            values,
            variableQuantity,
            variableRotation,
          }) ?? undefined,
      });

      Alert.alert(
        t("result.sessionPdf.successTitle"),
        `${t("result.sessionPdf.successMessage")}${
          uri ? t("result.sessionPdf.shareHint") : ""
        }`,
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Error al exportar sesión PDF:", error);
      Alert.alert(
        t("result.sessionPdf.errorTitle"),
        t("result.sessionPdf.errorMessage"),
        [{ text: "OK" }],
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (isGenerating || isWaitingAd || disabled) {
      return;
    }

    if (!adsSuppressed && interstitialAd) {
      setIsWaitingAd(true);

      if (!interstitialLoadedRef.current) {
        try {
          await Promise.resolve(interstitialAd.load());
        } catch {}

        const startedAt = Date.now();
        while (
          !interstitialLoadedRef.current &&
          Date.now() - startedAt < INTERSTITIAL_WAIT_TIMEOUT_MS
        ) {
          await new Promise((resolve) => setTimeout(resolve, INTERSTITIAL_POLL_MS));
        }
      }

      if (!interstitialLoadedRef.current) {
        setIsWaitingAd(false);
        await performExport();
        return;
      }

      pendingExportAfterAdRef.current = true;
      try {
        await interstitialAd.show();
      } catch {
        pendingExportAfterAdRef.current = false;
        setIsWaitingAd(false);
        await performExport();
      }
      return;
    }

    await performExport();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        compact && styles.buttonCompact,
        (isGenerating || isWaitingAd || disabled) && styles.buttonDisabled,
      ]}
      onPress={handleExport}
      disabled={isGenerating || isWaitingAd || disabled}
    >
      {isGenerating || isWaitingAd ? (
        <ActivityIndicator size="small" color="#fff" style={styles.icon} />
      ) : (
        <MaterialIcons
          name="assignment"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      )}
      <Text style={styles.buttonText}>
        {isGenerating
          ? t("result.sessionPdf.generating")
          : isWaitingAd
            ? t("result.sessionPdf.showingAd")
            : t("result.sessionPdf.button")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
    minHeight: 46,
    borderRadius: 14,
    borderBottomWidth: 4,
    borderBottomColor: "#1A4EA0",
    backgroundColor: "#2D7FF9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonCompact: {
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 0,
  },
  buttonDisabled: {
    backgroundColor: "#9FBCE8",
    borderBottomColor: "#7FA0D6",
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default ExportSessionPDFButton;
