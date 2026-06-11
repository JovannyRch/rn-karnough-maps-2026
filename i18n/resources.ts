import { deTranslation } from "./locales/de";
import { frTranslation } from "./locales/fr";
import { itTranslation } from "./locales/it";
import { jaTranslation } from "./locales/ja";
import { koTranslation } from "./locales/ko";
import { ptTranslation } from "./locales/pt";
import { zhCNTranslation } from "./locales/zh-CN";
import { zhTWTranslation } from "./locales/zh-TW";

export const resources = {
  es: {
    translation: {
      common: {
        languages: {
          es: "Español",
          en: "Inglés",
          pt: "Portugués",
          fr: "Francés",
          de: "Alemán",
          it: "Italiano",
          ja: "Japonés",
          ko: "Coreano",
          "zh-CN": "Chino simplificado",
          "zh-TW": "Chino tradicional",
        },
        languageSelector: {
          accessibilityLabel: "Cambiar idioma. Idioma actual: {{language}}",
          accessibilityHint: "Abre la lista de idiomas disponibles",
          title: "Seleccionar idioma",
          close: "Cerrar selector de idioma",
        },
        accessibility: {
          mapCell: "Celda {{index}}, valor {{value}}",
          tableCell: "Resultado de la fila {{index}}, valor {{value}}",
        },
      },
      navigation: {
        appTitle: "K-Maps",
      },
      notFound: {
        title: "Oops",
        message: "Esta pantalla no existe.",
        hint: "Vuelve atrás para continuar.",
      },
      table: {
        result: "Resultado",
        groups: "Grupos",
      },
      grid: {
        title: "Karnaugh",
        accessibility: {
          history: "Abrir historial",
          variableInput: "Nombre de la variable {{number}}",
          copyResult: "Copiar resultado",
          openCircuit: "Abrir circuito",
        },
        controls: {
          variables: "Variables",
          variableCount: "{{count}} variables",
          type: "Tipo",
          view: "Vista",
          map: "Mapa",
          table: "Tabla",
          rotateVariables: "Rotar variables",
          fillWith: "Llenar con",
          variableNames: "Nombres de variables",
        },
        groups: {
          title: "Foco por grupo",
          all: "Todos",
          label: "G{{number}}: {{expression}}",
        },
        result: {
          title: "Resultado",
          empty: "Selecciona valores para obtener la expresión",
          copyHint: "Toca para copiar",
          copied: "Copiado",
          circuit: "Circuito",
        },
        review: {
          unavailableTitle: "Calificar app",
          unavailableMessage:
            "Ahora no fue posible abrir la reseña. Puedes intentarlo más tarde.",
        },
        engagement: {
          title: "¿Te está gustando la app?",
          body: "Si te ayuda a estudiar, puedes apoyar el proyecto.",
          buyPro: "Comprar versión PRO",
          rateApp: "Calificar app",
          later: "Más tarde",
        },
      },
      steps: {
        button: "Paso a paso",
        title: "Grupo {{current}} de {{total}}",
        finalTitle: "Expresión final",
        covered_one: "Cubre 1 celda con valor {{target}}.",
        covered_other: "Cubre {{count}} celdas con valor {{target}}.",
        covered_many: "Cubre {{count}} celdas con valor {{target}}.",
        eliminated: "{{variables}} cambian dentro del grupo y se eliminan.",
        eliminatedNone:
          "Todas las variables permanecen constantes en este grupo.",
        termIntro: "Las variables constantes forman el término:",
        finalBody: "Todos los términos se combinan en la expresión minimizada:",
        next: "Siguiente",
        back: "Atrás",
        done: "Listo",
        exit: "Salir del paso a paso",
      },
      share: {
        accessibilityShare: "Compartir ejercicio",
        accessibilityImport: "Importar ejercicio",
        shareTitle: "Mapa de Karnaugh",
        shareMessage: "Resuelve este ejercicio de mapas de Karnaugh:\n{{url}}",
        shareErrorTitle: "Error",
        shareErrorMessage: "No se pudo generar el enlace para compartir.",
        importTitle: "Importar ejercicio",
        importBody: "Pega el enlace o código compartido para cargar el mapa.",
        importPlaceholder: "Enlace o código",
        importAction: "Cargar ejercicio",
        cancel: "Cancelar",
        importedTitle: "Ejercicio importado",
        importedMessage: "Se cargó correctamente el mapa compartido.",
        invalidTitle: "Código inválido",
        invalidMessage:
          "No se pudo importar. Revisa que el enlace o código esté completo.",
      },
      result: {
        badge: "SALIDA LÓGICA",
        title: "Circuito",
        type: "Tipo: {{type}}",
        variables: "Variables: {{count}}",
        minimumResult: "Resultado mínimo",
        circuitDiagram: "Diagrama del circuito",
        fullscreen: "Ver en pantalla completa",
        close: "Cerrar",
        circuit: {
          standard: "Estándar",
          nandOnly: "Solo NAND",
          norOnly: "Solo NOR",
          nandNote:
            "Circuito equivalente construido solo con compuertas NAND.",
          norNote: "Circuito equivalente construido solo con compuertas NOR.",
          tapHint: "Toca un término para resaltar su grupo en el mapa.",
          zoomHint:
            "Pellizca para hacer zoom · toca dos veces para restablecer",
          compact: "Compacto",
          stats:
            "Compuertas: {{gates}} · Entradas: {{inputs}} · Niveles: {{levels}}",
          mux: "MUX",
          decoder: "Decodificador",
          muxNote:
            "Implementado con un multiplexor {{size}}:1 — {{variable}} alimenta las entradas de datos.",
          decoderNote:
            "Implementado con un decodificador {{inputs}} a {{outputs}}; la compuerta OR combina los minitérminos requeridos.",
        },
        accessibility: {
          fullscreen: "Abrir el circuito en pantalla completa",
          closeFullscreen: "Cerrar el circuito en pantalla completa",
        },
        circuitPdf: {
          button: "Descargar circuito en PDF",
          generating: "Generando PDF...",
          successTitle: "PDF generado",
          successMessage: "El circuito fue generado correctamente.",
          shareHint:
            "\nPuedes compartirlo o guardarlo desde el diálogo del sistema.",
          errorTitle: "Error",
          errorMessage:
            "Hubo un problema al generar el PDF. Por favor, inténtalo de nuevo.",
        },
        sessionPdf: {
          button: "Exportar sesión completa",
          generating: "Exportando sesión...",
          showingAd: "Mostrando anuncio...",
          successTitle: "PDF de sesión generado",
          successMessage: "Se exportó la sesión completa.",
          shareHint:
            "\nPuedes compartirlo o guardarlo desde el diálogo del sistema.",
          errorTitle: "Error",
          errorMessage:
            "No fue posible exportar la sesión completa en PDF. Inténtalo de nuevo.",
        },
        comparison: {
          title: "Comparador de minimización",
          exactMethod: "Quine-McCluskey",
          heuristicMethod: "Heurístico (tipo Espresso)",
          validation:
            "Validado por tabla de verdad en celdas definidas (se ignoran X).",
          equivalent: "Tu resultado es equivalente",
          different: "Tu resultado difiere del exacto",
          equivalentSolutions:
            "Hay {{count}} soluciones mínimas equivalentes.",
          uniqueSolution: "Se encontró una solución mínima única.",
          heuristicOptimal: "Heurística óptima",
          heuristicNotOptimal: "Heurística no óptima",
          heuristicHelp:
            "Óptima: la heurística encontró una forma mínima. No óptima: la expresión funciona, pero puede simplificarse más.",
          showEquivalent: "Ver soluciones equivalentes",
          hideEquivalent: "Ocultar soluciones equivalentes",
          accessibility: {
            heuristicHelp: "Mostrar explicación de la heurística",
          },
        },
      },
      history: {
        badge: "PROGRESO",
        title: "Historial",
        clear: "Limpiar",
        searchPlaceholder: "Buscar por resultado",
        filters: {
          favorites: "Favoritos",
          all: "Todo",
          anyVariables: "Cualquier var",
        },
        sections: {
          favorites: "⭐ Favoritos",
          history: "Historial",
        },
        variableCount: "{{count}} vars",
        result: "Resultado",
        use: "Usar",
        deleteDialog: {
          title: "Eliminar ejercicio",
          message: "¿Seguro que quieres borrar este ejercicio del historial?",
          cancel: "Cancelar",
          confirm: "Eliminar",
        },
        clearDialog: {
          title: "Limpiar historial",
          message: "Se eliminarán todos los ejercicios guardados.",
          cancel: "Cancelar",
          confirm: "Limpiar",
        },
        empty: {
          filteredTitle: "Sin coincidencias",
          filteredMessage:
            "Ajusta los filtros o limpia la búsqueda para ver más resultados.",
          title: "Sin ejercicios guardados",
          message:
            "Resuelve mapas y abre circuito para guardar tu progreso aquí.",
        },
        accessibility: {
          clearHistory: "Limpiar todo el historial",
          clearSearch: "Limpiar búsqueda",
          addFavorite: "Agregar ejercicio a favoritos",
          removeFavorite: "Quitar ejercicio de favoritos",
          useExercise: "Usar este ejercicio",
          deleteExercise: "Eliminar este ejercicio",
        },
      },
      pro: {
        activeTitle: "PRO activado",
        title: "Versión PRO",
        activeSubtitle: "Gracias por apoyar la app.",
        subtitle:
          "Desbloquea una experiencia enfocada en resolver más rápido.",
        benefits: "Beneficios",
        features: {
          noAds: "Sin anuncios publicitarios",
          uninterrupted: "Flujo de estudio sin interrupciones",
          support: "Apoyo al desarrollo continuo",
          oneTime: "Compra única, sin suscripción",
        },
        specialPrice: "Precio especial",
        priceNote: "Pago único • Sin renovación automática",
        buy: "Comprar versión PRO",
        restore: "Restaurar compras",
        back: "Volver",
        later: "Tal vez después",
        accessibility: {
          open: "Abrir información de la versión PRO",
          active: "Versión PRO activada",
        },
        alerts: {
          notConfiguredTitle: "Compras no configuradas",
          purchaseNotConfigured:
            "Falta instalar o configurar react-native-iap para compras reales.",
          restoreNotConfigured:
            "Falta instalar o configurar react-native-iap para restaurar compras.",
          incompleteTitle: "Compra no completada",
          incompleteMessage: "No se detectó una compra válida.",
          thanksTitle: "¡Gracias!",
          thanksMessage: "Has adquirido la versión PRO.",
          purchaseErrorTitle: "Error",
          purchaseErrorMessage: "No fue posible completar la compra.",
          notFoundTitle: "Sin compras encontradas",
          notFoundMessage:
            "No se encontró una compra PRO para esta cuenta.",
          restoredTitle: "Restaurado",
          restoredMessage: "Tu compra PRO fue restaurada correctamente.",
          restoreErrorTitle: "Error",
          restoreErrorMessage: "No fue posible restaurar compras.",
        },
      },
      pdf: {
        common: {
          variables: "Variables",
          type: "Tipo",
          result: "Resultado",
          groups: "Grupos",
          circuit: "Circuito",
          expression: "Expresión",
          generatedAt: "Fecha de generación",
          productOfSums: "Producto de Sumas (POS)",
          sumOfProducts: "Suma de Productos (SOP)",
          unavailableCircuit: "No se pudo generar el circuito.",
          sharingUnavailable:
            "Compartir no está disponible en este dispositivo",
        },
        session: {
          documentTitle: "Sesión completa - Mapas de Karnaugh",
          finalExpression: "Expresión final",
          coloredMap: "Mapa de Karnaugh coloreado",
          truthTable: "Tabla de verdad",
          comparison: "Comparador de minimización",
          heuristic: "Heurístico (tipo Espresso)",
          equivalent: "Tu resultado es equivalente al exacto.",
          different: "Tu resultado difiere del exacto.",
          equivalentSolutions:
            "Hay {{count}} soluciones mínimas equivalentes.",
          uniqueSolution: "Se encontró una solución mínima única.",
          groupDetail: "Detalle de grupo G{{number}}",
          term: "Término",
          cells: "Celdas",
          shareTitle: "Exportar sesión completa",
        },
        circuit: {
          documentTitle: "Circuito lógico - Mapas de Karnaugh",
          heading: "Circuito lógico",
          generatedAutomatically:
            "Mapas de Karnaugh - Generado automáticamente",
          shareTitle: "Descargar circuito PDF",
        },
      },
      onboarding: {
        badge: "BIENVENIDO",
        skip: "Saltar",
        title: "Empieza en 3 pasos",
        next: "Siguiente",
        start: "Comenzar",
        slides: {
          sopPos: {
            title: "SOP vs POS",
            description:
              "SOP minimiza con 1s. POS minimiza con 0s. Cambia el tipo arriba para resolver en el formato que te pidan.",
          },
          values: {
            title: "Cambiar 0 / 1 / X",
            description:
              "Toca cada celda para alternar 0 → 1 → X. Usa chips rápidos para llenar todo el mapa en un solo toque.",
          },
          circuit: {
            title: "Leer el circuito",
            description:
              "El resultado se actualiza abajo. Toca Circuito para ver compuertas y exportar PDF del diagrama.",
          },
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        languages: {
          es: "Spanish",
          en: "English",
          pt: "Portuguese",
          fr: "French",
          de: "German",
          it: "Italian",
          ja: "Japanese",
          ko: "Korean",
          "zh-CN": "Simplified Chinese",
          "zh-TW": "Traditional Chinese",
        },
        languageSelector: {
          accessibilityLabel: "Change language. Current language: {{language}}",
          accessibilityHint: "Opens the list of available languages",
          title: "Select language",
          close: "Close language selector",
        },
        accessibility: {
          mapCell: "Cell {{index}}, value {{value}}",
          tableCell: "Result for row {{index}}, value {{value}}",
        },
      },
      navigation: {
        appTitle: "K-Maps",
      },
      notFound: {
        title: "Oops",
        message: "This screen does not exist.",
        hint: "Go back to continue.",
      },
      table: {
        result: "Result",
        groups: "Groups",
      },
      grid: {
        title: "Karnaugh",
        accessibility: {
          history: "Open history",
          variableInput: "Name of variable {{number}}",
          copyResult: "Copy result",
          openCircuit: "Open circuit",
        },
        controls: {
          variables: "Variables",
          variableCount: "{{count}} variables",
          type: "Type",
          view: "View",
          map: "Map",
          table: "Table",
          rotateVariables: "Rotate variables",
          fillWith: "Fill with",
          variableNames: "Variable names",
        },
        groups: {
          title: "Focus by group",
          all: "All",
          label: "G{{number}}: {{expression}}",
        },
        result: {
          title: "Result",
          empty: "Select values to generate the expression",
          copyHint: "Tap to copy",
          copied: "Copied",
          circuit: "Circuit",
        },
        review: {
          unavailableTitle: "Rate app",
          unavailableMessage:
            "The review prompt could not be opened right now. Please try again later.",
        },
        engagement: {
          title: "Are you enjoying the app?",
          body: "If it helps you study, you can support the project.",
          buyPro: "Buy PRO version",
          rateApp: "Rate app",
          later: "Later",
        },
      },
      steps: {
        button: "Step by step",
        title: "Group {{current}} of {{total}}",
        finalTitle: "Final expression",
        covered_one: "Covers 1 cell with value {{target}}.",
        covered_other: "Covers {{count}} cells with value {{target}}.",
        eliminated: "{{variables}} change inside the group and drop out.",
        eliminatedNone: "Every variable stays constant in this group.",
        termIntro: "The constant variables form the term:",
        finalBody: "All terms combine into the minimized expression:",
        next: "Next",
        back: "Back",
        done: "Done",
        exit: "Exit step-by-step mode",
      },
      share: {
        accessibilityShare: "Share exercise",
        accessibilityImport: "Import exercise",
        shareTitle: "Karnaugh map",
        shareMessage: "Try solving this Karnaugh map exercise:\n{{url}}",
        shareErrorTitle: "Error",
        shareErrorMessage: "The share link could not be created.",
        importTitle: "Import exercise",
        importBody: "Paste a shared link or code to load the map.",
        importPlaceholder: "Link or code",
        importAction: "Load exercise",
        cancel: "Cancel",
        importedTitle: "Exercise imported",
        importedMessage: "The shared map was loaded successfully.",
        invalidTitle: "Invalid code",
        invalidMessage:
          "Could not import it. Check that the link or code is complete.",
      },
      result: {
        badge: "LOGIC OUTPUT",
        title: "Circuit",
        type: "Type: {{type}}",
        variables: "Variables: {{count}}",
        minimumResult: "Minimum result",
        circuitDiagram: "Circuit diagram",
        fullscreen: "View fullscreen",
        close: "Close",
        circuit: {
          standard: "Standard",
          nandOnly: "NAND only",
          norOnly: "NOR only",
          nandNote: "Equivalent circuit built only with NAND gates.",
          norNote: "Equivalent circuit built only with NOR gates.",
          tapHint: "Tap a term to highlight its group on the map.",
          zoomHint: "Pinch to zoom · double-tap to reset",
          compact: "Compact",
          stats: "Gates: {{gates}} · Inputs: {{inputs}} · Levels: {{levels}}",
          mux: "MUX",
          decoder: "Decoder",
          muxNote:
            "Implemented with a {{size}}:1 multiplexer — {{variable}} drives the data inputs.",
          decoderNote:
            "Implemented with a {{inputs}}-to-{{outputs}} decoder; the OR gate combines the required minterms.",
        },
        accessibility: {
          fullscreen: "Open the circuit in fullscreen",
          closeFullscreen: "Close the fullscreen circuit",
        },
        circuitPdf: {
          button: "Download circuit PDF",
          generating: "Generating PDF...",
          successTitle: "PDF generated",
          successMessage: "The circuit was generated successfully.",
          shareHint:
            "\nYou can share or save it from the system dialog.",
          errorTitle: "Error",
          errorMessage:
            "There was a problem generating the PDF. Please try again.",
        },
        sessionPdf: {
          button: "Export full session",
          generating: "Exporting session...",
          showingAd: "Showing ad...",
          successTitle: "Session PDF generated",
          successMessage: "The full session was exported.",
          shareHint:
            "\nYou can share or save it from the system dialog.",
          errorTitle: "Error",
          errorMessage:
            "The full session could not be exported as a PDF. Please try again.",
        },
        comparison: {
          title: "Minimization comparison",
          exactMethod: "Quine-McCluskey",
          heuristicMethod: "Heuristic (Espresso-style)",
          validation:
            "Validated with a truth table for defined cells (X values are ignored).",
          equivalent: "Your result is equivalent",
          different: "Your result differs from the exact solution",
          equivalentSolutions:
            "There are {{count}} equivalent minimum solutions.",
          uniqueSolution: "A unique minimum solution was found.",
          heuristicOptimal: "Optimal heuristic",
          heuristicNotOptimal: "Non-optimal heuristic",
          heuristicHelp:
            "Optimal: the heuristic found a minimum form. Non-optimal: the expression works, but it can be simplified further.",
          showEquivalent: "View equivalent solutions",
          hideEquivalent: "Hide equivalent solutions",
          accessibility: {
            heuristicHelp: "Show heuristic explanation",
          },
        },
      },
      history: {
        badge: "PROGRESS",
        title: "History",
        clear: "Clear",
        searchPlaceholder: "Search by result",
        filters: {
          favorites: "Favorites",
          all: "All",
          anyVariables: "Any variables",
        },
        sections: {
          favorites: "⭐ Favorites",
          history: "History",
        },
        variableCount: "{{count}} vars",
        result: "Result",
        use: "Use",
        deleteDialog: {
          title: "Delete exercise",
          message:
            "Are you sure you want to delete this exercise from your history?",
          cancel: "Cancel",
          confirm: "Delete",
        },
        clearDialog: {
          title: "Clear history",
          message: "All saved exercises will be deleted.",
          cancel: "Cancel",
          confirm: "Clear",
        },
        empty: {
          filteredTitle: "No matches",
          filteredMessage:
            "Adjust the filters or clear the search to see more results.",
          title: "No saved exercises",
          message:
            "Solve maps and open the circuit to save your progress here.",
        },
        accessibility: {
          clearHistory: "Clear all history",
          clearSearch: "Clear search",
          addFavorite: "Add exercise to favorites",
          removeFavorite: "Remove exercise from favorites",
          useExercise: "Use this exercise",
          deleteExercise: "Delete this exercise",
        },
      },
      pro: {
        activeTitle: "PRO activated",
        title: "PRO version",
        activeSubtitle: "Thank you for supporting the app.",
        subtitle: "Unlock a focused experience and solve problems faster.",
        benefits: "Benefits",
        features: {
          noAds: "No advertisements",
          uninterrupted: "Uninterrupted study flow",
          support: "Support continued development",
          oneTime: "One-time purchase, no subscription",
        },
        specialPrice: "Special price",
        priceNote: "One-time payment • No automatic renewal",
        buy: "Buy PRO version",
        restore: "Restore purchases",
        back: "Back",
        later: "Maybe later",
        accessibility: {
          open: "Open PRO version information",
          active: "PRO version activated",
        },
        alerts: {
          notConfiguredTitle: "Purchases not configured",
          purchaseNotConfigured:
            "react-native-iap must be installed or configured for real purchases.",
          restoreNotConfigured:
            "react-native-iap must be installed or configured to restore purchases.",
          incompleteTitle: "Purchase not completed",
          incompleteMessage: "A valid purchase was not detected.",
          thanksTitle: "Thank you!",
          thanksMessage: "You have purchased the PRO version.",
          purchaseErrorTitle: "Error",
          purchaseErrorMessage: "The purchase could not be completed.",
          notFoundTitle: "No purchases found",
          notFoundMessage:
            "No PRO purchase was found for this account.",
          restoredTitle: "Restored",
          restoredMessage: "Your PRO purchase was restored successfully.",
          restoreErrorTitle: "Error",
          restoreErrorMessage: "Purchases could not be restored.",
        },
      },
      pdf: {
        common: {
          variables: "Variables",
          type: "Type",
          result: "Result",
          groups: "Groups",
          circuit: "Circuit",
          expression: "Expression",
          generatedAt: "Generated on",
          productOfSums: "Product of Sums (POS)",
          sumOfProducts: "Sum of Products (SOP)",
          unavailableCircuit: "The circuit could not be generated.",
          sharingUnavailable:
            "Sharing is not available on this device",
        },
        session: {
          documentTitle: "Full session - Karnaugh Maps",
          finalExpression: "Final expression",
          coloredMap: "Colored Karnaugh map",
          truthTable: "Truth table",
          comparison: "Minimization comparison",
          heuristic: "Heuristic (Espresso-style)",
          equivalent: "Your result is equivalent to the exact solution.",
          different: "Your result differs from the exact solution.",
          equivalentSolutions:
            "There are {{count}} equivalent minimum solutions.",
          uniqueSolution: "A unique minimum solution was found.",
          groupDetail: "Group G{{number}} detail",
          term: "Term",
          cells: "Cells",
          shareTitle: "Export full session",
        },
        circuit: {
          documentTitle: "Logic circuit - Karnaugh Maps",
          heading: "Logic circuit",
          generatedAutomatically:
            "Karnaugh Maps - Generated automatically",
          shareTitle: "Download circuit PDF",
        },
      },
      onboarding: {
        badge: "WELCOME",
        skip: "Skip",
        title: "Get started in 3 steps",
        next: "Next",
        start: "Start",
        slides: {
          sopPos: {
            title: "SOP vs POS",
            description:
              "SOP minimizes using 1s. POS minimizes using 0s. Change the type above to solve using the format you need.",
          },
          values: {
            title: "Change 0 / 1 / X",
            description:
              "Tap each cell to cycle through 0 → 1 → X. Use the quick chips to fill the entire map with one tap.",
          },
          circuit: {
            title: "Read the circuit",
            description:
              "The result updates below. Tap Circuit to view the gates and export the diagram as a PDF.",
          },
        },
      },
    },
  },
  pt: {
    translation: ptTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
  it: {
    translation: itTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  ko: {
    translation: koTranslation,
  },
  "zh-CN": {
    translation: zhCNTranslation,
  },
  "zh-TW": {
    translation: zhTWTranslation,
  },
} as const;

export type AppLanguage = keyof typeof resources;

export const supportedLanguages = Object.keys(resources) as AppLanguage[];
