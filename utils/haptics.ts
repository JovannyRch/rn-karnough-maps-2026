import * as Haptics from "expo-haptics";

// Fire-and-forget haptics; failures (web, simulators, disabled hardware)
// are silently ignored.

export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export const hapticSelect = () => {
  Haptics.selectionAsync().catch(() => {});
};

export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
};
