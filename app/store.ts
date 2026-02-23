import { create } from "zustand";
import { BoxColor, VectorResultItem } from "./types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRO_STATUS_KEY = "@isPro";
const ADS_MUTED_UNTIL_KEY = "@ads_muted_until";

interface ResultStore {
  result: string;
  setResult: (newResult: string) => void;
  vectorResult: VectorResultItem[];
  setVectorResult: (newVectorResult: VectorResultItem[]) => void;
  clearResult: () => void;
  values: string[];
  setAllValues: (newValue: string) => void;
  setValues: (newValues: string[]) => void;
  variableQuantity: number;
  setVariableQuantity: (newQuantity: number) => void;
  boxColors: BoxColor[];
  setBoxColors: (newBoxColors: BoxColor[]) => void;
  reset: () => void;
  resultType: "SOP" | "POS";
  setResultType: (newResultType: "SOP" | "POS") => void;
  circuitVector: string[];
  setCircuitVector: (newCircuitVector: string[]) => void;
  view: "table" | "map";
  setView: (newView: "table" | "map") => void;
  variables: string[];
  variableRotation: number;
  rotateVariables: () => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  adsMutedUntil: number;
  setAdsMutedUntil: (timestamp: number) => void;
}

const VARIABLE_QUANTITY = 4;
const getBaseVariables = (quantity: number) =>
  Array.from({ length: quantity }, (_, i) => String.fromCharCode(65 + i));

export const useStore = create<ResultStore>((set) => ({
  variableQuantity: VARIABLE_QUANTITY,
  values: Array.from({ length: 2 ** VARIABLE_QUANTITY }, () => "0"),
  setValues: (newValues: string[]) => set({ values: newValues }),
  setAllValues: (newValue: string) => {
    set({ values: Array.from({ length: 2 ** 4 }, () => newValue) });
  },
  result: "",
  setResult: (newResult: string) => set({ result: newResult }),
  clearResult: () => set({ result: "" }),

  setVariableQuantity: (newQuantity: number) => {
    set({ result: "" });
    set({ boxColors: [] });
    set({ values: Array.from({ length: 2 ** newQuantity }, () => "0") });
    set({ variables: getBaseVariables(newQuantity) });
    set({ variableQuantity: newQuantity });
    set({ variableRotation: 0 }); // Reset rotation when changing variable quantity
  },
  boxColors: [],
  setBoxColors: (newBoxColors: BoxColor[]) => set({ boxColors: newBoxColors }),
  reset: () => {
    set({ result: "" });
    set({ boxColors: [] });
  },
  resultType: "SOP",
  setResultType: (newResultType: "SOP" | "POS") =>
    set({ resultType: newResultType }),
  vectorResult: [],
  setVectorResult: (newVectorResult: VectorResultItem[]) =>
    set({ vectorResult: newVectorResult }),
  circuitVector: [],
  setCircuitVector: (newCircuitResult: string[]) => {
    return set({
      circuitVector: newCircuitResult.map((item) => {
        if (item.endsWith(".")) {
          return item.slice(0, item.length - 1);
        }

        if (item.startsWith("+")) {
          return item.slice(0, item.length - 1);
        }

        return item;
      }),
    });
  },
  view: "map",
  setView: (newView: "table" | "map") => set({ view: newView }),
  variables: ["A", "B"],
  variableRotation: 0,
  rotateVariables: () =>
    set((state) => {
      const nextRotation = (state.variableRotation + 1) % state.variableQuantity;
      const base = getBaseVariables(state.variableQuantity);
      const rotated = base.map(
        (_, index) => base[(index + nextRotation) % state.variableQuantity]
      );

      return {
        variableRotation: nextRotation,
        variables: rotated,
      };
    }),
  isPro: false,
  setIsPro: async (isPro: boolean) => {
    set({ isPro });
    try {
      await AsyncStorage.setItem(PRO_STATUS_KEY, JSON.stringify(isPro));
    } catch (error) {
      console.error("Error saving pro status:", error);
    }
  },
  adsMutedUntil: 0,
  setAdsMutedUntil: async (timestamp: number) => {
    set({ adsMutedUntil: timestamp });
    try {
      await AsyncStorage.setItem(ADS_MUTED_UNTIL_KEY, String(timestamp));
    } catch (error) {
      console.error("Error saving ads muted timestamp:", error);
    }
  },
}));

// Cargar el estado de PRO al iniciar
AsyncStorage.getItem(PRO_STATUS_KEY)
  .then((value) => {
    if (value !== null) {
      useStore.setState({ isPro: JSON.parse(value) });
    }
  })
  .catch((error) => {
    console.error("Error loading pro status:", error);
  });

AsyncStorage.getItem(ADS_MUTED_UNTIL_KEY)
  .then((value) => {
    if (value !== null) {
      useStore.setState({ adsMutedUntil: Number(value) || 0 });
    }
  })
  .catch((error) => {
    console.error("Error loading ads muted timestamp:", error);
  });

export default useStore;
