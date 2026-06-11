import { ReactNode, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ZoomableViewProps {
  contentWidth: number;
  contentHeight: number;
  children: ReactNode;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * Pinch-to-zoom + one-finger pan + double-tap-to-reset container.
 * The content starts fitted to the available area.
 */
const ZoomableView = ({
  contentWidth,
  contentHeight,
  children,
  minZoom = 0.6,
  maxZoom = 5,
}: ZoomableViewProps) => {
  const [container, setContainer] = useState({ width: 0, height: 0 });

  const fitScale =
    container.width > 0 && container.height > 0
      ? Math.min(
          (container.width - 16) / contentWidth,
          (container.height - 16) / contentHeight,
          1,
        )
      : 1;

  const zoom = useSharedValue(1);
  const savedZoom = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      zoom.value = Math.min(
        Math.max(savedZoom.value * event.scale, minZoom),
        maxZoom,
      );
    })
    .onEnd(() => {
      savedZoom.value = zoom.value;
    });

  const pan = Gesture.Pan()
    .maxPointers(2)
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const target = zoom.value > 1.05 ? 1 : 2.2;
      zoom.value = withTiming(target, { duration: 220 });
      savedZoom.value = target;
      translateX.value = withTiming(0, { duration: 220 });
      translateY.value = withTiming(0, { duration: 220 });
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  const gesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(pinch, pan),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: zoom.value * fitScale },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={styles.container}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainer({ width, height });
        }}
      >
        <Animated.View
          style={[
            { width: contentWidth, height: contentHeight },
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ZoomableView;
