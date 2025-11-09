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

  // Settings
  settings: {
    title: string;
    language: string;
    selectLanguage: string;
    czech: string;
    english: string;
    aiIntegration: string;
    enableAi: string;
    aiProvider: string;
    claude: string;
    codex: string;
    testConnection: string;
    testing: string;
    connectionSuccessful: string;
    connectionFailed: string;
    dataManagement: string;
    exportData: string;
    importData: string;
    clearAllData: string;
    confirmClearData: string;
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
    },
    app: {
      subtitle: 'Sleduj svoji duševní pohodu pomocí Maslow, SDT a PERMA',
      footer: 'Vytvořeno s ❤️ pro podporu duševní pohody | Data ukládána lokálně',
    },
    nav: {
      dailyQuestionnaire: 'Denní dotazník',
      weeklySummary: 'Týdenní shrnutí',
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
    settings: {
      title: 'Nastavení',
      language: 'Jazyk',
      selectLanguage: 'Vyberte jazyk',
      czech: 'Čeština',
      english: 'Angličtina',
      aiIntegration: 'AI Integrace',
      enableAi: 'Povolit AI integraci',
      aiProvider: 'AI Poskytovatel',
      claude: 'Claude CLI',
      codex: 'Codex CLI',
      testConnection: 'Otestovat připojení',
      testing: 'Testuji...',
      connectionSuccessful: 'Připojení úspěšné',
      connectionFailed: 'Připojení selhalo',
      dataManagement: 'Správa dat',
      exportData: 'Exportovat data',
      importData: 'Importovat data',
      clearAllData: 'Smazat všechna data',
      confirmClearData: 'Opravdu chcete smazat všechna data? Tato akce je nevratná.',
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
    },
    app: {
      subtitle: 'Track your mental wellbeing with Maslow, SDT and PERMA',
      footer: 'Created with ❤️ for mental wellbeing support | Data stored locally',
    },
    nav: {
      dailyQuestionnaire: 'Daily Questionnaire',
      weeklySummary: 'Weekly Summary',
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
    settings: {
      title: 'Settings',
      language: 'Language',
      selectLanguage: 'Select Language',
      czech: 'Czech',
      english: 'English',
      aiIntegration: 'AI Integration',
      enableAi: 'Enable AI Integration',
      aiProvider: 'AI Provider',
      claude: 'Claude CLI',
      codex: 'Codex CLI',
      testConnection: 'Test Connection',
      testing: 'Testing...',
      connectionSuccessful: 'Connection Successful',
      connectionFailed: 'Connection Failed',
      dataManagement: 'Data Management',
      exportData: 'Export Data',
      importData: 'Import Data',
      clearAllData: 'Clear All Data',
      confirmClearData: 'Are you sure you want to delete all data? This action is irreversible.',
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
