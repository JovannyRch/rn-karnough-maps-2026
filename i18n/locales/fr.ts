export const frTranslation = {
  common: {
    languages: {
      es: "Espagnol",
      en: "Anglais",
      pt: "Portugais",
      fr: "Français",
      de: "Allemand",
      it: "Italien",
      ja: "Japonais",
      ko: "Coréen",
      "zh-CN": "Chinois simplifié",
      "zh-TW": "Chinois traditionnel",
    },
    languageSelector: {
      accessibilityLabel: "Changer de langue. Langue actuelle : {{language}}",
      accessibilityHint: "Ouvre la liste des langues disponibles",
      title: "Choisir la langue",
      close: "Fermer le sélecteur de langue",
    },
    accessibility: {
      mapCell: "Cellule {{index}}, valeur {{value}}",
      tableCell: "Résultat de la ligne {{index}}, valeur {{value}}",
    },
  },
  navigation: { appTitle: "K-Maps" },
  notFound: {
    title: "Oups",
    message: "Cet écran n’existe pas.",
    hint: "Revenez en arrière pour continuer.",
  },
  table: { result: "Résultat", groups: "Groupes" },
  grid: {
    title: "Karnaugh",
    accessibility: {
      history: "Ouvrir l’historique",
      variableInput: "Nom de la variable {{number}}",
      copyResult: "Copier le résultat",
      openCircuit: "Ouvrir le circuit",
    },
    controls: {
      variables: "Variables",
      variableCount: "{{count}} variables",
      type: "Type",
      view: "Affichage",
      map: "Carte",
      table: "Tableau",
      rotateVariables: "Permuter les variables",
      fillWith: "Remplir avec",
      variableNames: "Noms des variables",
    },
    groups: {
      title: "Focus par groupe",
      all: "Tous",
      label: "G{{number}} : {{expression}}",
    },
    result: {
      title: "Résultat",
      empty: "Sélectionnez des valeurs pour générer l’expression",
      copyHint: "Touchez pour copier",
      copied: "Copié",
      circuit: "Circuit",
    },
    review: {
      unavailableTitle: "Noter l’application",
      unavailableMessage:
        "Impossible d’ouvrir l’évaluation maintenant. Réessayez plus tard.",
    },
    engagement: {
      title: "Vous appréciez l’application ?",
      body: "Si elle vous aide à étudier, vous pouvez soutenir le projet.",
      buyPro: "Acheter la version PRO",
      rateApp: "Noter l’application",
      later: "Plus tard",
    },
  },
  steps: {
    button: "Pas à pas",
    title: "Groupe {{current}} sur {{total}}",
    finalTitle: "Expression finale",
    covered_one: "Couvre 1 cellule de valeur {{target}}.",
    covered_other: "Couvre {{count}} cellules de valeur {{target}}.",
    covered_many: "Couvre {{count}} cellules de valeur {{target}}.",
    eliminated: "{{variables}} changent dans le groupe et sont éliminées.",
    eliminatedNone: "Toutes les variables restent constantes dans ce groupe.",
    termIntro: "Les variables constantes forment le terme :",
    finalBody: "Tous les termes se combinent dans l'expression minimisée :",
    next: "Suivant",
    back: "Retour",
    done: "Terminé",
    exit: "Quitter le mode pas à pas",
  },
  share: {
    accessibilityShare: "Partager l'exercice",
    accessibilityImport: "Importer un exercice",
    shareTitle: "Carte de Karnaugh",
    shareMessage:
      "Essaie de résoudre cet exercice de carte de Karnaugh :\n{{url}}",
    shareErrorTitle: "Erreur",
    shareErrorMessage: "Le lien de partage n'a pas pu être créé.",
    importTitle: "Importer un exercice",
    importBody: "Collez le lien ou le code partagé pour charger la carte.",
    importPlaceholder: "Lien ou code",
    importAction: "Charger l'exercice",
    cancel: "Annuler",
    importedTitle: "Exercice importé",
    importedMessage: "La carte partagée a été chargée avec succès.",
    invalidTitle: "Code invalide",
    invalidMessage:
      "Impossible d'importer. Vérifiez que le lien ou le code est complet.",
  },
  result: {
    badge: "SORTIE LOGIQUE",
    title: "Circuit",
    type: "Type : {{type}}",
    variables: "Variables : {{count}}",
    minimumResult: "Résultat minimal",
    circuitDiagram: "Schéma du circuit",
    fullscreen: "Voir en plein écran",
    close: "Fermer",
    circuit: {
      standard: "Standard",
      nandOnly: "NAND uniquement",
      norOnly: "NOR uniquement",
      nandNote:
        "Circuit équivalent construit uniquement avec des portes NAND.",
      norNote: "Circuit équivalent construit uniquement avec des portes NOR.",
      tapHint:
        "Touchez un terme pour mettre en évidence son groupe sur la carte.",
      zoomHint: "Pincez pour zoomer · appuyez deux fois pour réinitialiser",
      compact: "Compact",
      stats: "Portes : {{gates}} · Entrées : {{inputs}} · Niveaux : {{levels}}",
      mux: "MUX",
      decoder: "Décodeur",
      muxNote:
        "Réalisé avec un multiplexeur {{size}}:1 — {{variable}} alimente les entrées de données.",
      decoderNote:
        "Réalisé avec un décodeur {{inputs}} vers {{outputs}} ; la porte OR combine les minterms requis.",
    },
    accessibility: {
      fullscreen: "Ouvrir le circuit en plein écran",
      closeFullscreen: "Fermer le circuit en plein écran",
    },
    circuitPdf: {
      button: "Télécharger le circuit en PDF",
      generating: "Génération du PDF...",
      successTitle: "PDF généré",
      successMessage: "Le circuit a été généré avec succès.",
      shareHint:
        "\nVous pouvez le partager ou l’enregistrer depuis la boîte de dialogue système.",
      errorTitle: "Erreur",
      errorMessage:
        "Un problème est survenu lors de la génération du PDF. Réessayez.",
    },
    sessionPdf: {
      button: "Exporter la session complète",
      generating: "Exportation de la session...",
      showingAd: "Affichage de la publicité...",
      successTitle: "PDF de session généré",
      successMessage: "La session complète a été exportée.",
      shareHint:
        "\nVous pouvez le partager ou l’enregistrer depuis la boîte de dialogue système.",
      errorTitle: "Erreur",
      errorMessage:
        "Impossible d’exporter la session complète en PDF. Réessayez.",
    },
    comparison: {
      title: "Comparaison de minimisation",
      exactMethod: "Quine-McCluskey",
      heuristicMethod: "Heuristique (type Espresso)",
      validation:
        "Validé par table de vérité pour les cellules définies (les X sont ignorés).",
      equivalent: "Votre résultat est équivalent",
      different: "Votre résultat diffère de la solution exacte",
      equivalentSolutions:
        "Il existe {{count}} solutions minimales équivalentes.",
      uniqueSolution: "Une solution minimale unique a été trouvée.",
      heuristicOptimal: "Heuristique optimale",
      heuristicNotOptimal: "Heuristique non optimale",
      heuristicHelp:
        "Optimale : l’heuristique a trouvé une forme minimale. Non optimale : l’expression fonctionne, mais peut être davantage simplifiée.",
      showEquivalent: "Voir les solutions équivalentes",
      hideEquivalent: "Masquer les solutions équivalentes",
      accessibility: {
        heuristicHelp: "Afficher l’explication de l’heuristique",
      },
    },
  },
  history: {
    badge: "PROGRESSION",
    title: "Historique",
    clear: "Effacer",
    searchPlaceholder: "Rechercher par résultat",
    filters: {
      favorites: "Favoris",
      all: "Tout",
      anyVariables: "Toutes variables",
    },
    sections: { favorites: "⭐ Favoris", history: "Historique" },
    variableCount: "{{count}} var.",
    result: "Résultat",
    use: "Utiliser",
    deleteDialog: {
      title: "Supprimer l’exercice",
      message: "Voulez-vous vraiment supprimer cet exercice de l’historique ?",
      cancel: "Annuler",
      confirm: "Supprimer",
    },
    clearDialog: {
      title: "Effacer l’historique",
      message: "Tous les exercices enregistrés seront supprimés.",
      cancel: "Annuler",
      confirm: "Effacer",
    },
    empty: {
      filteredTitle: "Aucun résultat",
      filteredMessage:
        "Modifiez les filtres ou effacez la recherche pour voir plus de résultats.",
      title: "Aucun exercice enregistré",
      message:
        "Résolvez des cartes et ouvrez le circuit pour enregistrer votre progression ici.",
    },
    accessibility: {
      clearHistory: "Effacer tout l’historique",
      clearSearch: "Effacer la recherche",
      addFavorite: "Ajouter l’exercice aux favoris",
      removeFavorite: "Retirer l’exercice des favoris",
      useExercise: "Utiliser cet exercice",
      deleteExercise: "Supprimer cet exercice",
    },
  },
  pro: {
    activeTitle: "PRO activé",
    title: "Version PRO",
    activeSubtitle: "Merci de soutenir l’application.",
    subtitle:
      "Débloquez une expérience ciblée pour résoudre plus rapidement.",
    benefits: "Avantages",
    features: {
      noAds: "Aucune publicité",
      uninterrupted: "Étude sans interruption",
      support: "Soutien au développement continu",
      oneTime: "Achat unique, sans abonnement",
    },
    specialPrice: "Prix spécial",
    priceNote: "Paiement unique • Aucun renouvellement automatique",
    buy: "Acheter la version PRO",
    restore: "Restaurer les achats",
    back: "Retour",
    later: "Peut-être plus tard",
    accessibility: {
      open: "Ouvrir les informations de la version PRO",
      active: "Version PRO activée",
    },
    alerts: {
      notConfiguredTitle: "Achats non configurés",
      purchaseNotConfigured:
        "react-native-iap doit être installé ou configuré pour les achats réels.",
      restoreNotConfigured:
        "react-native-iap doit être installé ou configuré pour restaurer les achats.",
      incompleteTitle: "Achat non terminé",
      incompleteMessage: "Aucun achat valide n’a été détecté.",
      thanksTitle: "Merci !",
      thanksMessage: "Vous avez acheté la version PRO.",
      purchaseErrorTitle: "Erreur",
      purchaseErrorMessage: "Impossible de terminer l’achat.",
      notFoundTitle: "Aucun achat trouvé",
      notFoundMessage: "Aucun achat PRO n’a été trouvé pour ce compte.",
      restoredTitle: "Restauré",
      restoredMessage: "Votre achat PRO a été restauré avec succès.",
      restoreErrorTitle: "Erreur",
      restoreErrorMessage: "Impossible de restaurer les achats.",
    },
  },
  pdf: {
    common: {
      variables: "Variables",
      type: "Type",
      result: "Résultat",
      groups: "Groupes",
      circuit: "Circuit",
      expression: "Expression",
      generatedAt: "Généré le",
      productOfSums: "Produit de sommes (POS)",
      sumOfProducts: "Somme de produits (SOP)",
      unavailableCircuit: "Impossible de générer le circuit.",
      sharingUnavailable:
        "Le partage n’est pas disponible sur cet appareil",
    },
    session: {
      documentTitle: "Session complète - Cartes de Karnaugh",
      finalExpression: "Expression finale",
      coloredMap: "Carte de Karnaugh en couleur",
      truthTable: "Table de vérité",
      comparison: "Comparaison de minimisation",
      heuristic: "Heuristique (type Espresso)",
      equivalent: "Votre résultat est équivalent à la solution exacte.",
      different: "Votre résultat diffère de la solution exacte.",
      equivalentSolutions:
        "Il existe {{count}} solutions minimales équivalentes.",
      uniqueSolution: "Une solution minimale unique a été trouvée.",
      groupDetail: "Détail du groupe G{{number}}",
      term: "Terme",
      cells: "Cellules",
      shareTitle: "Exporter la session complète",
    },
    circuit: {
      documentTitle: "Circuit logique - Cartes de Karnaugh",
      heading: "Circuit logique",
      generatedAutomatically:
        "Cartes de Karnaugh - Généré automatiquement",
      shareTitle: "Télécharger le circuit en PDF",
    },
  },
  onboarding: {
    badge: "BIENVENUE",
    skip: "Passer",
    title: "Commencez en 3 étapes",
    next: "Suivant",
    start: "Commencer",
    slides: {
      sopPos: {
        title: "SOP vs POS",
        description:
          "SOP minimise avec les 1. POS minimise avec les 0. Modifiez le type ci-dessus selon le format demandé.",
      },
      values: {
        title: "Modifier 0 / 1 / X",
        description:
          "Touchez chaque cellule pour alterner 0 → 1 → X. Utilisez les boutons rapides pour remplir toute la carte.",
      },
      circuit: {
        title: "Lire le circuit",
        description:
          "Le résultat se met à jour ci-dessous. Touchez Circuit pour voir les portes et exporter le schéma en PDF.",
      },
    },
  },
} as const;
