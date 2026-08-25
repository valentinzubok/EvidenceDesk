export type Locale = "en" | "ru";

export type Messages = {
  nav: { home: string; cases: string; criteria: string; connect: string; connecting: string; disconnect: string };
  home: {
    tag: string;
    title: string;
    subtitle: string;
    openCases: string;
    browseCriteria: string;
    readOnlyNote: string;
    workflowTitle: string;
    workflow: string[];
  };
  cases: {
    title: string;
    subtitle: string;
    openNew: string;
    caseId: string;
    urlsJson: string;
    openCase: string;
    onChain: string;
    refresh: string;
    noCases: string;
    crossCheck: string;
    detail: string;
    tampered: string;
    yes: string;
    no: string;
    connectFirst: string;
    recent: string;
    favorites: string;
    addFavorite: string;
    removeFavorite: string;
    loading: string;
  };
  criteria: {
    title: string;
    subtitle: string;
    top: string;
    refresh: string;
    noTemplates: string;
    copy: string;
    copied: string;
    previewHint: string;
    loading: string;
    scoreUses: string;
  };
  common: { loading: string };
};

export const messages: Record<Locale, Messages> = {
  en: {
    nav: {
      home: "Home",
      cases: "Cases",
      criteria: "Criteria",
      connect: "Connect Wallet",
      connecting: "Connecting…",
      disconnect: "Disconnect",
    },
    home: {
      tag: "GenLayer Project",
      title: "Freeze evidence. Pick criteria. Prove drift.",
      subtitle:
        "Evidence Desk is a dispute evidence console for GenLayer. It connects EvidenceSnapshot (URL rot mitigation) with PromptRegistry (shared eq-principle templates) in one workflow.",
      openCases: "Open Cases",
      browseCriteria: "Browse Criteria",
      readOnlyNote:
        "Read-only mode works without MetaMask — browse cases and criteria. Connect wallet to open cases or run cross_check.",
      workflowTitle: "Workflow",
      workflow: [
        "Connect MetaMask (Studionet via genlayer-js)",
        "Open a case with URLs → EvidenceSnapshot freezes evidence",
        "Pick criteria template → PromptRegistry get_body",
        "Cross-check later → document live drift on-chain",
      ],
    },
    cases: {
      title: "Evidence Cases",
      subtitle: "Read/write EvidenceSnapshot on Studionet via genlayer-js + MetaMask.",
      openNew: "Open new case",
      caseId: "case_id",
      urlsJson: "urls_json",
      openCase: "open_case",
      onChain: "On-chain cases",
      refresh: "Refresh",
      noCases: "No cases yet.",
      crossCheck: "cross_check",
      detail: "Case detail",
      tampered: "Tampered",
      yes: "yes",
      no: "no",
      connectFirst: "Connect wallet first",
      recent: "Recent",
      favorites: "Favorites",
      addFavorite: "Add to favorites",
      removeFavorite: "Remove from favorites",
      loading: "Loading cases…",
    },
    criteria: {
      title: "Criteria Templates",
      subtitle: "Read PromptRegistry on Studionet — top templates by score.",
      top: "Top templates",
      refresh: "Refresh",
      noTemplates: "No templates yet.",
      copy: "Copy criteria",
      copied: "Criteria copied to clipboard",
      previewHint:
        "Pin this id in your dispute contract or use with EvidenceSnapshot cross_check adjudication.",
      loading: "Loading templates…",
      scoreUses: "score {score} · uses {uses}",
    },
    common: { loading: "Loading…" },
  },
  ru: {
    nav: {
      home: "Главная",
      cases: "Кейсы",
      criteria: "Критерии",
      connect: "Подключить кошелёк",
      connecting: "Подключение…",
      disconnect: "Отключить",
    },
    home: {
      tag: "Проект GenLayer",
      title: "Зафиксируй доказательства. Выбери критерии. Докажи изменения.",
      subtitle:
        "Evidence Desk — консоль для споров на GenLayer. Объединяет EvidenceSnapshot (защита от «гниения» URL) и PromptRegistry (общие шаблоны eq-principle) в одном потоке.",
      openCases: "Открыть кейсы",
      browseCriteria: "Смотреть критерии",
      readOnlyNote:
        "Режим только чтения работает без MetaMask — можно смотреть кейсы и критерии. Подключите кошелёк для open_case и cross_check.",
      workflowTitle: "Сценарий",
      workflow: [
        "Подключите MetaMask (Studionet через genlayer-js)",
        "Откройте кейс с URL → EvidenceSnapshot замораживает доказательства",
        "Выберите шаблон критериев → PromptRegistry get_body",
        "Позже cross_check → фиксация изменений на цепи",
      ],
    },
    cases: {
      title: "Кейсы доказательств",
      subtitle: "Чтение/запись EvidenceSnapshot в Studionet через genlayer-js + MetaMask.",
      openNew: "Новый кейс",
      caseId: "case_id",
      urlsJson: "urls_json",
      openCase: "open_case",
      onChain: "Кейсы на цепи",
      refresh: "Обновить",
      noCases: "Кейсов пока нет.",
      crossCheck: "cross_check",
      detail: "Детали кейса",
      tampered: "Изменён",
      yes: "да",
      no: "нет",
      connectFirst: "Сначала подключите кошелёк",
      recent: "Недавние",
      favorites: "Избранное",
      addFavorite: "В избранное",
      removeFavorite: "Убрать из избранного",
      loading: "Загрузка кейсов…",
    },
    criteria: {
      title: "Шаблоны критериев",
      subtitle: "PromptRegistry в Studionet — топ шаблонов по score.",
      top: "Топ шаблонов",
      refresh: "Обновить",
      noTemplates: "Шаблонов пока нет.",
      copy: "Копировать",
      copied: "Критерии скопированы",
      previewHint:
        "Используйте id в dispute-контракте или с adjudication EvidenceSnapshot cross_check.",
      loading: "Загрузка шаблонов…",
      scoreUses: "score {score} · uses {uses}",
    },
    common: { loading: "Загрузка…" },
  },
};

export function tScoreUses(template: string, score: number, uses: number): string {
  return template.replace("{score}", String(score)).replace("{uses}", String(uses));
}
