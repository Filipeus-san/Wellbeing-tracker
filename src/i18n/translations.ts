export type Language = 'cs' | 'en';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
    today: string;
    week: string;
    month: string;
    year: string;
    aiPrivacyWarningTitle: string;
    aiPrivacyWarningMessage: string;
    aiPrivacyWarningConfirm: string;
    aiPrivacyWarningCancel: string;
  };

  // App
  app: {
    subtitle: string;
    footer: string;
  };

  // Navigation
  nav: {
    dailyQuestionnaire: string;
    weeklySummary: string;
    habits: string;
    settings: string;
  };

  // Daily Questionnaire
  daily: {
    title: string;
    selectDate: string;
    selectMood: string;
    moodLabel: string;
    anxietyLevel: string;
    depressionLevel: string;
    joyLevel: string;
    angerLevel: string;
    gratitudeLevel: string;
    none: string;
    extreme: string;
    notes: string;
    notesPlaceholder: string;
    saveButton: string;
    generateAiSummary: string;
    generating: string;
    aiCoach: string;
    recommendedActions: string;
  };

  // Weekly Summary
  weekly: {
    title: string;
    weekRange: string;
    filledDays: string;
    criticalAreas: string;
    microActions: string;
    aiWellbeingCoach: string;
    generateNewSummary: string;
    generateAiSummary: string;
    moodOverWeek: string;
    anxietyOverWeek: string;
    depressionOverWeek: string;
    joyOverWeek: string;
    angerOverWeek: string;
    gratitudeOverWeek: string;
    notSpecified: string;
    overallCategories: string;
    criticalAreasRequireAttention: string;
    recommendedMicroActions: string;
    detailedOverview: string;
    noDataForWeek: string;
    fillDailyToSeeStats: string;
    previousWeek: string;
    nextWeek: string;
    currentWeek: string;
    refresh: string;
    loadingWeeklyData: string;
  };

  // Habits
  habits: {
    title: string;
    description: string;
    addNew: string;
    name: string;
    namePlaceholder: string;
    habitDescription: string;
    descriptionPlaceholder: string;
    icon: string;
    empty: string;
    archive: string;
    confirmArchive: string;
    dailyHabits: string;
    activeDays: string;
    selectDays: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    everyDay: string;
    weeksOfMonth: string;
    selectWeeks: string;
    week1: string;
    week2: string;
    week3: string;
    week4: string;
    week5: string;
    everyWeek: string;
  };

  // Guide
  guide: {
    title: string;
  };

  // Donate
  donate: {
    title: string;
    description: string;
    alwaysFree: string;
    thankYou: string;
    scanQr: string;
  };

  // Settings
  settings: {
    title: string;
    language: string;
    selectLanguage: string;
    czech: string;
    english: string;
    aiIntegration: string;
    aiIntegrationDescription: string;
    enableAi: string;
    aiProvider: string;
    selectAiProvider: string;
    claude: string;
    codex: string;
    copilot: string;
    testConnection: string;
    testing: string;
    connectionSuccessful: string;
    connectionFailed: string;
    cliNotAvailable: string;
    cliUsesLocal: string;
    installClaude: string;
    installCodex: string;
    installCopilot: string;
    dataManagement: string;
    exportData: string;
    importData: string;
    clearAllData: string;
    confirmClearData: string;
    dataExported: string;
    dataImported: string;
    dataCleared: string;
    exportDescription: string;
    saveSettings: string;
    settingsSaved: string;
    aboutApp: string;
    appName: string;
    appDescription: string;
    dataStoredLocally: string;
    googleDriveSync: string;
    googleDriveSyncDescription: string;
    connectGoogleDrive: string;
    disconnectGoogleDrive: string;
    googleDriveConnected: string;
    googleDriveNotConnected: string;
    enableAutoSync: string;
    manualSync: string;
    uploadToGoogleDrive: string;
    downloadFromGoogleDrive: string;
    lastSync: string;
    syncNow: string;
    syncing: string;
    syncSuccessful: string;
    syncFailed: string;
    googleDriveInstructions: string;
    clientId: string;
    clientSecret: string;
    clientIdPlaceholder: string;
    clientSecretPlaceholder: string;
    enterAuthCode: string;
    authCodePlaceholder: string;
    authenticate: string;
    authenticating: string;
    authenticationSuccessful: string;
    authenticationFailed: string;
  };

  // Moods
  moods: {
    amazing: string;
    good: string;
    okay: string;
    bad: string;
    terrible: string;
  };

  // Anxiety levels
  anxiety: {
    none: string;
    minimal: string;
    mild: string;
    moderate: string;
    severe: string;
    extreme: string;
  };

  // Depression levels
  depression: {
    none: string;
    minimal: string;
    mild: string;
    moderate: string;
    severe: string;
    extreme: string;
  };

  // Joy levels
  joy: {
    none: string;
    minimal: string;
    mild: string;
    moderate: string;
    high: string;
    extreme: string;
  };

  // Anger levels
  anger: {
    none: string;
    minimal: string;
    mild: string;
    moderate: string;
    high: string;
    extreme: string;
  };

  // Gratitude levels
  gratitude: {
    none: string;
    minimal: string;
    mild: string;
    moderate: string;
    high: string;
    extreme: string;
  };

  // Wellbeing categories
  categories: {
    physiological: string;
    safety: string;
    belongingMaslow: string;
    esteem: string;
    selfActualization: string;
    autonomy: string;
    competence: string;
    belongingSdt: string;
    positiveEmotions: string;
    engagement: string;
    relationships: string;
    meaning: string;
    accomplishment: string;
    cleaning: string;
    hygiene: string;
    exercise: string;
    addiction: string;
    illness: string;
  };

  // Models
  models: {
    maslow: string;
    sdt: string;
    perma: string;
  };

  // Questions
  questions: {
    maslowPhysiological: string;
    maslowSafety: string;
    maslowBelonging: string;
    maslowEsteem: string;
    maslowSelfActualization: string;
    sdtAutonomy: string;
    sdtCompetence: string;
    sdtBelonging: string;
    permaPositiveEmotions: string;
    permaEngagement: string;
    permaRelationships: string;
    permaMeaning: string;
    permaAccomplishment: string;
    permaExercise: string;
    maslowHygiene: string;
    maslowCleaning: string;
    maslowAddiction: string;
    maslowIllness: string;
  };

  // Score labels
  scores: {
    veryLow: string;
    low: string;
    medium: string;
    high: string;
    veryHigh: string;
  };
}

