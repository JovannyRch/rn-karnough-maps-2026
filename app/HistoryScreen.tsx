import { MyBannerAd } from "@/components/MyBannerAd";
import { DUO } from "@/constants/duoTheme";
import {
  ExerciseHistoryEntry,
  clearExerciseHistory,
  getExerciseHistory,
  removeExerciseHistoryEntry,
  toggleExerciseFavorite,
} from "@/utils/exerciseHistory";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "./store";

interface HistoryScreenProps {
  navigation: any;
}

type TypeFilter = "ALL" | "SOP" | "POS";
type VariableFilter = "ALL" | 2 | 3 | 4;
type FavoriteFilter = "ALL" | "FAVORITES";
type HistoryListItem =
  | { type: "section"; title: string; key: string }
  | { type: "item"; key: string; item: ExerciseHistoryEntry };

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [history, setHistory] = useState<ExerciseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [variableFilter, setVariableFilter] = useState<VariableFilter>("ALL");
  const [favoriteFilter, setFavoriteFilter] = useState<FavoriteFilter>("ALL");
  const { isPro, adsMutedUntil } = useStore();
  const adsSuppressed = isPro || adsMutedUntil > Date.now();

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const data = await getExerciseHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadHistory);
    return unsubscribe;
  }, [loadHistory, navigation]);

  const handleUseExercise = (entry: ExerciseHistoryEntry) => {
    navigation.navigate("GridScreen", {
      historyEntryToLoad: entry,
    });
  };

  const handleDelete = (entry: ExerciseHistoryEntry) => {
    Alert.alert(
      "Eliminar ejercicio",
      "¿Seguro que quieres borrar este ejercicio del historial?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await removeExerciseHistoryEntry(entry.id);
            loadHistory();
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    if (history.length === 0) {
      return;
    }

    Alert.alert(
      "Limpiar historial",
      "Se eliminarán todos los ejercicios guardados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar",
          style: "destructive",
          onPress: async () => {
            await clearExerciseHistory();
            loadHistory();
          },
        },
      ],
    );
  };

  const handleToggleFavorite = async (entry: ExerciseHistoryEntry) => {
    await toggleExerciseFavorite(entry.id);
    loadHistory();
  };

  const filteredHistory = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return history.filter((item) => {
      const matchesType =
        typeFilter === "ALL" || item.resultType === typeFilter;
      const matchesVariables =
        variableFilter === "ALL" || item.variableQuantity === variableFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.result.toLowerCase().includes(normalizedSearch);
      const matchesFavorite =
        favoriteFilter === "ALL" ||
        (favoriteFilter === "FAVORITES" && item.isFavorite);

      return (
        matchesType && matchesVariables && matchesSearch && matchesFavorite
      );
    });
  }, [favoriteFilter, history, searchText, typeFilter, variableFilter]);

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    typeFilter !== "ALL" ||
    variableFilter !== "ALL" ||
    favoriteFilter !== "ALL";

  const favoriteEntries = useMemo(
    () => filteredHistory.filter((item) => item.isFavorite),
    [filteredHistory],
  );

  const regularEntries = useMemo(
    () => filteredHistory.filter((item) => !item.isFavorite),
    [filteredHistory],
  );

  const sectionedHistory = useMemo<HistoryListItem[]>(() => {
    const sections: HistoryListItem[] = [];

    if (favoriteEntries.length > 0) {
      sections.push({
        type: "section",
        title: "⭐ Favoritos",
        key: "section-favorites",
      });
      favoriteEntries.forEach((item) => {
        sections.push({ type: "item", key: item.id, item });
      });
    }

    if (regularEntries.length > 0) {
      sections.push({
        type: "section",
        title: "Historial",
        key: "section-history",
      });
      regularEntries.forEach((item) => {
        sections.push({ type: "item", key: item.id, item });
      });
    }

    return sections;
  }, [favoriteEntries, regularEntries]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.badge}>PROGRESO</Text>
          <Text style={styles.title}>Historial</Text>
        </View>

        <Pressable
          onPress={handleClearAll}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
            history.length === 0 && styles.disabled,
          ]}
          disabled={history.length === 0}
        >
          <MaterialIcons name="delete-sweep" size={18} color="#fff" />
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </Pressable>
      </View>

      <View style={styles.filtersSection}>
        <View style={styles.searchRow}>
          <MaterialIcons name="search" size={18} color={DUO.muted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por resultado"
            placeholderTextColor={DUO.muted}
            style={styles.searchInput}
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => setSearchText("")}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <MaterialIcons name="close" size={18} color={DUO.muted} />
            </Pressable>
          )}
        </View>

        <View style={styles.filtersRow}>
          <FilterChip
            label="Favoritos"
            active={favoriteFilter === "FAVORITES"}
            onPress={() =>
              setFavoriteFilter(
                favoriteFilter === "FAVORITES" ? "ALL" : "FAVORITES",
              )
            }
          />
          <FilterChip
            label="Todo"
            active={typeFilter === "ALL"}
            onPress={() => setTypeFilter("ALL")}
          />
          <FilterChip
            label="SOP"
            active={typeFilter === "SOP"}
            onPress={() => setTypeFilter("SOP")}
          />
          <FilterChip
            label="POS"
            active={typeFilter === "POS"}
            onPress={() => setTypeFilter("POS")}
          />
        </View>

        <View style={styles.filtersRow}>
          <FilterChip
            label="Cualquier var"
            active={variableFilter === "ALL"}
            onPress={() => setVariableFilter("ALL")}
          />
          <FilterChip
            label="2"
            active={variableFilter === 2}
            onPress={() => setVariableFilter(2)}
          />
          <FilterChip
            label="3"
            active={variableFilter === 3}
            onPress={() => setVariableFilter(3)}
          />
          <FilterChip
            label="4"
            active={variableFilter === 4}
            onPress={() => setVariableFilter(4)}
          />
        </View>
      </View>

      <FlatList
        data={sectionedHistory}
        keyExtractor={(item) => item.key}
        refreshing={loading}
        onRefresh={loadHistory}
        contentContainerStyle={[
          styles.listContent,
          sectionedHistory.length === 0 && styles.listContentEmpty,
        ]}
        renderItem={({ item }) => {
          if (item.type === "section") {
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{item.title}</Text>
              </View>
            );
          }

          const entry = item.item;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.pillRow}>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{entry.resultType}</Text>
                  </View>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>
                      {entry.variableQuantity} vars
                    </Text>
                  </View>
                </View>
                <Text style={styles.dateText}>
                  {formatDate(entry.createdAt)}
                </Text>
              </View>

              <Text style={styles.resultLabel}>Resultado</Text>
              <Text numberOfLines={2} style={styles.resultText}>
                {entry.result}
              </Text>

              <View style={styles.actionsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    entry.isFavorite && styles.favoriteButtonActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleToggleFavorite(entry)}
                >
                  <MaterialIcons
                    name={entry.isFavorite ? "star" : "star-border"}
                    size={18}
                    color={entry.isFavorite ? "#FFFFFF" : DUO.ink}
                  />
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.useButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleUseExercise(entry)}
                >
                  <MaterialIcons name="play-arrow" size={18} color="#fff" />
                  <Text style={styles.useButtonText}>Usar</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleDelete(entry)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    color={DUO.ink}
                  />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons
              name={hasActiveFilters ? "filter-alt-off" : "history"}
              size={44}
              color={DUO.muted}
            />
            <Text style={styles.emptyTitle}>
              {hasActiveFilters
                ? "Sin coincidencias"
                : "Sin ejercicios guardados"}
            </Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? "Ajusta los filtros o limpia la búsqueda para ver más resultados."
                : "Resuelve mapas y abre circuito para guardar tu progreso aquí."}
            </Text>
          </View>
        }
      />

      {!adsSuppressed && <MyBannerAd />}
    </SafeAreaView>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterChip = ({ label, active, onPress }: FilterChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        active && styles.filterChipActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DUO.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
  },
  badge: {
    color: DUO.blueDark,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1,
  },
  title: {
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 27,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: DUO.orange,
    borderBottomWidth: 3,
    borderBottomColor: DUO.orangeDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
  filtersSection: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  searchRow: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: DUO.ink,
    fontWeight: "600",
    fontSize: 14,
    paddingVertical: 8,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DUO.border,
    backgroundColor: DUO.card,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: DUO.green,
    borderColor: DUO.green,
  },
  filterChipText: {
    color: DUO.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    color: DUO.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 160,
    gap: 10,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: DUO.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DUO.border,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillRow: {
    flexDirection: "row",
    gap: 6,
  },
  pill: {
    backgroundColor: DUO.greenSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    color: "#3A7F1A",
    fontWeight: "800",
    fontSize: 11,
  },
  dateText: {
    color: DUO.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  resultLabel: {
    color: DUO.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "800",
  },
  resultText: {
    color: DUO.ink,
    fontWeight: "800",
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  useButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: DUO.green,
    borderBottomWidth: 3,
    borderBottomColor: DUO.greenDark,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  useButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  favoriteButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DUO.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.card,
  },
  favoriteButtonActive: {
    backgroundColor: DUO.yellow,
    borderColor: DUO.yellow,
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DUO.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DUO.card,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 28,
  },
  emptyTitle: {
    marginTop: 10,
    color: DUO.ink,
    fontWeight: "900",
    fontSize: 19,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 6,
    color: DUO.muted,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
