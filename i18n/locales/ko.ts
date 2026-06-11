export const koTranslation = {
  "common": {
    "languages": {
      "fr": "프랑스어",
      "en": "영어",
      "de": "독일어",
      "es": "스페인어",
      "ja": "일본어",
      "ko": "한국어",
      "it": "이탈리아어",
      "pt": "포르투갈어",
      "zh-CN": "중국어 간체",
      "zh-TW": "중국어 번체"
    },
    "languageSelector": {
      "title": "언어 선택",
      "accessibilityHint": "사용 가능한 언어 목록을 엽니다.",
      "close": "언어 선택기 닫기",
      "accessibilityLabel": "언어를 변경하세요. 현재 언어: {{language}}"
    },
    "accessibility": {
      "tableCell": "{{index}} 행, 값 {{value}}에 대한 결과",
      "mapCell": "셀 {{index}}, 값 {{value}}"
    }
  },
  "notFound": {
    "title": "이런",
    "message": "이 화면은 존재하지 않습니다.",
    "hint": "계속하려면 돌아가세요."
  },
  "table": {
    "result": "결과",
    "groups": "그룹"
  },
  "grid": {
    "accessibility": {
      "history": "기록 열기",
      "variableInput": "변수 이름 {{number}}",
      "openCircuit": "회로 열기",
      "copyResult": "결과 복사"
    },
    "title": "카르노 맵",
    "controls": {
      "view": "보기",
      "map": "맵",
      "type": "유형",
      "table": "테이블",
      "variableCount": "{{count}} 변수",
      "rotateVariables": "변수 회전",
      "fillWith": "다음으로 채우기",
      "variableNames": "변수 이름",
      "variables": "변수"
    },
    "result": {
      "copied": "복사됨",
      "title": "결과",
      "circuit": "회로",
      "empty": "표현식을 생성할 값을 선택하세요.",
      "copyHint": "복사하려면 탭하세요."
    },
    "groups": {
      "all": "모두",
      "label": "G{{number}}: {{expression}}",
      "title": "그룹별 집중"
    },
    "review": {
      "unavailableMessage": "지금은 검토 메시지를 열 수 없습니다. 나중에 다시 시도해 주세요.",
      "unavailableTitle": "앱 평가"
    },
    "engagement": {
      "title": "앱을 즐기고 계신가요?",
      "later": "나중에",
      "rateApp": "앱 평가",
      "body": "공부에 도움이 된다면 프로젝트를 지원할 수 있습니다.",
      "buyPro": "PRO 버전 구매"
    }
  },
  "navigation": {
    "appTitle": "K-Maps"
  },
  "expression": {
    "title": "식으로 채우기",
    "body": "변수를 사용해 불 식을 입력하면 진리표에 따라 맵이 채워집니다.",
    "placeholder": "예: AB′ + C(D + A′)",
    "action": "맵 채우기",
    "cancel": "취소",
    "clear": "지우기",
    "errorSyntax": "잘못된 식입니다. 괄호와 연산자를 확인하세요.",
    "errorUnknown": "알 수 없는 기호: {{token}}"
  },
  "steps": {
    "button": "단계별 풀이",
    "title": "그룹 {{current}} / {{total}}",
    "finalTitle": "최종 식",
    "covered_other": "값이 {{target}}인 셀 {{count}}개를 포함합니다.",
    "eliminated": "{{variables}}은(는) 그룹 안에서 변하므로 제거됩니다.",
    "eliminatedNone": "이 그룹에서는 모든 변수가 일정합니다.",
    "termIntro": "일정한 변수들이 다음 항을 만듭니다:",
    "finalBody": "모든 항을 결합하면 최소화된 식이 됩니다:",
    "next": "다음",
    "back": "이전",
    "done": "완료",
    "exit": "단계별 풀이 종료"
  },
  "share": {
    "accessibilityShare": "문제 공유",
    "accessibilityImport": "문제 가져오기",
    "shareTitle": "카르노 맵",
    "shareMessage": "이 카르노 맵 문제를 풀어 보세요:\n{{url}}",
    "shareErrorTitle": "오류",
    "shareErrorMessage": "공유 링크를 만들 수 없습니다.",
    "importTitle": "문제 가져오기",
    "importBody": "공유된 링크나 코드를 붙여넣어 맵을 불러오세요.",
    "importPlaceholder": "링크 또는 코드",
    "importAction": "문제 불러오기",
    "cancel": "취소",
    "importedTitle": "문제를 가져왔습니다",
    "importedMessage": "공유된 맵을 성공적으로 불러왔습니다.",
    "invalidTitle": "잘못된 코드",
    "invalidMessage": "가져올 수 없습니다. 링크나 코드가 완전한지 확인하세요."
  },
  "result": {
    "title": "회로",
    "close": "닫기",
    "circuit": {
      "standard": "표준",
      "nandOnly": "NAND만",
      "norOnly": "NOR만",
      "nandNote": "NAND 게이트만으로 구성된 등가 회로입니다.",
      "norNote": "NOR 게이트만으로 구성된 등가 회로입니다.",
      "tapHint": "항을 탭하면 맵에서 해당 그룹이 강조 표시됩니다.",
      "zoomHint": "핀치로 확대 · 두 번 탭하여 초기화",
      "compact": "간단히",
      "stats": "게이트: {{gates}} · 입력: {{inputs}} · 단계: {{levels}}",
      "mux": "MUX",
      "decoder": "디코더",
      "muxNote": "{{size}}:1 멀티플렉서로 구현 — 데이터 입력은 {{variable}}가 담당합니다.",
      "decoderNote": "{{inputs}}→{{outputs}} 디코더로 구현 — 필요한 최소항을 OR 게이트로 결합합니다."
    },
    "type": "유형: {{type}}",
    "badge": "논리 출력",
    "minimumResult": "최소 결과",
    "circuitDiagram": "회로도",
    "fullscreen": "전체 화면으로 보기",
    "circuitPdf": {
      "shareHint": "시스템 대화 상자에서 공유하거나 저장할 수 있습니다.",
      "successMessage": "회로가 성공적으로 생성되었습니다.",
      "errorTitle": "오류",
      "button": "회로 PDF 다운로드",
      "generating": "PDF 생성 중...",
      "successTitle": "PDF가 생성됨",
      "errorMessage": "PDF를 생성하는 중에 문제가 발생했습니다. 다시 시도해 주세요."
    },
    "variables": "변수: {{count}}",
    "accessibility": {
      "fullscreen": "전체 화면에서 회로 열기",
      "closeFullscreen": "전체 화면 회로를 닫습니다"
    },
    "sessionPdf": {
      "showingAd": "광고 표시 중...",
      "generating": "세션을 내보내는 중...",
      "button": "전체 세션 내보내기",
      "successTitle": "세션 PDF가 생성되었습니다.",
      "shareHint": "시스템 대화 상자에서 공유하거나 저장할 수 있습니다.",
      "errorTitle": "오류",
      "successMessage": "전체 세션을 내보냈습니다.",
      "errorMessage": "전체 세션을 PDF로 내보낼 수 없습니다. 다시 시도해 주세요."
    },
    "comparison": {
      "equivalent": "귀하의 결과는 동일합니다",
      "heuristicMethod": "휴리스틱(Espresso 방식)",
      "validation": "정의된 셀에 대한 진리표로 검증됩니다(X 값은 무시됨).",
      "exactMethod": "퀸-맥클러스키",
      "title": "최소화 비교",
      "uniqueSolution": "고유한 최소 솔루션이 발견되었습니다.",
      "different": "결과가 정확한 솔루션과 다릅니다.",
      "equivalentSolutions": "{{count}}에 해당하는 최소 솔루션이 있습니다.",
      "heuristicHelp": "최적: 휴리스틱이 최소 형식을 찾았습니다. 최적이 아님: 표현식은 작동하지만 더 단순화될 수 있습니다.",
      "heuristicNotOptimal": "최적이 아닌 휴리스틱",
      "heuristicOptimal": "최적의 휴리스틱",
      "showEquivalent": "동등한 솔루션 보기",
      "hideEquivalent": "동등한 솔루션 숨기기",
      "accessibility": {
        "heuristicHelp": "경험적 설명 표시"
      }
    }
  },
  "history": {
    "badge": "진전",
    "title": "기록",
    "clear": "지우기",
    "filters": {
      "all": "모두",
      "favorites": "즐겨찾기",
      "anyVariables": "모든 변수"
    },
    "sections": {
      "favorites": "⭐ 즐겨찾기",
      "history": "기록"
    },
    "searchPlaceholder": "결과로 검색",
    "result": "결과",
    "use": "사용",
    "deleteDialog": {
      "confirm": "삭제",
      "cancel": "취소",
      "message": "기록에서 이 운동을 삭제하시겠습니까?",
      "title": "운동 삭제"
    },
    "clearDialog": {
      "cancel": "취소",
      "title": "기록 지우기",
      "confirm": "분명한",
      "message": "저장된 모든 운동이 삭제됩니다."
    },
    "empty": {
      "message": "지도를 풀고 서킷을 열어 ​​진행 상황을 여기에 저장하세요.",
      "filteredMessage": "더 많은 결과를 보려면 필터를 조정하거나 검색을 삭제하세요.",
      "filteredTitle": "일치하는 항목 없음",
      "title": "저장된 운동 없음"
    },
    "accessibility": {
      "clearSearch": "검색 지우기",
      "addFavorite": "즐겨찾기에 운동 추가",
      "removeFavorite": "즐겨찾기에서 운동 제거",
      "clearHistory": "모든 기록 지우기",
      "deleteExercise": "이 운동 삭제",
      "useExercise": "이 운동을 활용하세요"
    },
    "variableCount": "{{count}} 변수"
  },
  "pro": {
    "benefits": "이익",
    "features": {
      "noAds": "광고 없음",
      "uninterrupted": "중단 없는 학습 흐름",
      "oneTime": "일회성 구매, 구독 없음",
      "support": "지속적인 개발 지원"
    },
    "activeTitle": "PRO 활성화",
    "title": "프로 버전",
    "buy": "PRO 버전 구매",
    "back": "뒤쪽에",
    "subtitle": "집중된 경험을 잠금 해제하고 문제를 더 빠르게 해결하세요.",
    "activeSubtitle": "앱을 지원해 주셔서 감사합니다.",
    "priceNote": "일회성 결제 • 자동 갱신 없음",
    "later": "어쩌면 나중에",
    "alerts": {
      "notConfiguredTitle": "구매가 구성되지 않았습니다.",
      "thanksTitle": "감사합니다!",
      "purchaseErrorTitle": "오류",
      "incompleteMessage": "유효한 구매가 감지되지 않았습니다.",
      "thanksMessage": "PRO 버전을 구매하셨습니다.",
      "purchaseNotConfigured": "실제 구매를 위해서는 React-native-iap를 설치하거나 구성해야 합니다.",
      "restoreNotConfigured": "구매를 복원하려면 React-native-iap를 설치하거나 구성해야 합니다.",
      "restoreErrorTitle": "오류",
      "incompleteTitle": "구매가 완료되지 않았습니다.",
      "notFoundTitle": "구매 내역이 없습니다.",
      "restoredTitle": "복원됨",
      "purchaseErrorMessage": "구매를 완료할 수 없습니다.",
      "restoredMessage": "PRO 구매가 성공적으로 복원되었습니다.",
      "restoreErrorMessage": "구매를 복원할 수 없습니다.",
      "notFoundMessage": "이 계정에서는 PRO 구매를 찾을 수 없습니다."
    },
    "specialPrice": "특가",
    "restore": "구매 복원",
    "accessibility": {
      "active": "PRO 버전 활성화",
      "open": "PRO 버전 정보 열기"
    }
  },
  "pdf": {
    "common": {
      "variables": "변수",
      "type": "유형",
      "result": "결과",
      "groups": "여러 떼",
      "circuit": "회로",
      "expression": "표현",
      "generatedAt": "생성 날짜",
      "sharingUnavailable": "이 기기에서는 공유할 수 없습니다.",
      "unavailableCircuit": "회로를 생성할 수 없습니다.",
      "sumOfProducts": "제품 합계(SOP)",
      "productOfSums": "합계의 곱(POS)"
    },
    "session": {
      "documentTitle": "전체 세션 - Karnaugh 지도",
      "comparison": "최소화 비교",
      "heuristic": "휴리스틱(Espresso 방식)",
      "equivalentSolutions": "{{count}}에 해당하는 최소 솔루션이 있습니다.",
      "uniqueSolution": "고유한 최소 솔루션이 발견되었습니다.",
      "finalExpression": "최종 표현",
      "truthTable": "진리표",
      "coloredMap": "컬러 카르노 지도",
      "term": "용어",
      "shareTitle": "전체 세션 내보내기",
      "equivalent": "귀하의 결과는 정확한 솔루션과 동일합니다.",
      "groupDetail": "그룹 G{{number}} 세부정보",
      "different": "결과가 정확한 솔루션과 다릅니다.",
      "cells": "세포"
    },
    "circuit": {
      "shareTitle": "회로 PDF 다운로드",
      "heading": "논리 회로",
      "documentTitle": "논리 회로 - Karnaugh 지도",
      "generatedAutomatically": "Karnaugh 지도 - 자동으로 생성됨"
    }
  },
  "onboarding": {
    "badge": "환영",
    "skip": "건너뛰다",
    "next": "다음",
    "start": "시작",
    "slides": {
      "sopPos": {
        "title": "SOP 대 POS",
        "description": "SOP는 1초 사용을 최소화합니다. POS는 0을 사용하여 최소화합니다. 위의 유형을 변경하여 필요한 형식을 사용하여 해결하세요."
      },
      "values": {
        "title": "0 / 1 / X 변경",
        "description": "각 셀을 탭하여 0 → 1 → X로 순환합니다. 퀵 칩을 사용하여 한 번의 탭으로 전체 지도를 채울 수 있습니다."
      },
      "circuit": {
        "description": "결과는 아래에 업데이트됩니다. 회로를 눌러 게이트를 보고 다이어그램을 PDF로 내보냅니다.",
        "title": "회로 읽기"
      }
    },
    "title": "3단계로 시작하세요"
  }
} as const;
