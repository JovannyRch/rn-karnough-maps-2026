export const zhTWTranslation = {
  "common": {
    "languages": {
      "es": "西班牙語",
      "pt": "葡萄牙語",
      "it": "義大利語",
      "en": "英語",
      "de": "德文",
      "ko": "韓語",
      "fr": "法語",
      "ja": "日語",
      "zh-CN": "簡體中文",
      "zh-TW": "繁體中文"
    },
    "languageSelector": {
      "title": "選擇語言",
      "accessibilityLabel": "更改語言。當前語言：{{language}}",
      "accessibilityHint": "開啟可用語言列表",
      "close": "關閉語言選擇器"
    },
    "accessibility": {
      "tableCell": "行 {{index}} 的結果，值 {{value}}",
      "mapCell": "儲存格 {{index}}，值 {{value}}"
    }
  },
  "notFound": {
    "title": "哎呀",
    "hint": "返回繼續。",
    "message": "該螢幕不存在。"
  },
  "table": {
    "result": "結果",
    "groups": "群組"
  },
  "grid": {
    "title": "卡諾圖",
    "accessibility": {
      "history": "開啟歷史記錄",
      "copyResult": "複製結果",
      "variableInput": "變數名稱 {{number}}",
      "openCircuit": "開啟電路"
    },
    "controls": {
      "variables": "變數",
      "type": "類型",
      "view": "檢視",
      "table": "表格",
      "map": "卡諾圖",
      "variableNames": "變數名稱",
      "rotateVariables": "旋轉變數",
      "fillWith": "填充為",
      "variableCount": "{{count}} 變數"
    },
    "groups": {
      "all": "全部",
      "title": "按組對焦",
      "label": "G{{number}}：{{expression}}"
    },
    "result": {
      "title": "結果",
      "circuit": "電路",
      "copyHint": "點選複製",
      "copied": "已複製",
      "empty": "選擇值來產生表達式"
    },
    "review": {
      "unavailableTitle": "評價應用程式",
      "unavailableMessage": "目前無法開啟審核提示。請稍後重試。"
    },
    "engagement": {
      "rateApp": "評價應用程式",
      "later": "之後",
      "title": "您喜歡這個應用程式嗎？",
      "body": "如果它對你的學習有幫助，你可以支持這個計畫。",
      "buyPro": "購買專業版"
    }
  },
  "navigation": {
    "appTitle": "K-Maps"
  },
  "steps": {
    "button": "逐步講解",
    "title": "第 {{current}} 組，共 {{total}} 組",
    "finalTitle": "最終運算式",
    "covered_other": "包含 {{count}} 個值為 {{target}} 的儲存格。",
    "eliminated": "{{variables}} 在組內發生變化，因此被消去。",
    "eliminatedNone": "該組中所有變數保持不變。",
    "termIntro": "保持不變的變數構成該項：",
    "finalBody": "將所有項組合即可得到最簡運算式：",
    "next": "下一步",
    "back": "上一步",
    "done": "完成",
    "exit": "退出逐步講解"
  },
  "share": {
    "accessibilityShare": "分享練習",
    "accessibilityImport": "匯入練習",
    "shareTitle": "卡諾圖",
    "shareMessage": "來挑戰這道卡諾圖練習：\n{{url}}",
    "shareErrorTitle": "錯誤",
    "shareErrorMessage": "無法產生分享連結。",
    "importTitle": "匯入練習",
    "importBody": "貼上分享的連結或代碼以載入卡諾圖。",
    "importPlaceholder": "連結或代碼",
    "importAction": "載入練習",
    "cancel": "取消",
    "importedTitle": "練習已匯入",
    "importedMessage": "已成功載入分享的卡諾圖。",
    "invalidTitle": "無效代碼",
    "invalidMessage": "無法匯入。請檢查連結或代碼是否完整。"
  },
  "result": {
    "title": "電路",
    "circuit": {
      "standard": "標準",
      "nandOnly": "僅 NAND",
      "norOnly": "僅 NOR",
      "nandNote": "僅使用 NAND 閘構建的等效電路。",
      "norNote": "僅使用 NOR 閘構建的等效電路。",
      "tapHint": "點選某一項即可在卡諾圖中標示對應群組。",
      "zoomHint": "雙指縮放 · 點兩下重置",
      "compact": "緊湊",
      "stats": "閘: {{gates}} · 輸入: {{inputs}} · 級數: {{levels}}"
    },
    "fullscreen": "全螢幕檢視",
    "close": "關閉",
    "minimumResult": "最低結果",
    "accessibility": {
      "fullscreen": "全螢幕打開電路",
      "closeFullscreen": "關閉全螢幕電路"
    },
    "type": "類型：{{type}}",
    "circuitDiagram": "電路圖",
    "variables": "變數：{{count}}",
    "badge": "邏輯輸出",
    "circuitPdf": {
      "errorTitle": "錯誤",
      "successTitle": "產生 PDF",
      "generating": "正在生成 PDF...",
      "successMessage": "電路已成功產生。",
      "button": "下載電路 PDF",
      "errorMessage": "產生 PDF 時出現問題。請再試一次。",
      "shareHint": "您可以從系統對話方塊中共用或儲存它。"
    },
    "sessionPdf": {
      "showingAd": "顯示廣告...",
      "button": "匯出完整會話",
      "generating": "正在導出會話...",
      "errorTitle": "錯誤",
      "successTitle": "產生會話 PDF",
      "errorMessage": "無法將完整會話匯出為 PDF。請再試一次。",
      "successMessage": "完整的會話已匯出。",
      "shareHint": "您可以從系統對話方塊中共用或儲存它。"
    },
    "comparison": {
      "exactMethod": "奎因-麥克拉斯基",
      "title": "最小化比較",
      "heuristicMethod": "啟發式（Espresso 方法）",
      "validation": "使用已定義儲存格的真值表進行驗證（忽略 X 值）。",
      "heuristicOptimal": "最優啟發式",
      "heuristicNotOptimal": "非最佳啟發式",
      "equivalentSolutions": "有 {{count}} 等價最小解。",
      "showEquivalent": "查看等效解決方案",
      "equivalent": "你的結果是等價的",
      "different": "您的結果與確切的解決方案不同",
      "uniqueSolution": "找到了唯一的最小解。",
      "heuristicHelp": "最優：啟發式找出最小形式。非最佳：表達式有效，但可以進一步簡化。",
      "hideEquivalent": "隱藏等效解決方案",
      "accessibility": {
        "heuristicHelp": "顯示啟發式解釋"
      }
    }
  },
  "history": {
    "clear": "清除",
    "title": "歷史記錄",
    "badge": "進步",
    "filters": {
      "favorites": "收藏夾",
      "all": "全部",
      "anyVariables": "任何變數"
    },
    "sections": {
      "history": "歷史記錄",
      "favorites": "⭐ 最愛"
    },
    "result": "結果",
    "variableCount": "{{count}} 變數",
    "use": "使用",
    "deleteDialog": {
      "cancel": "取消",
      "confirm": "刪除",
      "title": "刪除練習",
      "message": "您確定要從歷史記錄中刪除此練習嗎？"
    },
    "clearDialog": {
      "title": "清除歷史記錄",
      "cancel": "取消",
      "confirm": "清除",
      "message": "所有已儲存的練習都將被刪除。"
    },
    "searchPlaceholder": "按結果搜尋",
    "empty": {
      "filteredTitle": "沒有匹配項",
      "message": "解決地圖並打開電路以保存您的進度。",
      "filteredMessage": "調整過濾器或清除搜尋以查看更多結果。",
      "title": "沒有保存的練習"
    },
    "accessibility": {
      "clearSearch": "清除搜尋",
      "removeFavorite": "從收藏夾中刪除鍛煉",
      "addFavorite": "將運動加入收藏夾",
      "deleteExercise": "刪除此練習",
      "clearHistory": "清除所有歷史記錄",
      "useExercise": "使用這個練習"
    }
  },
  "pro": {
    "title": "專業版",
    "benefits": "好處",
    "features": {
      "noAds": "無廣告",
      "oneTime": "一次性購買，無需訂閱",
      "uninterrupted": "不間斷的學習流程",
      "support": "支持持續發展"
    },
    "activeTitle": "PRO 已啟動",
    "specialPrice": "特價",
    "buy": "購買專業版",
    "restore": "恢復購買",
    "back": "後退",
    "later": "也許稍後",
    "subtitle": "解鎖專注的體驗並更快地解決問題。",
    "priceNote": "一次性付款 • 無自動續訂",
    "activeSubtitle": "感謝您支持該應用程式。",
    "alerts": {
      "notConfiguredTitle": "未配置購買",
      "incompleteTitle": "購買未完成",
      "purchaseErrorTitle": "錯誤",
      "thanksTitle": "謝謝你！",
      "restoredTitle": "已恢復",
      "purchaseNotConfigured": "實際購買時必須安裝或設定react-native-iap。",
      "restoreNotConfigured": "必須安裝或設定react-native-iap才能恢復購買。",
      "restoreErrorTitle": "錯誤",
      "notFoundMessage": "找不到此帳戶的 PRO 購買。",
      "incompleteMessage": "未檢測到有效購買。",
      "restoredMessage": "您的 PRO 購買已成功恢復。",
      "notFoundTitle": "沒有找到購買的商品",
      "thanksMessage": "您已購買 PRO 版本。",
      "purchaseErrorMessage": "購買無法完成。",
      "restoreErrorMessage": "無法恢復購買。"
    },
    "accessibility": {
      "open": "打開PRO版本信息",
      "active": "PRO 版本已啟動"
    }
  },
  "pdf": {
    "common": {
      "variables": "變數",
      "type": "類型",
      "result": "結果",
      "groups": "團體",
      "circuit": "電路",
      "expression": "表達",
      "generatedAt": "生成於",
      "unavailableCircuit": "無法產生電路。",
      "sumOfProducts": "產品總和 (SOP)",
      "sharingUnavailable": "此設備上無法共享",
      "productOfSums": "總和乘積 (POS)"
    },
    "session": {
      "coloredMap": "彩色卡諾圖",
      "finalExpression": "最終表達",
      "documentTitle": "完整會議 - 卡諾地圖",
      "comparison": "最小化比較",
      "heuristic": "啟發式（Espresso 方法）",
      "equivalentSolutions": "有 {{count}} 等價最小解。",
      "uniqueSolution": "找到了唯一的最小解。",
      "shareTitle": "匯出完整會話",
      "term": "學期",
      "cells": "細胞",
      "groupDetail": "G組{{number}}詳細信息",
      "equivalent": "您的結果相當於精確解。",
      "different": "您的結果與確切的解決方案不同。",
      "truthTable": "真值表"
    },
    "circuit": {
      "shareTitle": "下載電路 PDF",
      "generatedAutomatically": "卡諾地圖 - 自動生成",
      "documentTitle": "邏輯電路 - 卡諾圖",
      "heading": "邏輯電路"
    }
  },
  "onboarding": {
    "badge": "歡迎",
    "skip": "跳過",
    "title": "只需 3 步驟即可開始使用",
    "next": "下一個",
    "start": "開始",
    "slides": {
      "sopPos": {
        "title": "SOP 與 POS",
        "description": "SOP 最大限度地減少 1 秒的使用。 POS 最大限度地減少使用 0。更改上面的類型以使用您需要的格式進行求解。"
      },
      "circuit": {
        "title": "讀電路",
        "description": "結果更新如下。點擊電路查看門並將圖表匯出為 PDF。"
      },
      "values": {
        "title": "更改 0 / 1 / X",
        "description": "點選每個儲存格即可循環 0 → 1 → X。使用快速籌碼一鍵即可填滿整個地圖。"
      }
    }
  }
} as const;
