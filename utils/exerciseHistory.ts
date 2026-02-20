import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ExerciseHistoryEntry {
  id: string;
  createdAt: string;
  variableQuantity: number;
  resultType: "SOP" | "POS";
  values: string[];
  result: string;
  isFavorite: boolean;
}

const HISTORY_KEY = "@exercise_history_v1";
const MAX_HISTORY_ITEMS = 40;

export const getExerciseHistory = async (): Promise<ExerciseHistoryEntry[]> => {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ExerciseHistoryEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => ({
      ...item,
      isFavorite: typeof item.isFavorite === "boolean" ? item.isFavorite : false,
    }));
  } catch (error) {
    console.error("Error loading exercise history:", error);
    return [];
  }
};

export const addExerciseHistoryEntry = async (
  entry: Omit<ExerciseHistoryEntry, "id" | "createdAt">
): Promise<void> => {
  try {
    const current = await getExerciseHistory();
    const newEntry: ExerciseHistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      isFavorite: entry.isFavorite ?? false,
    };

    const next = [newEntry, ...current].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Error saving exercise history:", error);
  }
};

export const removeExerciseHistoryEntry = async (id: string): Promise<void> => {
  try {
    const current = await getExerciseHistory();
    const next = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Error removing exercise history item:", error);
  }
};

export const clearExerciseHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing exercise history:", error);
  }
};

export const toggleExerciseFavorite = async (id: string): Promise<void> => {
  try {
    const current = await getExerciseHistory();
    const next = current.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Error toggling exercise favorite:", error);
  }
};
