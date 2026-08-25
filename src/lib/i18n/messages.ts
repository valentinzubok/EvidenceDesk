export type Locale = "en" | "uk";

export type Messages = {
  nav: {
    home: string;
    cases: string;
    criteria: string;
    connect: string;
    connecting: string;
    disconnect: string;
    copyAddress: string;
    copied: string;
    connected: string;
    readOnly: string;
  };
  home: {
    tag: string;
    title: string;
    subtitle: string;
    openCases: string;
    browseCriteria: string;
    readOnlyNote: string;
    workflowTitle: string;
    workflow: string[];
    liveDemo: string;
    featuresTitle: string;
    features: { title: string; desc: string }[];
    statsTitle: string;
    explorer: string;
  };
  cases: {
    title: string;
    subtitle: string;
    openNew: string;
    caseId: string;
    urlsJson: string;
    addUrl: string;
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
    search: string;
    generateId: string;
    copyJson: string;
    copiedJson: string;
    txSubmitted: string;
    invalidCaseId: string;
    invalidUrls: string;
    items: string;
    status: string;
    preview: string;
    hash: string;
    url: string;
  };
  criteria: {
    title: string;
    subtitle: string;
    top: string;
    refresh: string;
    noTemplates: string;
    copy: string;
    copyId: string;
    copied: string;
    copiedId: string;
    previewHint: string;
    loading: string;
    scoreUses: string;
    search: string;
    emptyBody: string;
  };
  wallet: {
    title: string;
    noMetaMask: string;
    install: string;
    step1: string;
    step2: string;
    step3: string;
    studionet: string;
  };
  common: { loading: string; error: string; retry: string };
  validation: {
    invalid_json: string;
    empty_array: string;
    too_many_urls: string;
    not_string: string;
    https_only: string;
    url_too_long: string;
  };
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
      copyAddress: "Copy address",
      copied: "Copied!",
      connected: "Connected",
      readOnly: "Read-only",
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
      liveDemo: "Live demo",
      featuresTitle: "Why Evidence Desk",
      features: [
        { title: "On-chain evidence", desc: "Freeze URL snapshots with cryptographic hashes on Studionet." },
        { title: "Shared criteria", desc: "Browse and copy eq-principle templates from PromptRegistry." },
        { title: "Tamper detection", desc: "cross_check flags when live pages drift from frozen evidence." },
      ],
      statsTitle: "Network snapshot",
      explorer: "View on Explorer",
    },
    cases: {
      title: "Evidence Cases",
      subtitle: "Read/write EvidenceSnapshot on Studionet via genlayer-js + MetaMask.",
      openNew: "Open new case",
      caseId: "Case ID",
      urlsJson: "URLs (JSON array, HTTPS only)",
      addUrl: "Add demo URL",
      openCase: "Submit open_case",
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
      search: "Search cases…",
      generateId: "Generate ID",
      copyJson: "Copy JSON",
      copiedJson: "Case JSON copied",
      txSubmitted: "Transaction submitted",
      invalidCaseId: "Invalid case ID (use a-z, 0-9, _, -, max 64 chars)",
      invalidUrls: "Invalid URLs JSON",
      items: "Evidence items",
      status: "Status",
      preview: "Preview",
      hash: "Hash",
      url: "URL",
    },
    criteria: {
      title: "Criteria Templates",
      subtitle: "Read PromptRegistry on Studionet — top templates by score.",
      top: "Top templates",
      refresh: "Refresh",
      noTemplates: "No templates yet.",
      copy: "Copy criteria",
      copyId: "Copy ID",
      copied: "Criteria copied to clipboard",
      copiedId: "Template ID copied",
      previewHint:
        "Pin this id in your dispute contract or use with EvidenceSnapshot cross_check adjudication.",
      loading: "Loading templates…",
      scoreUses: "score {score} · uses {uses}",
      search: "Search templates…",
      emptyBody: "(empty or deprecated)",
    },
    wallet: {
      title: "Connect MetaMask",
      noMetaMask: "MetaMask extension not detected.",
      install: "Install MetaMask",
      step1: "Install MetaMask browser extension",
      step2: "Create or import a wallet",
      step3: "Click Connect — genlayer-js adds Studionet automatically",
      studionet: "Studionet (GenLayer Studio)",
    },
    common: { loading: "Loading…", error: "Something went wrong", retry: "Retry" },
    validation: {
      invalid_json: "Must be valid JSON array",
      empty_array: "Add at least one URL",
      too_many_urls: "Maximum 20 URLs per case",
      not_string: "Each URL must be a string",
      https_only: "Only HTTPS URLs allowed",
      url_too_long: "URL too long (max 2048 chars)",
    },
  },
  uk: {
    nav: {
      home: "Головна",
      cases: "Кейси",
      criteria: "Критерії",
      connect: "Підключити гаманець",
      connecting: "Підключення…",
      disconnect: "Відключити",
      copyAddress: "Копіювати адресу",
      copied: "Скопійовано!",
      connected: "Підключено",
      readOnly: "Лише читання",
    },
    home: {
      tag: "Проєкт GenLayer",
      title: "Зафіксуй докази. Обери критерії. Доведи зміни.",
      subtitle:
        "Evidence Desk — консоль для спорів на GenLayer. Об'єднує EvidenceSnapshot (захист від «гниття» URL) та PromptRegistry (спільні шаблони eq-principle) в одному потоці.",
      openCases: "Відкрити кейси",
      browseCriteria: "Переглянути критерії",
      readOnlyNote:
        "Режим лише читання працює без MetaMask — можна переглядати кейси та критерії. Підключіть гаманець для open_case та cross_check.",
      workflowTitle: "Сценарій роботи",
      workflow: [
        "Підключіть MetaMask (Studionet через genlayer-js)",
        "Відкрийте кейс з URL → EvidenceSnapshot заморожує докази",
        "Оберіть шаблон критеріїв → PromptRegistry get_body",
        "Пізніше cross_check → фіксація змін на ланцюгу",
      ],
      liveDemo: "Живе демо",
      featuresTitle: "Чому Evidence Desk",
      features: [
        { title: "Докази на ланцюгу", desc: "Заморожуйте знімки URL з криптографічними хешами на Studionet." },
        { title: "Спільні критерії", desc: "Переглядайте та копіюйте шаблони eq-principle з PromptRegistry." },
        { title: "Виявлення змін", desc: "cross_check позначає, коли сторінки відрізняються від зафіксованих доказів." },
      ],
      statsTitle: "Стан мережі",
      explorer: "Відкрити в Explorer",
    },
    cases: {
      title: "Кейси доказів",
      subtitle: "Читання/запис EvidenceSnapshot у Studionet через genlayer-js + MetaMask.",
      openNew: "Новий кейс",
      caseId: "ID кейсу",
      urlsJson: "URL (JSON-масив, лише HTTPS)",
      addUrl: "Додати демо URL",
      openCase: "Надіслати open_case",
      onChain: "Кейси на ланцюгу",
      refresh: "Оновити",
      noCases: "Кейсів поки немає.",
      crossCheck: "cross_check",
      detail: "Деталі кейсу",
      tampered: "Змінено",
      yes: "так",
      no: "ні",
      connectFirst: "Спочатку підключіть гаманець",
      recent: "Недавні",
      favorites: "Обране",
      addFavorite: "Додати в обране",
      removeFavorite: "Прибрати з обраного",
      loading: "Завантаження кейсів…",
      search: "Пошук кейсів…",
      generateId: "Згенерувати ID",
      copyJson: "Копіювати JSON",
      copiedJson: "JSON кейсу скопійовано",
      txSubmitted: "Транзакцію надіслано",
      invalidCaseId: "Невірний ID (a-z, 0-9, _, -, макс. 64 символи)",
      invalidUrls: "Невірний JSON з URL",
      items: "Елементи доказів",
      status: "Статус",
      preview: "Превʼю",
      hash: "Хеш",
      url: "URL",
    },
    criteria: {
      title: "Шаблони критеріїв",
      subtitle: "PromptRegistry у Studionet — топ шаблонів за score.",
      top: "Топ шаблонів",
      refresh: "Оновити",
      noTemplates: "Шаблонів поки немає.",
      copy: "Копіювати критерії",
      copyId: "Копіювати ID",
      copied: "Критерії скопійовано",
      copiedId: "ID шаблону скопійовано",
      previewHint:
        "Використовуйте id у dispute-контракті або з adjudication EvidenceSnapshot cross_check.",
      loading: "Завантаження шаблонів…",
      scoreUses: "score {score} · uses {uses}",
      search: "Пошук шаблонів…",
      emptyBody: "(порожньо або застаріло)",
    },
    wallet: {
      title: "Підключити MetaMask",
      noMetaMask: "Розширення MetaMask не знайдено.",
      install: "Встановити MetaMask",
      step1: "Встановіть розширення MetaMask",
      step2: "Створіть або імпортуйте гаманець",
      step3: "Натисніть Підключити — genlayer-js додасть Studionet автоматично",
      studionet: "Studionet (GenLayer Studio)",
    },
    common: { loading: "Завантаження…", error: "Щось пішло не так", retry: "Повторити" },
    validation: {
      invalid_json: "Має бути валідний JSON-масив",
      empty_array: "Додайте хоча б один URL",
      too_many_urls: "Максимум 20 URL на кейс",
      not_string: "Кожен URL має бути рядком",
      https_only: "Дозволені лише HTTPS URL",
      url_too_long: "URL занадто довгий (макс. 2048 символів)",
    },
  },
};

export function tScoreUses(template: string, score: number, uses: number): string {
  return template.replace("{score}", String(score)).replace("{uses}", String(uses));
}

export function tValidation(locale: Locale, key: keyof Messages["validation"]): string {
  return messages[locale].validation[key];
}