export const translations: Record<Language, Translations> = {
  cs: {
    common: {
      save: 'Uložit',
      cancel: 'Zrušit',
      delete: 'Smazat',
      edit: 'Upravit',
      close: 'Zavřít',
      confirm: 'Potvrdit',
      loading: 'Načítání...',
      error: 'Chyba',
      success: 'Úspěch',
      today: 'Dnes',
      week: 'Týden',
      month: 'Měsíc',
      year: 'Rok',
      aiPrivacyWarningTitle: '⚠️ Upozornění o soukromí',
      aiPrivacyWarningMessage: 'Používáte jazykový model v cloudu. Jsem si vědom/a, že odesílám svá soukromá a citlivá data na vzdálený server třetí strany.\n\nVaše wellbeing data (odpovědi na dotazník, nálady, poznámky) budou odeslána k AI poskytovateli pro vytvoření personalizovaného shrnutí.\n\nChcete pokračovat?',
      aiPrivacyWarningConfirm: 'Rozumím, pokračovat',
      aiPrivacyWarningCancel: 'Zrušit',
    },
    app: {
      subtitle: 'Sleduj svoji duševní pohodu pomocí Maslow, SDT a PERMA',
      footer: 'Vytvořeno s ❤️ pro podporu duševní pohody | Data ukládána lokálně',
    },
    nav: {
      dailyQuestionnaire: 'Denní dotazník',
      weeklySummary: 'Týdenní shrnutí',
      habits: 'Návyky',
      settings: 'Nastavení',
    },
    daily: {
      title: 'Denní dotazník wellbeingu',
      selectDate: 'Vyberte datum',
      selectMood: 'Vyber svou náladu',
      moodLabel: 'Nálada',
      anxietyLevel: 'Míra úzkosti',
      depressionLevel: 'Míra deprese',
      joyLevel: 'Míra radosti',
      angerLevel: 'Míra vzteku',
      gratitudeLevel: 'Míra vděčnosti',
      none: 'Žádná',
      extreme: 'Extrémní',
      notes: 'Poznámky',
      notesPlaceholder: 'Zde můžeš napsat své myšlenky, pocity nebo cokoliv, co tě dnes napadlo...',
      saveButton: 'Uložit odpovědi',
      generateAiSummary: 'Vygenerovat AI shrnutí',
      generating: 'Generuji...',
      aiCoach: 'AI Wellbeing Kouč',
      recommendedActions: 'Doporučené akce na zítřek',
    },
    weekly: {
      title: 'Týdenní shrnutí',
      weekRange: 'Týden',
      filledDays: 'Vyplněných dní',
      criticalAreas: 'Kritické oblasti',
      microActions: 'Mikro-akce',
      aiWellbeingCoach: 'AI Wellbeing Kouč',
      generateNewSummary: 'Vygenerovat nové shrnutí',
      generateAiSummary: 'Vygenerovat AI shrnutí',
      moodOverWeek: 'Nálada v průběhu týdne',
      anxietyOverWeek: 'Úzkost v průběhu týdne',
      depressionOverWeek: 'Deprese v průběhu týdne',
      joyOverWeek: 'Radost v průběhu týdne',
      angerOverWeek: 'Vztek v průběhu týdne',
      gratitudeOverWeek: 'Vděčnost v průběhu týdne',
      notSpecified: 'Nezadáno',
      overallCategories: 'Celkový přehled kategorií',
      criticalAreasRequireAttention: 'Kritické oblasti (vyžadují pozornost)',
      recommendedMicroActions: 'Doporučené mikro-akce',
      detailedOverview: 'Detailní přehled všech otázek',
      noDataForWeek: 'Žádná data pro tento týden',
      fillDailyToSeeStats: 'Vyplňte denní dotazník pro alespoň jeden den tohoto týdne, abyste viděli týdenní statistiky.',
      previousWeek: 'Předchozí týden',
      nextWeek: 'Následující týden',
      currentWeek: 'Aktuální týden',
      refresh: 'Obnovit',
      loadingWeeklyData: 'Načítám týdenní data...',
    },
    habits: {
      title: 'Denní návyky',
      description: 'Spravujte své denní návyky. Budou se zobrazovat jako checklist v denním dotazníku.',
      addNew: 'Přidat nový návyk',
      name: 'Název návyku',
      namePlaceholder: 'např. Ranní meditace, Cvičení, Čtení...',
      habitDescription: 'Popis',
      descriptionPlaceholder: 'Volitelný popis návyku...',
      icon: 'Ikona',
      empty: 'Zatím nemáte žádné návyky. Přidejte první!',
      archive: 'Archivovat',
      confirmArchive: 'Opravdu chcete archivovat tento návyk?',
      dailyHabits: 'Denní návyky',
      activeDays: 'Aktivní dny',
      selectDays: 'Vyberte dny v týdnu',
      monday: 'Po',
      tuesday: 'Út',
      wednesday: 'St',
      thursday: 'Čt',
      friday: 'Pá',
      saturday: 'So',
      sunday: 'Ne',
      everyDay: 'Každý den',
      weeksOfMonth: 'Týdny v měsíci',
      selectWeeks: 'Vyberte týdny v měsíci',
      week1: '1.',
      week2: '2.',
      week3: '3.',
      week4: '4.',
      week5: '5.',
      everyWeek: 'Každý týden',
    },
    guide: {
      title: 'Návod na propojení s Google Diskem',
    },
    donate: {
      title: 'Podpořit vývoj',
      description: 'Wellbeing Tracker je a vždy bude zdarma. Pokud vám aplikace pomáhá, můžete podpořit další vývoj.',
      alwaysFree: 'Aplikace je a vždy bude zcela zdarma.',
      thankYou: 'Děkuji za vaši podporu! 🙏',
      scanQr: 'Naskenujte QR kód pro příspěvek:',
    },
    settings: {
      title: 'Nastavení',
      language: 'Jazyk',
      selectLanguage: 'Vyberte jazyk',
      czech: 'Čeština',
      english: 'Angličtina',
      aiIntegration: 'AI Integrace',
      aiIntegrationDescription: 'Zapněte integraci s AI pro personalizovaná shrnutí a doporučení. ⚠️ Upozornění: Vaše wellbeing data budou odeslána na vzdálený server třetí strany (AI poskytovatel) pro zpracování.',
      enableAi: 'Povolit AI integraci',
      aiProvider: 'AI Poskytovatel',
      selectAiProvider: 'Vyberte AI poskytovatele',
      claude: 'Claude CLI (Anthropic)',
      codex: 'Codex CLI (OpenAI)',
      copilot: 'GitHub Copilot CLI',
      testConnection: 'Otestovat připojení',
      testing: 'Testuji...',
      connectionSuccessful: 'CLI je dostupné',
      connectionFailed: 'CLI není dostupné',
      cliNotAvailable: 'není dostupné (nainstalujte',
      cliUsesLocal: 'Aplikace používá lokálně nainstalovaný',
      installClaude: 'Pokud Claude CLI není nainstalované, nainstalujte ho pomocí',
      installCodex: 'Pokud Codex CLI není nainstalované, nainstalujte ho pomocí',
      installCopilot: 'Pokud GitHub Copilot CLI není nainstalované, nainstalujte ho pomocí',
      dataManagement: 'Správa dat',
      exportData: 'Exportovat data (JSON)',
      importData: 'Importovat data',
      clearAllData: 'Smazat všechna data',
      confirmClearData: 'Opravdu chcete smazat všechna data? Tato akce je nevratná!\n\n(Nastavení zůstane zachováno)',
      dataExported: 'Data byla exportována',
      dataImported: 'Data byla úspěšně importována!',
      dataCleared: 'Data byla smazána.',
      exportDescription: 'Exportujte svá data jako zálohu nebo je importujte z předchozího exportu.',
      saveSettings: 'Uložit nastavení',
      settingsSaved: 'Nastavení bylo uloženo',
      aboutApp: 'O aplikaci',
      appName: 'Wellbeing Tracker - Desktop Aplikace',
      appDescription: 'Aplikace pro sledování duševní pohody založená na psychologických modelech Maslow, SDT a PERMA.',
      dataStoredLocally: 'Data jsou ukládána lokálně na vašem počítači v uživatelské složce.',
      googleDriveSync: 'Synchronizace s Google Diskem',
      googleDriveSyncDescription: 'Propojte svůj Google účet a automaticky synchronizujte data na Google Disk. Data zůstanou také uložená lokálně.',
      connectGoogleDrive: 'Připojit Google Drive',
      disconnectGoogleDrive: 'Odpojit Google Drive',
      googleDriveConnected: 'Google Drive připojen',
      googleDriveNotConnected: 'Google Drive není připojen',
      enableAutoSync: 'Povolit automatickou synchronizaci',
      manualSync: 'Manuální synchronizace',
      uploadToGoogleDrive: 'Nahrát na Google Drive',
      downloadFromGoogleDrive: 'Stáhnout z Google Drive',
      lastSync: 'Poslední synchronizace',
      syncNow: 'Synchronizovat nyní',
      syncing: 'Synchronizuji...',
      syncSuccessful: 'Synchronizace úspěšná',
      syncFailed: 'Synchronizace selhala',
      googleDriveInstructions: 'Pro propojení s Google Diskem potřebujete vytvořit OAuth2 aplikaci v Google Cloud Console a zadat Client ID a Client Secret.',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      clientIdPlaceholder: 'Zadejte Google OAuth2 Client ID',
      clientSecretPlaceholder: 'Zadejte Google OAuth2 Client Secret',
      enterAuthCode: 'Zadejte autorizační kód',
      authCodePlaceholder: 'Vložte sem autorizační kód z Google',
      authenticate: 'Autentikovat',
      authenticating: 'Autentikuji...',
      authenticationSuccessful: 'Autentikace úspěšná',
      authenticationFailed: 'Autentikace selhala',
    },
    moods: {
      amazing: 'Úžasná',
      good: 'Dobrá',
      okay: 'Tak akorát',
      bad: 'Špatná',
      terrible: 'Hrozná',
    },
    anxiety: {
      none: 'Žádná',
      minimal: 'Minimální',
      mild: 'Mírná',
      moderate: 'Střední',
      severe: 'Vysoká',
      extreme: 'Extrémní',
    },
    depression: {
      none: 'Žádná',
      minimal: 'Minimální',
      mild: 'Mírná',
      moderate: 'Střední',
      severe: 'Vysoká',
      extreme: 'Extrémní',
    },
    joy: {
      none: 'Žádná',
      minimal: 'Minimální',
      mild: 'Mírná',
      moderate: 'Střední',
      high: 'Vysoká',
      extreme: 'Extrémní',
    },
    anger: {
      none: 'Žádný',
      minimal: 'Minimální',
      mild: 'Mírný',
      moderate: 'Střední',
      high: 'Vysoký',
      extreme: 'Extrémní',
    },
    gratitude: {
      none: 'Žádná',
      minimal: 'Minimální',
      mild: 'Mírná',
      moderate: 'Střední',
      high: 'Vysoká',
      extreme: 'Extrémní',
    },
    categories: {
      physiological: 'Fyziologické potřeby',
      safety: 'Bezpečí',
      belongingMaslow: 'Sounáležitost (Maslow)',
      esteem: 'Sebeúcta',
      selfActualization: 'Seberealizace',
      autonomy: 'Autonomie',
      competence: 'Kompetence',
      belongingSdt: 'Sounáležitost (SDT)',
      positiveEmotions: 'Pozitivní emoce',
      engagement: 'Engagement',
      relationships: 'Vztahy',
      meaning: 'Smysl',
      accomplishment: 'Úspěchy',
      cleaning: 'Úklid',
      hygiene: 'Hygiena',
      exercise: 'Pohyb/Sport',
      addiction: 'Závislosti',
      illness: 'Zdraví/Nemoc',
    },
    models: {
      maslow: 'Maslow - Hierarchie potřeb',
      sdt: 'SDT - Teorie sebedeterminace',
      perma: 'PERMA - Model wellbeingu',
    },
    questions: {
      maslowPhysiological: 'Jak dobře jsi dnes uspokojil/a své základní potřeby? (spánek, jídlo, odpočinek)',
      maslowSafety: 'Jak bezpečně a stabilně ses dnes cítil/a? (finance, zdraví, bydlení)',
      maslowBelonging: 'Jak moc ses dnes cítil/a spojený/á s ostatními lidmi?',
      maslowEsteem: 'Jak si dnes vážíš sám/a sebe a svých úspěchů?',
      maslowSelfActualization: 'Jak moc ses dnes přiblížil/a svému potenciálu a osobnímu růstu?',
      sdtAutonomy: 'Měl/a jsi dnes svobodu rozhodovat o svých činnostech?',
      sdtCompetence: 'Cítil/a ses dnes kompetentní a schopný/á v tom, co děláš?',
      sdtBelonging: 'Měl/a jsi dnes pocit sounáležitosti a podpory od druhých?',
      permaPositiveEmotions: 'Kolik pozitivních emocí (radost, klid, nadšení) jsi dnes zažil/a?',
      permaEngagement: 'Jak moc ses dnes ponořil/a do aktivit, které tě baví (flow stav)?',
      permaRelationships: 'Jaká byla kvalita tvých vztahů a interakcí dnes?',
      permaMeaning: 'Měly tvé dnešní aktivity smysl a účel?',
      permaAccomplishment: 'Kolik úspěchů a pokroku jsi dnes dosáhl/a?',
      permaExercise: 'Kolik pohybu a sportovních aktivit jsi dnes absolvoval/a?',
      maslowHygiene: 'Jak dobře ses dnes postaral/a o svou osobní hygienu?',
      maslowCleaning: 'Jak moc ses dnes postaral/a o úklid a pořádek ve svém prostředí?',
      maslowAddiction: 'Jak dobře se ti dnes dařilo zvládat/kontrolovat závislosti? (látková i nelátková)',
      maslowIllness: 'Jak se dnes fyzicky cítíš? Jsi zdravý/á nebo se cítíš nemocný/á?',
    },
    scores: {
      veryLow: 'Velmi nízké',
      low: 'Nízké',
      medium: 'Střední',
      high: 'Vysoké',
      veryHigh: 'Velmi vysoké',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      aiPrivacyWarningTitle: '⚠️ Privacy Warning',
      aiPrivacyWarningMessage: 'You are using a cloud-based language model. I am aware that I am sending my private and sensitive data to a third-party remote server.\n\nYour wellbeing data (questionnaire responses, moods, notes) will be sent to the AI provider to generate a personalized summary.\n\nDo you want to continue?',
      aiPrivacyWarningConfirm: 'I understand, continue',
      aiPrivacyWarningCancel: 'Cancel',
    },
    app: {
      subtitle: 'Track your mental wellbeing with Maslow, SDT and PERMA',
      footer: 'Created with ❤️ for mental wellbeing support | Data stored locally',
    },
    nav: {
      dailyQuestionnaire: 'Daily Questionnaire',
      weeklySummary: 'Weekly Summary',
      habits: 'Habits',
      settings: 'Settings',
    },
    daily: {
      title: 'Daily Wellbeing Questionnaire',
      selectDate: 'Select date',
      selectMood: 'Select your mood',
      moodLabel: 'Mood',
      anxietyLevel: 'Anxiety Level',
      depressionLevel: 'Depression Level',
      joyLevel: 'Joy Level',
      angerLevel: 'Anger Level',
      gratitudeLevel: 'Gratitude Level',
      none: 'None',
      extreme: 'Extreme',
      notes: 'Notes',
      notesPlaceholder: 'Write down your thoughts, feelings, or anything on your mind today...',
      saveButton: 'Save Responses',
      generateAiSummary: 'Generate AI Summary',
      generating: 'Generating...',
      aiCoach: 'AI Wellbeing Coach',
      recommendedActions: 'Recommended Actions for Tomorrow',
    },
    weekly: {
      title: 'Weekly Summary',
      weekRange: 'Week',
      filledDays: 'Days Filled',
      criticalAreas: 'Critical Areas',
      microActions: 'Micro-Actions',
      aiWellbeingCoach: 'AI Wellbeing Coach',
      generateNewSummary: 'Generate New Summary',
      generateAiSummary: 'Generate AI Summary',
      moodOverWeek: 'Mood Throughout the Week',
      anxietyOverWeek: 'Anxiety Throughout the Week',
      depressionOverWeek: 'Depression Throughout the Week',
      joyOverWeek: 'Joy Throughout the Week',
      angerOverWeek: 'Anger Throughout the Week',
      gratitudeOverWeek: 'Gratitude Throughout the Week',
      notSpecified: 'Not specified',
      overallCategories: 'Overall Category Overview',
      criticalAreasRequireAttention: 'Critical Areas (Require Attention)',
      recommendedMicroActions: 'Recommended Micro-Actions',
      detailedOverview: 'Detailed Overview of All Questions',
      noDataForWeek: 'No Data for This Week',
      fillDailyToSeeStats: 'Fill out the daily questionnaire for at least one day this week to see weekly statistics.',
      previousWeek: 'Previous Week',
      nextWeek: 'Next Week',
      currentWeek: 'Current Week',
      refresh: 'Refresh',
      loadingWeeklyData: 'Loading weekly data...',
    },
    habits: {
      title: 'Daily Habits',
      description: 'Manage your daily habits. They will appear as a checklist in the daily questionnaire.',
      addNew: 'Add New Habit',
      name: 'Habit Name',
      namePlaceholder: 'e.g. Morning meditation, Exercise, Reading...',
      habitDescription: 'Description',
      descriptionPlaceholder: 'Optional habit description...',
      icon: 'Icon',
      empty: 'You don\'t have any habits yet. Add your first one!',
      archive: 'Archive',
      confirmArchive: 'Are you sure you want to archive this habit?',
      dailyHabits: 'Daily Habits',
      activeDays: 'Active Days',
      selectDays: 'Select days of the week',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
      everyDay: 'Every day',
      weeksOfMonth: 'Weeks of Month',
      selectWeeks: 'Select weeks of the month',
      week1: '1st',
      week2: '2nd',
      week3: '3rd',
      week4: '4th',
      week5: '5th',
      everyWeek: 'Every week',
    },
    guide: {
      title: 'Google Drive Setup Guide',
    },
    donate: {
      title: 'Support Development',
      description: 'Wellbeing Tracker is and always will be free. If the app helps you, you can support further development.',
      alwaysFree: 'The app is and always will be completely free.',
      thankYou: 'Thank you for your support! 🙏',
      scanQr: 'Scan the QR code to donate:',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      selectLanguage: 'Select Language',
      czech: 'Czech',
      english: 'English',
      aiIntegration: 'AI Integration',
      aiIntegrationDescription: 'Enable AI integration for personalized summaries and recommendations. ⚠️ Warning: Your wellbeing data will be sent to a third-party remote server (AI provider) for processing.',
      enableAi: 'Enable AI Integration',
      aiProvider: 'AI Provider',
      selectAiProvider: 'Select AI Provider',
      claude: 'Claude CLI (Anthropic)',
      codex: 'Codex CLI (OpenAI)',
      copilot: 'GitHub Copilot CLI',
      testConnection: 'Test Connection',
      testing: 'Testing...',
      connectionSuccessful: 'CLI is available',
      connectionFailed: 'CLI is not available',
      cliNotAvailable: 'is not available (install',
      cliUsesLocal: 'The application uses locally installed',
      installClaude: 'If Claude CLI is not installed, install it using',
      installCodex: 'If Codex CLI is not installed, install it using',
      installCopilot: 'If GitHub Copilot CLI is not installed, install it using',
      dataManagement: 'Data Management',
      exportData: 'Export Data (JSON)',
      importData: 'Import Data',
      clearAllData: 'Clear All Data',
      confirmClearData: 'Are you sure you want to delete all data? This action is irreversible!\n\n(Settings will remain preserved)',
      dataExported: 'Data has been exported',
      dataImported: 'Data was successfully imported!',
      dataCleared: 'Data has been cleared.',
      exportDescription: 'Export your data as a backup or import it from a previous export.',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings have been saved',
      aboutApp: 'About the App',
      appName: 'Wellbeing Tracker - Desktop Application',
      appDescription: 'An application for tracking mental wellbeing based on the psychological models of Maslow, SDT, and PERMA.',
      dataStoredLocally: 'Data is stored locally on your computer in the user folder.',
      googleDriveSync: 'Google Drive Sync',
      googleDriveSyncDescription: 'Connect your Google account and automatically sync data to Google Drive. Data will also remain stored locally.',
      connectGoogleDrive: 'Connect Google Drive',
      disconnectGoogleDrive: 'Disconnect Google Drive',
      googleDriveConnected: 'Google Drive connected',
      googleDriveNotConnected: 'Google Drive not connected',
      enableAutoSync: 'Enable automatic sync',
      manualSync: 'Manual sync',
      uploadToGoogleDrive: 'Upload to Google Drive',
      downloadFromGoogleDrive: 'Download from Google Drive',
      lastSync: 'Last sync',
      syncNow: 'Sync now',
      syncing: 'Syncing...',
      syncSuccessful: 'Sync successful',
      syncFailed: 'Sync failed',
      googleDriveInstructions: 'To connect to Google Drive, you need to create an OAuth2 application in Google Cloud Console and enter the Client ID and Client Secret.',
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      clientIdPlaceholder: 'Enter Google OAuth2 Client ID',
      clientSecretPlaceholder: 'Enter Google OAuth2 Client Secret',
      enterAuthCode: 'Enter authorization code',
      authCodePlaceholder: 'Paste the authorization code from Google',
      authenticate: 'Authenticate',
      authenticating: 'Authenticating...',
      authenticationSuccessful: 'Authentication successful',
      authenticationFailed: 'Authentication failed',
    },
    moods: {
      amazing: 'Amazing',
      good: 'Good',
      okay: 'Okay',
      bad: 'Bad',
      terrible: 'Terrible',
    },
    anxiety: {
      none: 'None',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      extreme: 'Extreme',
    },
    depression: {
      none: 'None',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      extreme: 'Extreme',
    },
    joy: {
      none: 'None',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      high: 'High',
      extreme: 'Extreme',
    },
    anger: {
      none: 'None',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      high: 'High',
      extreme: 'Extreme',
    },
    gratitude: {
      none: 'None',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      high: 'High',
      extreme: 'Extreme',
    },
    categories: {
      physiological: 'Physiological Needs',
      safety: 'Safety',
      belongingMaslow: 'Belonging (Maslow)',
      esteem: 'Esteem',
      selfActualization: 'Self-Actualization',
      autonomy: 'Autonomy',
      competence: 'Competence',
      belongingSdt: 'Belonging (SDT)',
      positiveEmotions: 'Positive Emotions',
      engagement: 'Engagement',
      relationships: 'Relationships',
      meaning: 'Meaning',
      accomplishment: 'Accomplishment',
      cleaning: 'Cleaning',
      hygiene: 'Hygiene',
      exercise: 'Exercise/Sports',
      addiction: 'Addictions',
      illness: 'Health/Illness',
    },
    models: {
      maslow: 'Maslow - Hierarchy of Needs',
      sdt: 'SDT - Self-Determination Theory',
      perma: 'PERMA - Wellbeing Model',
    },
    questions: {
      maslowPhysiological: 'How well did you meet your basic needs today? (sleep, food, rest)',
      maslowSafety: 'How safe and stable did you feel today? (finances, health, housing)',
      maslowBelonging: 'How connected did you feel to other people today?',
      maslowEsteem: 'How much do you value yourself and your achievements today?',
      maslowSelfActualization: 'How close did you get to your potential and personal growth today?',
      sdtAutonomy: 'Did you have the freedom to make decisions about your activities today?',
      sdtCompetence: 'Did you feel competent and capable in what you do today?',
      sdtBelonging: 'Did you feel a sense of belonging and support from others today?',
      permaPositiveEmotions: 'How many positive emotions (joy, peace, excitement) did you experience today?',
      permaEngagement: 'How immersed were you in activities you enjoy today (flow state)?',
      permaRelationships: 'What was the quality of your relationships and interactions today?',
      permaMeaning: 'Did your activities today have meaning and purpose?',
      permaAccomplishment: 'How much success and progress did you achieve today?',
      permaExercise: 'How much movement and sports activities did you do today?',
      maslowHygiene: 'How well did you take care of your personal hygiene today?',
      maslowCleaning: 'How much did you take care of cleaning and tidiness in your environment today?',
      maslowAddiction: 'How well did you manage/control addictions today? (substance and non-substance)',
      maslowIllness: 'How do you feel physically today? Are you healthy or feeling sick?',
    },
    scores: {
      veryLow: 'Very Low',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      veryHigh: 'Very High',
    },
  },
};
