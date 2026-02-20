import { DUO } from "@/constants/duoTheme";
import { markOnboardingSeen } from "@/utils/onboarding";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnboardingScreenProps {
  navigation: any;
}

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    id: "sop-pos",
    title: "SOP vs POS",
    description:
      "SOP minimiza con 1s. POS minimiza con 0s. Cambia el tipo arriba para resolver en el formato que te pidan.",
    icon: "tune",
    accent: DUO.blue,
  },
  {
    id: "values",
    title: "Cambiar 0 / 1 / X",
    description:
      "Toca cada celda para alternar 0 → 1 → X. Usa chips rápidos para llenar todo el mapa en un solo toque.",
    icon: "touch-app",
    accent: DUO.green,
  },
  {
    id: "circuit",
    title: "Leer el circuito",
    description:
      "El resultado se actualiza abajo. Toca Circuito para ver compuertas y exportar PDF del diagrama.",
    icon: "schema",
    accent: DUO.yellow,
  },
];

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide> | null>(null);

  const isLast = activeIndex === SLIDES.length - 1;

  const handleDone = async () => {
    await markOnboardingSeen();
    navigation.replace("GridScreen");
  };

  const handleNext = () => {
    if (isLast) {
      handleDone();
      return;
    }
    listRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  const viewabilityConfig = useMemo(
    () => ({
      viewAreaCoveragePercentThreshold: 65,
    }),
    [],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0]?.index;
      if (typeof first === "number") {
        setActiveIndex(first);
      }
    },
  ).current;

  const renderSlide: ListRenderItem<Slide> = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconCard, { borderColor: item.accent }]}>
          <MaterialIcons name={item.icon} size={56} color={item.accent} />
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.badge}>BIENVENIDO</Text>
        <Pressable
          style={({ pressed }) => [
            styles.skipButton,
            pressed && styles.pressed,
          ]}
          onPress={handleDone}
        >
          <Text style={styles.skipText}>Saltar</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Empieza en 3 pasos</Text>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slidesContent}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>
            {isLast ? "Comenzar" : "Siguiente"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DUO.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    color: DUO.blueDark,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1,
  },
  skipButton: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.border,
  },
  skipText: {
    color: DUO.muted,
    fontWeight: "800",
    fontSize: 12,
  },
  title: {
    marginTop: 6,
    color: DUO.ink,
    fontSize: 30,
    fontWeight: "900",
  },
  slidesContent: {
    flexGrow: 1,
  },
  slide: {
    width: 360,
    maxWidth: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 16,
  },
  iconCard: {
    width: 132,
    height: 132,
    borderRadius: 28,
    backgroundColor: DUO.card,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  slideTitle: {
    color: DUO.ink,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  slideDescription: {
    color: DUO.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 340,
  },
  footer: {
    paddingBottom: 18,
    gap: 14,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: "#C7DDB7",
  },
  dotActive: {
    width: 24,
    backgroundColor: DUO.green,
  },
  ctaButton: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.green,
    borderBottomWidth: 4,
    borderBottomColor: DUO.greenDark,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
});
