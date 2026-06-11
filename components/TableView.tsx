import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { buildGroupColorsByMinterm } from "@/utils/groupColorLookup";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Cell, Row, Table, TableWrapper } from "react-native-table-component";
import { useTranslation } from "react-i18next";
import { TableBox } from "./TableBox";

const decimalToBinary = (decimal: number, length: number) => {
  return decimal.toString(2).padStart(length, "0");
};

const TableView = () => {
  const { t } = useTranslation();
  const { variableQuantity, variableRotation, boxColors, variables } =
    useStore();

  const header = [
    "#",
    variables.join(""),
    t("table.result"),
    t("table.groups"),
  ];
  const columnWidths = useMemo(
    () => [56, Math.max(110, 70 + variableQuantity * 16), 116, 108],
    [variableQuantity],
  );

  const tableData = useMemo(() => {
    const rows = [];
    for (let i = 0; i < Math.pow(2, variableQuantity); i++) {
      rows.push([i, decimalToBinary(i, variableQuantity), "", ""]);
    }
    return rows;
  }, [variableQuantity]);

  const groupColorsByMinterm = useMemo(
    () =>
      buildGroupColorsByMinterm({
        variableQuantity,
        variableRotation,
        boxColors,
      }),
    [variableQuantity, variableRotation, boxColors],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.containerTable}>
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={header}
            widthArr={columnWidths}
            style={styles.head}
            textStyle={styles.headText}
          />

          {tableData.map((rowData, index) => (
            <TableWrapper
              key={index}
              style={[
                styles.row,
                index % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}
            >
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 2 ? (
                      <TableBox index={index} />
                    ) : cellIndex === 3 ? (
                      <View style={styles.groupDots}>
                        {(groupColorsByMinterm.get(index) ?? []).map(
                          (color) => (
                            <View
                              key={`${index}-${color}`}
                              style={[
                                styles.groupDot,
                                { backgroundColor: color },
                              ]}
                            />
                          ),
                        )}
                      </View>
                    ) : (
                      cellData
                    )
                  }
                  style={[styles.cell, { width: columnWidths[cellIndex] }]}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  containerTable: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: DUO.card,
    borderWidth: 1,
    borderColor: DUO.border,
    borderRadius: 16,
    minWidth: 300,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: DUO.border,
  },
  head: {
    height: 42,
    backgroundColor: DUO.green,
  },
  headText: {
    color: DUO.white,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    minHeight: 40,
  },
  cell: {
    justifyContent: "center",
  },
  evenRow: {
    backgroundColor: DUO.card,
  },
  oddRow: {
    backgroundColor: DUO.bg,
  },
  text: {
    margin: 6,
    textAlign: "center",
    color: DUO.tableText,
    fontSize: 14,
    fontWeight: "600",
  },
  groupDots: {
    minHeight: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingVertical: 4,
  },
  groupDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DUO.tableTextStrong,
  },
});

export default TableView;
