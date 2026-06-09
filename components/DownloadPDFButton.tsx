import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { generateCircuitPDF } from "@/utils/pdfGenerator";
import { MaterialIcons } from "@expo/vector-icons";
import { FC, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";

interface DownloadPDFButtonProps {
  compact?: boolean;
}

const DownloadPDFButton: FC<DownloadPDFButtonProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const { resultType, variableQuantity, circuitVector, result, variables } =
    useStore();

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const circuitData = {
        resultType,
        variableQuantity,
        circuitVector,
        resultExpression: result,
        variables,
      };

      const uri = await generateCircuitPDF(circuitData);

      Alert.alert(
        t("result.circuitPdf.successTitle"),
        `${t("result.circuitPdf.successMessage")}${
          uri ? t("result.circuitPdf.shareHint") : ""
        }`,
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Alert.alert(
        t("result.circuitPdf.errorTitle"),
        t("result.circuitPdf.errorMessage"),
        [{ text: "OK" }],
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        compact && styles.buttonCompact,
        isGenerating && styles.buttonDisabled,
      ]}
      onPress={handleDownloadPDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color="#fff" style={styles.icon} />
      ) : (
        <MaterialIcons
          name="picture-as-pdf"
          size={20}
          color="#fff"
          style={styles.icon}
        />
      )}
      <Text style={styles.buttonText}>
        {isGenerating
          ? t("result.circuitPdf.generating")
          : t("result.circuitPdf.button")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.green,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    marginVertical: 10,
    marginHorizontal: 12,
    borderBottomWidth: 4,
    borderBottomColor: DUO.greenDark,
  },
  buttonCompact: {
    flex: 1,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  buttonDisabled: {
    backgroundColor: "#AFC4A4",
    borderBottomColor: "#95A88A",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  icon: {
    marginRight: 8,
  },
});

export default DownloadPDFButton;
