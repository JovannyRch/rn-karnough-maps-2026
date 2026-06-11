import useStore from "@/app/store";
import { expressionToValues } from "@/app/utils/expressionParser";
import { DUO } from "@/constants/duoTheme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

interface ExpressionInputDialogProps {
  visible: boolean;
  onClose: () => void;
}

/** Type a Boolean expression and fill the map from its truth table. */
const ExpressionInputDialog = ({
  visible,
  onClose,
}: ExpressionInputDialogProps) => {
  const { t } = useTranslation();
  const {
    variables,
    variableQuantity,
    variableRotation,
    setValues,
    setView,
  } = useStore();
  const [input, setInput] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  const quickTokens = [
    ...variables.slice(0, variableQuantity),
    "′",
    "+",
    "·",
    "(",
    ")",
    "0",
    "1",
  ];

  const appendToken = (token: string) => {
    setErrorText(null);
    setInput((current) => current + token);
  };

  const close = () => {
    setErrorText(null);
    onClose();
  };

  const handleSubmit = () => {
    const result = expressionToValues(
      input,
      variables,
      variableQuantity,
      variableRotation,
    );

    if (!result.ok) {
      setErrorText(
        result.error.kind === "unknownToken"
          ? t("expression.errorUnknown", { token: result.error.token })
          : t("expression.errorSyntax"),
      );
      return;
    }

    setValues(result.values);
    setView("map");
    setInput("");
    setErrorText(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{t("expression.title")}</Text>
          <Text style={styles.body}>{t("expression.body")}</Text>

          <TextInput
            value={input}
            onChangeText={(text) => {
              setErrorText(null);
              setInput(text);
            }}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
            placeholder={t("expression.placeholder")}
            placeholderTextColor={DUO.placeholder}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tokenScroll}
            contentContainerStyle={styles.tokenRow}
            keyboardShouldPersistTaps="always"
          >
            {quickTokens.map((token, index) => (
              <Pressable
                key={`tok-${index}-${token}`}
                accessibilityRole="button"
                accessibilityLabel={token}
                style={({ pressed }) => [
                  styles.tokenChip,
                  pressed && styles.pressed,
                ]}
                onPress={() => appendToken(token)}
              >
                <Text style={styles.tokenChipText}>{token}</Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("expression.clear")}
              style={({ pressed }) => [
                styles.tokenChip,
                styles.tokenChipMuted,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setErrorText(null);
                setInput("");
              }}
            >
              <Text style={styles.tokenChipMutedText}>
                {t("expression.clear")}
              </Text>
            </Pressable>
          </ScrollView>

          {errorText && <Text style={styles.error}>{errorText}</Text>}

          <Pressable
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && styles.pressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryActionText}>
              {t("expression.action")}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryAction,
              pressed && styles.pressed,
            ]}
            onPress={close}
          >
            <Text style={styles.secondaryActionText}>
              {t("expression.cancel")}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: DUO.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    padding: 16,
  },
  title: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 17,
  },
  body: {
    color: DUO.muted,
    fontWeight: "600",
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  input: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: DUO.border,
    backgroundColor: DUO.bg,
    paddingHorizontal: 12,
    color: DUO.ink,
    fontSize: 17,
    fontWeight: "800",
  },
  tokenScroll: {
    flexGrow: 0,
    marginTop: 10,
  },
  tokenRow: {
    gap: 6,
    alignItems: "center",
  },
  tokenChip: {
    minWidth: 38,
    minHeight: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.greenFaint,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  tokenChipText: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 15,
  },
  tokenChipMuted: {
    backgroundColor: DUO.card,
  },
  tokenChipMutedText: {
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 12,
  },
  error: {
    marginTop: 10,
    color: DUO.danger,
    fontWeight: "700",
    fontSize: 12.5,
  },
  primaryAction: {
    marginTop: 14,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: DUO.green,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: DUO.greenDark,
  },
  primaryActionText: {
    color: DUO.white,
    fontWeight: "900",
    fontSize: 15,
  },
  secondaryAction: {
    marginTop: 8,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DUO.borderStrong,
    backgroundColor: DUO.card,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 14,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});

export default ExpressionInputDialog;
