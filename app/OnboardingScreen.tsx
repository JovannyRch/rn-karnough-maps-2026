import { LanguageToggle } from "@/components/LanguageToggle";
import { DUO } from "@/constants/duoTheme";
import { markOnboardingSeen } from "@/utils/onboarding";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { TFunction } from "i18next";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { useTranslation } from "react-i18next";
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

const getSlides = (t: TFunction): Slide[] => [
  {
    id: "sop-pos",
    title: t("onboarding.slides.sopPos.title"),
    description: t("onboarding.slides.sopPos.description"),
    icon: "tune",
    accent: DUO.blue,
  },
  {
    id: "values",
    title: t("onboarding.slides.values.title"),
    description: t("onboarding.slides.values.description"),
    icon: "touch-app",
    accent: DUO.green,
  },
  {
    id: "circuit",
    title: t("onboarding.slides.circuit.title"),
    description: t("onboarding.slides.circuit.description"),
    icon: "schema",
    accent: DUO.yellow,
  },
  {
    id: "steps",
    title: t("onboarding.slides.steps.title"),
    description: t("onboarding.slides.steps.description"),
    icon: "school",
    accent: DUO.orange,
  },
  {
    id: "tools",
    title: t("onboarding.slides.tools.title"),
    description: t("onboarding.slides.tools.description"),
    icon: "functions",
    accent: DUO.blueDark,
  },
];

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide> | null>(null);
  const slideWidth = Math.max(width - 32, 0);
  const compactLayout = height < 760;
  const slides = useMemo(() => getSlides(t), [t]);

  const isLast = activeIndex === slides.length - 1;

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
      <View style={[styles.slide, { width: slideWidth }]}>
        <View
          style={[
            styles.iconCard,
            compactLayout && styles.iconCardCompact,
            { borderColor: item.accent },
          ]}
        >
          <MaterialIcons
            name={item.icon}
            size={compactLayout ? 48 : 56}
            color={item.accent}
          />
        </View>
        <Text
          style={[
            styles.slideTitle,
            compactLayout && styles.slideTitleCompact,
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.slideDescription,
            compactLayout && styles.slideDescriptionCompact,
          ]}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.badge}>{t("onboarding.badge")}</Text>
        <View style={styles.topActions}>
          <LanguageToggle />
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.pressed,
            ]}
            onPress={handleDone}
          >
            <Text style={styles.skipText}>{t("onboarding.skip")}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={[styles.title, compactLayout && styles.titleCompact]}>
        {t("onboarding.title")}
      </Text>

      <FlatList
        ref={listRef}
        style={styles.slidesList}
        data={slides}
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
          {slides.map((slide, index) => (
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
            {isLast ? t("onboarding.start") : t("onboarding.next")}
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
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  titleCompact: {
    fontSize: 26,
  },
  slidesList: {
    flex: 1,
  },
  slidesContent: {
    flexGrow: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
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
  iconCardCompact: {
    width: 116,
    height: 116,
    borderRadius: 24,
  },
  slideTitle: {
    color: DUO.ink,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  slideTitleCompact: {
    fontSize: 24,
  },
  slideDescription: {
    color: DUO.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    maxWidth: 320,
  },
  slideDescriptionCompact: {
    fontSize: 15,
    lineHeight: 22,
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
