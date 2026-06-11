export const itTranslation = {
  common: {
    languages: {
      es: "Spagnolo",
      en: "Inglese",
      pt: "Portoghese",
      fr: "Francese",
      de: "Tedesco",
      it: "Italiano",
      ja: "Giapponese",
      ko: "Coreano",
      "zh-CN": "Cinese semplificato",
      "zh-TW": "Cinese tradizionale",
    },
    languageSelector: {
      accessibilityLabel: "Cambia lingua. Lingua attuale: {{language}}",
      accessibilityHint: "Apre l’elenco delle lingue disponibili",
      title: "Seleziona lingua",
      close: "Chiudi il selettore della lingua",
    },
    accessibility: {
      mapCell: "Cella {{index}}, valore {{value}}",
      tableCell: "Risultato della riga {{index}}, valore {{value}}",
    },
  },
  navigation: { appTitle: "K-Maps" },
  notFound: {
    title: "Ops",
    message: "Questa schermata non esiste.",
    hint: "Torna indietro per continuare.",
  },
  table: { result: "Risultato", groups: "Gruppi" },
  grid: {
    title: "Karnaugh",
    accessibility: {
      history: "Apri cronologia",
      variableInput: "Nome della variabile {{number}}",
      copyResult: "Copia risultato",
      openCircuit: "Apri circuito",
    },
    controls: {
      variables: "Variabili",
      variableCount: "{{count}} variabili",
      type: "Tipo",
      view: "Vista",
      map: "Mappa",
      table: "Tabella",
      rotateVariables: "Ruota variabili",
      fillWith: "Riempi con",
      variableNames: "Nomi delle variabili",
    },
    groups: {
      title: "Focus per gruppo",
      all: "Tutti",
      label: "G{{number}}: {{expression}}",
    },
    result: {
      title: "Risultato",
      empty: "Seleziona i valori per generare l’espressione",
      copyHint: "Tocca per copiare",
      copied: "Copiato",
      circuit: "Circuito",
    },
    review: {
      unavailableTitle: "Valuta l’app",
      unavailableMessage:
        "Impossibile aprire la valutazione ora. Riprova più tardi.",
    },
    engagement: {
      title: "Ti piace l’app?",
      body: "Se ti aiuta a studiare, puoi sostenere il progetto.",
      buyPro: "Acquista la versione PRO",
      rateApp: "Valuta l’app",
      later: "Più tardi",
    },
  },
  steps: {
    button: "Passo dopo passo",
    title: "Gruppo {{current}} di {{total}}",
    finalTitle: "Espressione finale",
    covered_one: "Copre 1 cella con valore {{target}}.",
    covered_other: "Copre {{count}} celle con valore {{target}}.",
    covered_many: "Copre {{count}} celle con valore {{target}}.",
    eliminated:
      "{{variables}} cambiano all'interno del gruppo e vengono eliminate.",
    eliminatedNone: "Tutte le variabili restano costanti in questo gruppo.",
    termIntro: "Le variabili costanti formano il termine:",
    finalBody: "Tutti i termini si combinano nell'espressione minimizzata:",
    next: "Avanti",
    back: "Indietro",
    done: "Fatto",
    exit: "Esci dalla modalità passo dopo passo",
  },
  share: {
    accessibilityShare: "Condividi esercizio",
    accessibilityImport: "Importa esercizio",
    shareTitle: "Mappa di Karnaugh",
    shareMessage:
      "Prova a risolvere questo esercizio di mappa di Karnaugh:\n{{url}}",
    shareErrorTitle: "Errore",
    shareErrorMessage: "Impossibile creare il link di condivisione.",
    importTitle: "Importa esercizio",
    importBody: "Incolla il link o il codice condiviso per caricare la mappa.",
    importPlaceholder: "Link o codice",
    importAction: "Carica esercizio",
    cancel: "Annulla",
    importedTitle: "Esercizio importato",
    importedMessage: "La mappa condivisa è stata caricata correttamente.",
    invalidTitle: "Codice non valido",
    invalidMessage:
      "Impossibile importare. Controlla che il link o il codice sia completo.",
  },
  result: {
    badge: "USCITA LOGICA",
    title: "Circuito",
    type: "Tipo: {{type}}",
    variables: "Variabili: {{count}}",
    minimumResult: "Risultato minimo",
    circuitDiagram: "Schema del circuito",
    fullscreen: "Visualizza a schermo intero",
    close: "Chiudi",
    circuit: {
      standard: "Standard",
      nandOnly: "Solo NAND",
      norOnly: "Solo NOR",
      nandNote: "Circuito equivalente costruito solo con porte NAND.",
      norNote: "Circuito equivalente costruito solo con porte NOR.",
      tapHint: "Tocca un termine per evidenziare il suo gruppo sulla mappa.",
      zoomHint: "Pizzica per ingrandire · tocca due volte per reimpostare",
      compact: "Compatto",
      stats: "Porte: {{gates}} · Ingressi: {{inputs}} · Livelli: {{levels}}",
      mux: "MUX",
      decoder: "Decoder",
      muxNote:
        "Realizzato con un multiplexer {{size}}:1 — {{variable}} alimenta gli ingressi dati.",
      decoderNote:
        "Realizzato con un decoder da {{inputs}} a {{outputs}}; la porta OR combina i mintermini richiesti.",
    },
    accessibility: {
      fullscreen: "Apri il circuito a schermo intero",
      closeFullscreen: "Chiudi il circuito a schermo intero",
    },
    circuitPdf: {
      button: "Scarica il circuito in PDF",
      generating: "Generazione PDF...",
      successTitle: "PDF generato",
      successMessage: "Il circuito è stato generato correttamente.",
      shareHint:
        "\nPuoi condividerlo o salvarlo dalla finestra di sistema.",
      errorTitle: "Errore",
      errorMessage:
        "Si è verificato un problema durante la generazione del PDF. Riprova.",
    },
    sessionPdf: {
      button: "Esporta sessione completa",
      generating: "Esportazione sessione...",
      showingAd: "Visualizzazione annuncio...",
      successTitle: "PDF della sessione generato",
      successMessage: "La sessione completa è stata esportata.",
      shareHint:
        "\nPuoi condividerlo o salvarlo dalla finestra di sistema.",
      errorTitle: "Errore",
      errorMessage:
        "Impossibile esportare la sessione completa in PDF. Riprova.",
    },
    comparison: {
      title: "Confronto di minimizzazione",
      exactMethod: "Quine-McCluskey",
      heuristicMethod: "Euristica (stile Espresso)",
      validation:
        "Convalidato con una tabella di verità per le celle definite (i valori X vengono ignorati).",
      equivalent: "Il tuo risultato è equivalente",
      different: "Il tuo risultato differisce dalla soluzione esatta",
      equivalentSolutions:
        "Esistono {{count}} soluzioni minime equivalenti.",
      uniqueSolution: "È stata trovata un’unica soluzione minima.",
      heuristicOptimal: "Euristica ottimale",
      heuristicNotOptimal: "Euristica non ottimale",
      heuristicHelp:
        "Ottimale: l’euristica ha trovato una forma minima. Non ottimale: l’espressione funziona, ma può essere ulteriormente semplificata.",
      showEquivalent: "Mostra soluzioni equivalenti",
      hideEquivalent: "Nascondi soluzioni equivalenti",
      accessibility: {
        heuristicHelp: "Mostra la spiegazione dell’euristica",
      },
    },
  },
  history: {
    badge: "PROGRESSI",
    title: "Cronologia",
    clear: "Cancella",
    searchPlaceholder: "Cerca per risultato",
    filters: {
      favorites: "Preferiti",
      all: "Tutto",
      anyVariables: "Qualsiasi variabile",
    },
    sections: { favorites: "⭐ Preferiti", history: "Cronologia" },
    variableCount: "{{count}} var.",
    result: "Risultato",
    use: "Usa",
    deleteDialog: {
      title: "Elimina esercizio",
      message: "Vuoi davvero eliminare questo esercizio dalla cronologia?",
      cancel: "Annulla",
      confirm: "Elimina",
    },
    clearDialog: {
      title: "Cancella cronologia",
      message: "Tutti gli esercizi salvati verranno eliminati.",
      cancel: "Annulla",
      confirm: "Cancella",
    },
    empty: {
      filteredTitle: "Nessun risultato",
      filteredMessage:
        "Modifica i filtri o cancella la ricerca per vedere più risultati.",
      title: "Nessun esercizio salvato",
      message:
        "Risolvi le mappe e apri il circuito per salvare qui i tuoi progressi.",
    },
    accessibility: {
      clearHistory: "Cancella tutta la cronologia",
      clearSearch: "Cancella ricerca",
      addFavorite: "Aggiungi esercizio ai preferiti",
      removeFavorite: "Rimuovi esercizio dai preferiti",
      useExercise: "Usa questo esercizio",
      deleteExercise: "Elimina questo esercizio",
    },
  },
  pro: {
    activeTitle: "PRO attivato",
    title: "Versione PRO",
    activeSubtitle: "Grazie per sostenere l’app.",
    subtitle:
      "Sblocca un’esperienza mirata e risolvi gli esercizi più rapidamente.",
    benefits: "Vantaggi",
    features: {
      noAds: "Nessuna pubblicità",
      uninterrupted: "Studio senza interruzioni",
      support: "Supporto allo sviluppo continuo",
      oneTime: "Acquisto una tantum, nessun abbonamento",
    },
    specialPrice: "Prezzo speciale",
    priceNote: "Pagamento unico • Nessun rinnovo automatico",
    buy: "Acquista la versione PRO",
    restore: "Ripristina acquisti",
    back: "Indietro",
    later: "Forse più tardi",
    accessibility: {
      open: "Apri informazioni sulla versione PRO",
      active: "Versione PRO attivata",
    },
    alerts: {
      notConfiguredTitle: "Acquisti non configurati",
      purchaseNotConfigured:
        "react-native-iap deve essere installato o configurato per gli acquisti reali.",
      restoreNotConfigured:
        "react-native-iap deve essere installato o configurato per ripristinare gli acquisti.",
      incompleteTitle: "Acquisto non completato",
      incompleteMessage: "Non è stato rilevato alcun acquisto valido.",
      thanksTitle: "Grazie!",
      thanksMessage: "Hai acquistato la versione PRO.",
      purchaseErrorTitle: "Errore",
      purchaseErrorMessage: "Impossibile completare l’acquisto.",
      notFoundTitle: "Nessun acquisto trovato",
      notFoundMessage:
        "Non è stato trovato alcun acquisto PRO per questo account.",
      restoredTitle: "Ripristinato",
      restoredMessage: "Il tuo acquisto PRO è stato ripristinato correttamente.",
      restoreErrorTitle: "Errore",
      restoreErrorMessage: "Impossibile ripristinare gli acquisti.",
    },
  },
  pdf: {
    common: {
      variables: "Variabili",
      type: "Tipo",
      result: "Risultato",
      groups: "Gruppi",
      circuit: "Circuito",
      expression: "Espressione",
      generatedAt: "Generato il",
      productOfSums: "Prodotto di somme (POS)",
      sumOfProducts: "Somma di prodotti (SOP)",
      unavailableCircuit: "Impossibile generare il circuito.",
      sharingUnavailable:
        "La condivisione non è disponibile su questo dispositivo",
    },
    session: {
      documentTitle: "Sessione completa - Mappe di Karnaugh",
      finalExpression: "Espressione finale",
      coloredMap: "Mappa di Karnaugh colorata",
      truthTable: "Tabella di verità",
      comparison: "Confronto di minimizzazione",
      heuristic: "Euristica (stile Espresso)",
      equivalent: "Il tuo risultato è equivalente alla soluzione esatta.",
      different: "Il tuo risultato differisce dalla soluzione esatta.",
      equivalentSolutions:
        "Esistono {{count}} soluzioni minime equivalenti.",
      uniqueSolution: "È stata trovata un’unica soluzione minima.",
      groupDetail: "Dettagli del gruppo G{{number}}",
      term: "Termine",
      cells: "Celle",
      shareTitle: "Esporta sessione completa",
    },
    circuit: {
      documentTitle: "Circuito logico - Mappe di Karnaugh",
      heading: "Circuito logico",
      generatedAutomatically:
        "Mappe di Karnaugh - Generato automaticamente",
      shareTitle: "Scarica il circuito in PDF",
    },
  },
  onboarding: {
    badge: "BENVENUTO",
    skip: "Salta",
    title: "Inizia in 3 passaggi",
    next: "Avanti",
    start: "Inizia",
    slides: {
      sopPos: {
        title: "SOP vs POS",
        description:
          "SOP minimizza usando gli 1. POS minimizza usando gli 0. Cambia il tipo in alto in base al formato richiesto.",
      },
      values: {
        title: "Cambia 0 / 1 / X",
        description:
          "Tocca ogni cella per alternare 0 → 1 → X. Usa i pulsanti rapidi per riempire l’intera mappa.",
      },
      circuit: {
        title: "Leggi il circuito",
        description:
          "Il risultato si aggiorna in basso. Tocca Circuito per vedere le porte ed esportare lo schema in PDF.",
      },
    },
  },
} as const;
