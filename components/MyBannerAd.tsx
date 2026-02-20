import {
  BannerAd,
  getAdaptiveBannerSize,
  hasBannerModule,
} from "@/utils/mobileAds";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MyBannerAdProps {
  bottomOffset?: number;
}

export const MyBannerAd = ({ bottomOffset = 0 }: MyBannerAdProps) => {
  const insets = useSafeAreaInsets();

  if (!hasBannerModule || !BannerAd) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { paddingBottom: insets.bottom + bottomOffset }]}
    >
      <BannerAd
        unitId={"ca-app-pub-4665787383933447/6003028579"}
        size={getAdaptiveBannerSize()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 20,
  },
});
