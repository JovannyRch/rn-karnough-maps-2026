import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BoxColor, GroupStepInfo, VectorResultItem } from "./types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRO_STATUS_KEY = "@isPro";
const ADS_MUTED_UNTIL_KEY = "@ads_muted_until";
const SESSION_KEY = "@kmaps_session_v1";

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
  setVariableName: (index: number, value: string) => void;
  variableRotation: number;
  rotateVariables: () => void;
  focusedGroupIndex: number | null;
  setFocusedGroupIndex: (groupIndex: number | null) => void;
  groupsInfo: GroupStepInfo[];
  setGroupsInfo: (newGroupsInfo: GroupStepInfo[]) => void;
  /** Current step in step-by-step mode; null = mode off. */
  stepIndex: number | null;
  setStepIndex: (stepIndex: number | null) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  adsMutedUntil: number;
  setAdsMutedUntil: (timestamp: number) => void;
}

/** Slice of the store that survives app restarts. */
interface PersistedSession {
  values: string[];
  variableQuantity: number;
  resultType: "SOP" | "POS";
  variables: string[];
  variableRotation: number;
  view: "table" | "map";
}

const VARIABLE_QUANTITY = 4;
const getBaseVariables = (quantity: number) =>
  Array.from({ length: quantity }, (_, i) => String.fromCharCode(65 + i));
const normalizeVariableName = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "")
    .slice(0, 3);

const isValidSession = (data: Partial<PersistedSession>): boolean => {
  const n = data.variableQuantity;
  if (!Number.isInteger(n) || (n as number) < 2 || (n as number) > 5) {
    return false;
  }

  const quantity = n as number;
  if (
    !Array.isArray(data.values) ||
    data.values.length !== 2 ** quantity ||
    data.values.some((item) => item !== "0" && item !== "1" && item !== "X")
  ) {
    return false;
  }

  if (data.resultType !== "SOP" && data.resultType !== "POS") {
    return false;
  }

  if (
    !Array.isArray(data.variables) ||
    data.variables.length !== quantity ||
    data.variables.some(
      (item) => typeof item !== "string" || !item || item.length > 3,
    ) ||
    new Set(data.variables).size !== quantity
  ) {
    return false;
  }

  if (
    !Number.isInteger(data.variableRotation) ||
    (data.variableRotation as number) < 0 ||
    (data.variableRotation as number) >= quantity
  ) {
    return false;
  }

  return data.view === "map" || data.view === "table";
};

export const useStore = create<ResultStore>()(
  persist(
    (set) => ({
      variableQuantity: VARIABLE_QUANTITY,
      values: Array.from({ length: 2 ** VARIABLE_QUANTITY }, () => "0"),
      setValues: (newValues: string[]) => set({ values: newValues }),
      setAllValues: (newValue: string) =>
        set((state) => ({
          values: Array.from(
            { length: 2 ** state.variableQuantity },
            () => newValue,
          ),
        })),
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
      setBoxColors: (newBoxColors: BoxColor[]) =>
        set({ boxColors: newBoxColors }),
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
      variables: getBaseVariables(VARIABLE_QUANTITY),
      setVariableName: (index: number, value: string) =>
        set((state) => {
          if (index < 0 || index >= state.variableQuantity) {
            return state;
          }

          const next = [...state.variables];
          const candidate = normalizeVariableName(value);

          if (
            candidate &&
            next.some(
              (item, itemIndex) => itemIndex !== index && item === candidate,
            )
          ) {
            return state;
          }

          next[index] = candidate;
          return { variables: next };
        }),
      variableRotation: 0,
      rotateVariables: () =>
        set((state) => {
          const nextRotation =
            (state.variableRotation + 1) % state.variableQuantity;
          const rotated = state.variables.map(
            (_, index) =>
              state.variables[(index + 1) % state.variableQuantity] ??
              state.variables[index],
          );

          return {
            variableRotation: nextRotation,
            variables: rotated,
          };
        }),
      focusedGroupIndex: null,
      setFocusedGroupIndex: (groupIndex: number | null) =>
        set({ focusedGroupIndex: groupIndex }),
      groupsInfo: [],
      setGroupsInfo: (newGroupsInfo: GroupStepInfo[]) =>
        set({ groupsInfo: newGroupsInfo }),
      stepIndex: null,
      setStepIndex: (stepIndex: number | null) => set({ stepIndex }),
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
    }),
    {
      name: SESSION_KEY,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): PersistedSession => ({
        values: state.values,
        variableQuantity: state.variableQuantity,
        resultType: state.resultType,
        variables: state.variables,
        variableRotation: state.variableRotation,
        view: state.view,
      }),
      merge: (persisted, current) => {
        const session = persisted as Partial<PersistedSession> | undefined;
        if (!session || !isValidSession(session)) {
          return current;
        }
        return { ...current, ...session };
      },
    },
  ),
);

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
