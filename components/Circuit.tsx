import useStore from "@/app/store";
import { DUO } from "@/constants/duoTheme";
import { generateCircuitHTML } from "@/utils/pdfGenerator";
import { memo, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

//TODO: Refactor this component

interface CircuitComponentProps {
  bottomPadding?: number;
  enableZoom?: boolean;
}

export const CircuitComponent = memo(
  ({ bottomPadding = 120, enableZoom = false }: CircuitComponentProps) => {
    const { resultType, variableQuantity, circuitVector, variables } = useStore();

    const htmlContent = useMemo(() => {
      const circuit = generateCircuitHTML({
        resultType,
        variableQuantity,
        circuitVector,
        variables,
      });

      return `
      <!doctype html>
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=${
              enableZoom ? "5.0" : "1.0"
            }, minimum-scale=0.5, user-scalable=${enableZoom ? "yes" : "no"}"
          />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              background: ${DUO.card};
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          ${circuit}
        </body>
      </html>
    `;
    }, [resultType, variableQuantity, circuitVector, variables, enableZoom]);

    const estimatedHeight = useMemo(() => {
      if (circuitVector.length === 0) {
        return 220;
      }
      if (
        circuitVector.length === 1 &&
        (circuitVector[0] === "0" || circuitVector[0] === "1")
      ) {
        return 220;
      }
      return Math.max(280, 120 + circuitVector.length * 170);
    }, [circuitVector]);

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.circuitContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={[styles.webview, { height: estimatedHeight }]}
            scrollEnabled={enableZoom}
            javaScriptEnabled={false}
            builtInZoomControls={enableZoom}
            setDisplayZoomControls={false}
            scalesPageToFit={!enableZoom}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  circuitContainer: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: DUO.card,
  },
  webview: {
    width: "100%",
    backgroundColor: DUO.card,
  },
});
