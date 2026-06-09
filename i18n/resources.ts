export const resources = {
  es: {
    translation: {
      common: {
        languages: {
          es: "Español",
          en: "Inglés",
        },
        languageSelector: {
          accessibilityLabel: "Cambiar idioma. Idioma actual: {{language}}",
          accessibilityHint: "Cambia entre español e inglés",
        },
      },
      navigation: {
        appTitle: "K-Maps",
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
        },
        languageSelector: {
          accessibilityLabel: "Change language. Current language: {{language}}",
          accessibilityHint: "Switches between Spanish and English",
        },
      },
      navigation: {
        appTitle: "K-Maps",
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
} as const;

export type AppLanguage = keyof typeof resources;

export const supportedLanguages = Object.keys(resources) as AppLanguage[];
