export type Locale = "en" | "ua";

export type Messages = {
  nav: {
    home: string;
    cases: string;
    criteria: string;
    marketplace: string;
    connect: string;
    connecting: string;
    disconnect: string;
    copyAddress: string;
    copied: string;
    connected: string;
    readOnly: string;
    menuOpen: string;
    menuClose: string;
  };
  footer: {
    tagline: string;
    product: string;
    resources: string;
    contracts: string;
    liveDemo: string;
    mit: string;
    disclaimer: string;
  };
  breadcrumbs: {
    aria: string;
    home: string;
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
    storyEyebrow: string;
    storyTitle: string;
    storySubtitle: string;
    storySteps: { title: string; desc: string }[];
    storyQuote: string;
    whatWeDoTitle: string;
    whatWeDoIntro: string;
    problemTitle: string;
    problemPoints: string[];
    solutionTitle: string;
    solutionPoints: string[];
    forWhomTitle: string;
    forWhom: string[];
    partnershipEyebrow: string;
    partnershipTitle: string;
    partnershipBody: string;
    partnershipPurpose: string;
    partnerDesc: {
      genlayer: string;
      snapshot: string;
      registry: string;
      portal: string;
    };
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
    crossCheckFetching: string;
    crossCheckSubmitting: string;
    crossCheckFailed: string;
    rateLimited: string;
    readOnlyChain: string;
    loadMore: string;
    showingCount: string;
    copiedHash: string;
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
    filterTag: string;
    allTags: string;
    sortBy: string;
    sortScore: string;
    sortUses: string;
    sortRecent: string;
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
  theme: { light: string; dark: string };
  tooltips: { wallet: string; crossCheck: string; connect: string };
  ai: { title: string; subtitle: string; placeholder: string; generate: string; generated: string };
  marketplace: { title: string; subtitle: string; note: string; add: string };
  rbac: { readOnly: string; role: string };
  wizard: {
    title: string;
    stepOf: string;
    stepId: string;
    stepUrls: string;
    stepReview: string;
    next: string;
    back: string;
    cancel: string;
    add: string;
    noUrls: string;
    idHint: string;
    reviewHint: string;
    openWizard: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
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
      marketplace: "Marketplace",
      connect: "Connect Wallet",
      connecting: "Connecting…",
      disconnect: "Disconnect",
      copyAddress: "Copy address",
      copied: "Copied!",
      connected: "Connected",
      readOnly: "Read-only",
      menuOpen: "Open menu",
      menuClose: "Close menu",
    },
    footer: {
      tagline:
        "Dispute evidence console for GenLayer — freeze URL snapshots, reuse eq-principle criteria, prove drift on-chain.",
      product: "Product",
      resources: "Resources",
      contracts: "Contracts",
      liveDemo: "Live demo",
      mit: "MIT License",
      disclaimer:
        "Read-only browsing works without a wallet. Connect MetaMask on Studionet for open_case and cross_check.",
    },
    breadcrumbs: {
      aria: "Breadcrumb",
      home: "Home",
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
        {
          title: "On-chain evidence",
          desc: "Freeze URL snapshots with cryptographic hashes on Studionet.",
        },
        {
          title: "Shared criteria",
          desc: "Browse and copy eq-principle templates from PromptRegistry.",
        },
        {
          title: "Tamper detection",
          desc: "cross_check flags when live pages drift from frozen evidence.",
        },
      ],
      statsTitle: "Network snapshot",
      explorer: "View on Explorer",
      storyEyebrow: "The product",
      storyTitle: "One desk for dispute evidence on GenLayer",
      storySubtitle:
        "Evidence Desk is a live console — not a mock. It reads and writes real contracts on Studionet, turning scattered URLs and criteria into a verifiable on-chain trail.",
      storySteps: [
        {
          title: "Capture",
          desc: "Paste HTTPS URLs into a case — web evidence enters the workflow.",
        },
        {
          title: "Freeze",
          desc: "EvidenceSnapshot stores hash + preview while the link still works.",
        },
        { title: "Criteria", desc: "Pick eq-principle templates from PromptRegistry by id." },
        { title: "Prove", desc: "cross_check later — tamper flags if live pages drift." },
      ],
      storyQuote:
        "“Disputes need more than screenshots. We freeze what was true, attach shared rules, and let the chain record what changed.”",
      whatWeDoTitle: "What we do",
      whatWeDoIntro:
        "We turn dispute evidence into an on-chain workflow: freeze URLs before they rot, attach shared criteria, and prove later if content changed.",
      problemTitle: "The problem",
      problemPoints: [
        "Links break, pages change, and screenshots alone are easy to dispute.",
        "Teams reuse criteria in silos — no shared, verifiable templates.",
        "Off-chain evidence is hard to audit in decentralized disputes.",
      ],
      solutionTitle: "Our solution",
      solutionPoints: [
        "EvidenceSnapshot hashes live URL content at open_case time.",
        "PromptRegistry stores eq-principle criteria others can reuse by id.",
        "cross_check re-fetches pages and flags tampering on Studionet.",
      ],
      forWhomTitle: "Who it's for",
      forWhom: [
        "Builders shipping GenLayer dispute & adjudication products",
        "Communities running Portal bounties and ecosystem demos",
        "Anyone proving web evidence integrity without a centralized notary",
      ],
      partnershipEyebrow: "Ecosystem partnership",
      partnershipTitle: "Made for the GenLayer ecosystem",
      partnershipBody:
        "Evidence Desk is not a standalone toy — it composes two ecosystem primitives into one product surface. It was built to demonstrate real GenLayer workflows for Portal Projects and to give builders a ready-made console for evidence + criteria.",
      partnershipPurpose:
        "Purpose: show how Intelligent Contracts, shared criteria, and a modern dApp fit together — so disputes can be resolved with frozen evidence and transparent rules, not screenshots in a chat.",
      partnerDesc: {
        genlayer: "Layer for Intelligent Contracts — LLM adjudication on-chain via Studionet.",
        snapshot: "Primitive contract: open_case, frozen hashes, cross_check tamper detection.",
        registry: "Shared eq-principle templates — publish, vote, get_body by template id.",
        portal: "GenLayer Foundation Portal — ecosystem contributions & builder rewards.",
      },
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
      crossCheckFetching: "Fetching live pages on Studionet…",
      crossCheckSubmitting: "Submitting cross_check…",
      crossCheckFailed: "cross_check failed",
      rateLimited: "Rate limit: wait {sec}s before another open_case (anti-spam)",
      readOnlyChain: "{chain} is read-only — switch to Studionet in the header to write.",
      loadMore: "Load more cases",
      showingCount: "Showing {n} of {total}",
      copiedHash: "Hash copied",
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
      filterTag: "Filter by tag",
      allTags: "All tags",
      sortBy: "Sort by",
      sortScore: "Score",
      sortUses: "Uses",
      sortRecent: "List order",
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
    theme: { light: "Light", dark: "Dark" },
    tooltips: {
      wallet: "Connect MetaMask — genlayer-js adds Studionet automatically",
      crossCheck: "Re-fetch live URLs on Studionet and flag tampering on-chain",
      connect: "Required for open_case and cross_check transactions",
    },
    ai: {
      title: "AI criteria assistant",
      subtitle: "Describe your case — get a draft criteria template to copy into PromptRegistry.",
      placeholder: "e.g. Verify Terms of Service page unchanged since agreement date…",
      generate: "Generate criteria draft",
      generated: "Criteria draft ready",
    },
    marketplace: {
      title: "Criteria marketplace",
      subtitle: "Ready-made KYC, AML, and legal template packs from the ecosystem.",
      note: "Free packs link to PromptRegistry templates — no token sales, just shared criteria.",
      add: "Browse templates",
    },
    rbac: {
      readOnly: "Viewer role — connect as Moderator or Admin to write (demo RBAC in localStorage).",
      role: "Role",
    },
    wizard: {
      title: "New evidence case",
      stepOf: "Step {n} of {total}",
      stepId: "Case ID",
      stepUrls: "Evidence URLs",
      stepReview: "Review & submit",
      next: "Next",
      back: "Back",
      cancel: "Cancel",
      add: "Add",
      noUrls: "Add at least one HTTPS URL",
      idHint: "Use letters, numbers, underscore, hyphen — max 64 chars.",
      reviewHint: "Submitting calls open_case on EvidenceSnapshot (Studionet).",
      openWizard: "Open case wizard",
    },
    faq: {
      title: "FAQ",
      subtitle: "Common questions about wallet, hashes, and transactions.",
      items: [
        {
          q: "MetaMask won't connect?",
          a: "Install MetaMask, refresh the page, click Connect Wallet. genlayer-js adds Studionet automatically — you don't need to add the network manually.",
        },
        {
          q: "Why did cross_check fail or take long?",
          a: "cross_check fetches live URLs on Studionet. Slow or blocked sites may timeout. Wait for the spinner, then use Retry. Check the case detail for tampered flags after success.",
        },
        {
          q: "Hash mismatch / unexpected tampered flag?",
          a: "Live page content changed since open_case — that's the point. CDN updates, A/B tests, and cookie banners can alter HTML. Re-open a case if you need a fresh snapshot.",
        },
        {
          q: "Transaction rejected or gas error?",
          a: "Studionet is gasless via Studio, but MetaMask must approve the request. Rejections mean you cancelled. Ensure you're connected and retry.",
        },
        {
          q: "Can I browse without a wallet?",
          a: "Yes — Cases and Criteria are read-only without MetaMask. Connect only for open_case and cross_check.",
        },
      ],
    },
    validation: {
      invalid_json: "Must be valid JSON array",
      empty_array: "Add at least one URL",
      too_many_urls: "Maximum 20 URLs per case",
      not_string: "Each URL must be a string",
      https_only: "Only HTTPS URLs allowed",
      url_too_long: "URL too long (max 2048 chars)",
    },
  },
  ua: {
    nav: {
      home: "Головна",
      cases: "Кейси",
      criteria: "Критерії",
      marketplace: "Marketplace",
      connect: "Підключити гаманець",
      connecting: "Підключення…",
      disconnect: "Відключити",
      copyAddress: "Копіювати адресу",
      copied: "Скопійовано!",
      connected: "Підключено",
      readOnly: "Лише читання",
      menuOpen: "Відкрити меню",
      menuClose: "Закрити меню",
    },
    footer: {
      tagline:
        "Консоль доказів для GenLayer — заморожуйте знімки URL, використовуйте eq-principle шаблони, доводьте зміни на ланцюгу.",
      product: "Продукт",
      resources: "Ресурси",
      contracts: "Контракти",
      liveDemo: "Живе демо",
      mit: "Ліцензія MIT",
      disclaimer:
        "Перегляд без гаманця доступний у режимі read-only. Підключіть MetaMask на Studionet для open_case та cross_check.",
    },
    breadcrumbs: {
      aria: "Навігаційний ланцюжок",
      home: "Головна",
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
        {
          title: "Докази на ланцюгу",
          desc: "Заморожуйте знімки URL з криптографічними хешами на Studionet.",
        },
        {
          title: "Спільні критерії",
          desc: "Переглядайте та копіюйте шаблони eq-principle з PromptRegistry.",
        },
        {
          title: "Виявлення змін",
          desc: "cross_check позначає, коли сторінки відрізняються від зафіксованих доказів.",
        },
      ],
      statsTitle: "Стан мережі",
      explorer: "Відкрити в Explorer",
      storyEyebrow: "Про продукт",
      storyTitle: "Один desk для доказів у спорах на GenLayer",
      storySubtitle:
        "Evidence Desk — жива консоль, не mock. Читає та пише в реальні контракти на Studionet, перетворюючи розрізнені URL та критерії на перевірений on-chain слід.",
      storySteps: [
        { title: "Захопити", desc: "Додайте HTTPS URL у кейс — web-докази входять у workflow." },
        {
          title: "Заморозити",
          desc: "EvidenceSnapshot зберігає хеш + preview, поки посилання ще працює.",
        },
        { title: "Критерії", desc: "Оберіть eq-principle шаблони з PromptRegistry за id." },
        {
          title: "Довести",
          desc: "Пізніше cross_check — прапор підміни, якщо сторінки змінились.",
        },
      ],
      storyQuote:
        "«Спорам потрібно більше, ніж скріншоти. Ми фіксуємо правду, додаємо спільні правила — і ланцюг записує, що змінилось.»",
      whatWeDoTitle: "Що ми робимо",
      whatWeDoIntro:
        "Перетворюємо докази у спорах на on-chain workflow: заморожуємо URL до «гниття», підключаємо спільні критерії та доводимо зміни контенту пізніше.",
      problemTitle: "Проблема",
      problemPoints: [
        "Посилання ламаються, сторінки змінюються — скріншоти легко оскаржити.",
        "Команди дублюють критерії — немає спільних перевірених шаблонів.",
        "Off-chain докази важко аудитувати в децентралізованих спорах.",
      ],
      solutionTitle: "Наше рішення",
      solutionPoints: [
        "EvidenceSnapshot хешує контент URL під час open_case.",
        "PromptRegistry зберігає eq-principle критерії для повторного використання за id.",
        "cross_check повторно завантажує сторінки та позначає підміну на Studionet.",
      ],
      forWhomTitle: "Для кого",
      forWhom: [
        "Білдери dispute/adjudication продуктів на GenLayer",
        "Спільнота Portal — баунті та демо екосистеми",
        "Усі, хто доводить цілісність web-доказів без централізованого нотаріуса",
      ],
      partnershipEyebrow: "Партнерство в екосистемі",
      partnershipTitle: "Створено для екосистеми GenLayer",
      partnershipBody:
        "Evidence Desk — не ізольований демо-проєкт. Він поєднує два примітиви екосистеми в одному продукті. Зроблено для Portal Projects і як готовa консоль «докази + критерії» для білдерів.",
      partnershipPurpose:
        "Мета: показати, як Intelligent Contracts, спільні критерії та сучасний dApp працюють разом — щоб спори вирішувались за замороженими доказами та прозорими правилами, а не скріншотами в чаті.",
      partnerDesc: {
        genlayer: "Шар Intelligent Contracts — LLM-адjudication на ланцюгу через Studionet.",
        snapshot: "Примітив: open_case, заморожені хеші, cross_check для виявлення підміни.",
        registry: "Спільні eq-principle шаблони — publish, vote, get_body за id.",
        portal: "GenLayer Foundation Portal — внески в екосистему та нагороди білдерам.",
      },
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
      crossCheckFetching: "Завантаження live-сторінок на Studionet…",
      crossCheckSubmitting: "Надсилання cross_check…",
      crossCheckFailed: "cross_check не вдався",
      rateLimited: "Ліміт: зачекайте {sec}с перед наступним open_case (anti-spam)",
      readOnlyChain: "{chain} — лише читання; для запису перемкніть Studionet у шапці.",
      loadMore: "Завантажити ще",
      showingCount: "Показано {n} з {total}",
      copiedHash: "Хеш скопійовано",
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
      filterTag: "Фільтр за тегом",
      allTags: "Усі теги",
      sortBy: "Сортування",
      sortScore: "Score",
      sortUses: "Uses",
      sortRecent: "Порядок списку",
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
    theme: { light: "Світла", dark: "Темна" },
    tooltips: {
      wallet: "Підключіть MetaMask — genlayer-js додасть Studionet автоматично",
      crossCheck: "Повторно завантажує live URL на Studionet і фіксує підміну on-chain",
      connect: "Потрібно для open_case та cross_check",
    },
    ai: {
      title: "AI-асистент критеріїв",
      subtitle: "Опишіть кейс — отримайте чернетку шаблону для PromptRegistry.",
      placeholder: "напр. Перевірити, що Terms of Service не змінились з дати угоди…",
      generate: "Згенерувати чернетку",
      generated: "Чернетку готово",
    },
    marketplace: {
      title: "Marketplace критеріїв",
      subtitle: "Готові пакети KYC, AML та legal з екосистеми.",
      note: "Безкоштовні пакети ведуть до шаблонів PromptRegistry — без продажу токенів.",
      add: "Переглянути шаблони",
    },
    rbac: {
      readOnly: "Роль Viewer — для запису оберіть Moderator або Admin (demo RBAC у localStorage).",
      role: "Роль",
    },
    wizard: {
      title: "Новий кейс доказів",
      stepOf: "Крок {n} з {total}",
      stepId: "ID кейсу",
      stepUrls: "URL доказів",
      stepReview: "Перевірка та submit",
      next: "Далі",
      back: "Назад",
      cancel: "Скасувати",
      add: "Додати",
      noUrls: "Додайте хоча б один HTTPS URL",
      idHint: "Літери, цифри, _, - — макс. 64 символи.",
      reviewHint: "Submit викликає open_case на EvidenceSnapshot (Studionet).",
      openWizard: "Майстер нового кейсу",
    },
    faq: {
      title: "FAQ",
      subtitle: "Поширені питання про гаманець, хеші та транзакції.",
      items: [
        {
          q: "MetaMask не підключається?",
          a: "Встановіть MetaMask, оновіть сторінку, натисніть Підключити. genlayer-js додасть Studionet автоматично.",
        },
        {
          q: "Чому cross_check довго або не вдався?",
          a: "cross_check завантажує live URL на Studionet. Повільні сайти можуть таймаутити. Дочекайтесь спінера і натисніть Повторити.",
        },
        {
          q: "Hash mismatch / несподіваний tampered?",
          a: "Контент сторінки змінився після open_case. CDN, A/B-тести та банери змінюють HTML. Відкрийте кейс знову для нового знімка.",
        },
        {
          q: "Транзакцію відхилено або gas error?",
          a: "Studionet gasless через Studio, але MetaMask має підтвердити запит. Відхилення = скасували ви. Підключіться і повторіть.",
        },
        {
          q: "Чи можна без гаманця?",
          a: "Так — Cases і Criteria read-only без MetaMask. Гаманець лише для open_case та cross_check.",
        },
      ],
    },
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
