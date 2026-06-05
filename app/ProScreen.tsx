import { DUO } from "@/constants/duoTheme";
import {
  endProIap,
  fetchProProduct,
  initProIap,
  isIapConfigured,
  purchasePro,
  restoreProPurchase,
} from "@/utils/proPurchase";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "./store";

interface ProScreenProps {
  navigation: any;
}

export default function ProScreen({ navigation }: ProScreenProps) {
  const { isPro, setIsPro } = useStore();
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [priceLabel, setPriceLabel] = useState<string | null>(null);
  const [iapError, setIapError] = useState(false);
  const fade = useSharedValue(0);
  const lift = useSharedValue(18);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 320 });
    lift.value = withTiming(0, { duration: 320 });
  }, [fade, lift]);

  useEffect(() => {
    if (isPro || !isIapConfigured()) {
      return;
    }

    let cancelled = false;

    const loadIapProduct = async () => {
      try {
        setIsLoadingProduct(true);
        await initProIap();
        const product = await fetchProProduct();
        if (!cancelled && product?.localizedPrice) {
          setPriceLabel(product.localizedPrice);
        }
      } catch (error) {
        if (!cancelled) {
          setIapError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProduct(false);
        }
      }
    };

    void loadIapProduct();

    return () => {
      cancelled = true;
      void endProIap();
    };
  }, [isPro]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: lift.value }],
  }));

  const handlePurchase = async () => {
    if (!isIapConfigured()) {
      Alert.alert(
        "Compras no configuradas",
        "Falta instalar/configurar react-native-iap para compras reales.",
      );
      return;
    }

    if (isPurchasing || isRestoring) {
      return;
    }

    setIsPurchasing(true);
    try {
      await initProIap();
      const success = await purchasePro();

      if (!success) {
        Alert.alert("Compra no completada", "No se detectó una compra válida.");
        return;
      }

      setIsPro(true);
      Alert.alert("¡Gracias!", "Has adquirido la versión PRO.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log("IAP purchase error", error);
      Alert.alert("Error", "No fue posible completar la compra.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    if (!isIapConfigured()) {
      Alert.alert(
        "Compras no configuradas",
        "Falta instalar/configurar react-native-iap para restaurar compras.",
      );
      return;
    }

    if (isPurchasing || isRestoring) {
      return;
    }

    setIsRestoring(true);
    try {
      await initProIap();
      const restored = await restoreProPurchase();

      if (!restored) {
        Alert.alert(
          "Sin compras encontradas",
          "No se encontró una compra PRO para esta cuenta.",
        );
        return;
      }

      setIsPro(true);
      Alert.alert("Restaurado", "Tu compra PRO fue restaurada correctamente.");
    } catch (error) {
      console.log("IAP restore error", error);
      Alert.alert("Error", "No fue posible restaurar compras.");
    } finally {
      setIsRestoring(false);
    }
  };

  const proFeatures = [
    "Sin anuncios publicitarios",
    "Flujo de estudio sin interrupciones",
    "Apoyo al desarrollo continuo",
    "Compra única, sin suscripción",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Reanimated.View style={[styles.content, contentAnimatedStyle]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <Text style={styles.heroIcon}>{isPro ? "👑" : "⭐"}</Text>
            <Text style={styles.title}>
              {isPro ? "PRO Activado" : "Versión PRO"}
            </Text>
            <Text style={styles.subtitle}>
              {isPro
                ? "Gracias por apoyar la app."
                : "Desbloquea una experiencia enfocada en resolver más rápido."}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Beneficios</Text>
            {proFeatures.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {!isPro && !iapError && (
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Precio especial</Text>
              {priceLabel ? (
                <Text style={styles.price}>{priceLabel}</Text>
              ) : (
                <ActivityIndicator color={DUO.green} />
              )}
              <Text style={styles.priceNote}>
                Pago único • Sin renovación automática
              </Text>
            </View>
          )}

          {!isPro && !iapError && (
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                (isPurchasing || isRestoring) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handlePurchase}
              disabled={isPurchasing || isRestoring}
            >
              {isPurchasing || isLoadingProduct ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Comprar versión PRO</Text>
              )}
            </Pressable>
          )}

          {!isPro && !iapError && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                (isPurchasing || isRestoring) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleRestore}
              disabled={isPurchasing || isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator color={DUO.greenDark} />
              ) : (
                <Text style={styles.secondaryButtonText}>Restaurar compras</Text>
              )}
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.ghostButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.ghostButtonText}>
              {isPro ? "Volver" : "Tal vez después"}
            </Text>
          </Pressable>
        </ScrollView>
      </Reanimated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DUO.bg,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  hero: {
    backgroundColor: DUO.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DUO.border,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  heroIcon: {
    fontSize: 46,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: DUO.ink,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: DUO.muted,
    textAlign: "center",
    marginTop: 8,
  },
  card: {
    backgroundColor: DUO.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.border,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DUO.ink,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DUO.green,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: DUO.greenDark,
  },
  checkText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
  featureText: {
    flex: 1,
    color: DUO.ink,
    fontWeight: "600",
    fontSize: 15,
  },
  priceCard: {
    backgroundColor: DUO.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DUO.border,
    paddingVertical: 16,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: DUO.muted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  price: {
    marginTop: 6,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    color: DUO.green,
  },
  priceNote: {
    marginTop: 4,
    fontSize: 13,
    color: DUO.muted,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.green,
    borderBottomWidth: 4,
    borderBottomColor: DUO.greenDark,
    marginTop: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.green,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: DUO.greenDark,
    fontSize: 14,
    fontWeight: "800",
  },
  ghostButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButtonText: {
    color: DUO.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
  },
});
