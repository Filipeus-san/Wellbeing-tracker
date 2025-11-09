import type { Question, Language } from '../types';
import { WellbeingCategory } from '../types';
import { translations } from '../i18n/translations';

export const questions: Question[] = [
  // MASLOW - Hierarchie potřeb
  {
    id: 'maslow_physiological',
    category: WellbeingCategory.PHYSIOLOGICAL,
    text: 'Jak dobře jsi dnes uspokojil/a své základní potřeby? (spánek, jídlo, odpočinek)',
    model: 'maslow',
  },
  {
    id: 'maslow_safety',
    category: WellbeingCategory.SAFETY,
    text: 'Jak bezpečně a stabilně ses dnes cítil/a? (finance, zdraví, bydlení)',
    model: 'maslow',
  },
  {
    id: 'maslow_belonging',
    category: WellbeingCategory.BELONGING_MASLOW,
    text: 'Jak moc ses dnes cítil/a spojený/á s ostatními lidmi?',
    model: 'maslow',
  },
  {
    id: 'maslow_esteem',
    category: WellbeingCategory.ESTEEM,
    text: 'Jak si dnes vážíš sám/a sebe a svých úspěchů?',
    model: 'maslow',
  },
  {
    id: 'maslow_self_actualization',
    category: WellbeingCategory.SELF_ACTUALIZATION,
    text: 'Jak moc ses dnes přiblížil/a svému potenciálu a osobnímu růstu?',
    model: 'maslow',
  },

  // SDT - Self-Determination Theory
  {
    id: 'sdt_autonomy',
    category: WellbeingCategory.AUTONOMY,
    text: 'Měl/a jsi dnes svobodu rozhodovat o svých činnostech?',
    model: 'sdt',
  },
  {
    id: 'sdt_competence',
    category: WellbeingCategory.COMPETENCE,
    text: 'Cítil/a ses dnes kompetentní a schopný/á v tom, co děláš?',
    model: 'sdt',
  },
  {
    id: 'sdt_belonging',
    category: WellbeingCategory.BELONGING_SDT,
    text: 'Měl/a jsi dnes pocit sounáležitosti a podpory od druhých?',
    model: 'sdt',
  },

  // PERMA - Model wellbeingu
  {
    id: 'perma_positive_emotions',
    category: WellbeingCategory.POSITIVE_EMOTIONS,
    text: 'Kolik pozitivních emocí (radost, klid, nadšení) jsi dnes zažil/a?',
    model: 'perma',
  },
  {
    id: 'perma_engagement',
    category: WellbeingCategory.ENGAGEMENT,
    text: 'Jak moc ses dnes ponořil/a do aktivit, které tě baví (flow stav)?',
    model: 'perma',
  },
  {
    id: 'perma_relationships',
    category: WellbeingCategory.RELATIONSHIPS,
    text: 'Jaká byla kvalita tvých vztahů a interakcí dnes?',
    model: 'perma',
  },
  {
    id: 'perma_meaning',
    category: WellbeingCategory.MEANING,
    text: 'Měly tvé dnešní aktivity smysl a účel?',
    model: 'perma',
  },
  {
    id: 'perma_accomplishment',
    category: WellbeingCategory.ACCOMPLISHMENT,
    text: 'Kolik úspěchů a pokroku jsi dnes dosáhl/a?',
    model: 'perma',
  },
  {
    id: 'perma_exercise',
    category: WellbeingCategory.EXERCISE,
    text: 'Kolik pohybu a sportovních aktivit jsi dnes absolvoval/a?',
    model: 'perma',
  },

  // Praktické návyky v rámci Maslow
  {
    id: 'maslow_hygiene',
    category: WellbeingCategory.HYGIENE,
    text: 'Jak dobře ses dnes postaral/a o svou osobní hygienu?',
    model: 'maslow',
  },
  {
    id: 'maslow_cleaning',
    category: WellbeingCategory.CLEANING,
    text: 'Jak moc ses dnes postaral/a o úklid a pořádek ve svém prostředí?',
    model: 'maslow',
  },
  {
    id: 'maslow_addiction',
    category: WellbeingCategory.ADDICTION,
    text: 'Jak dobře se ti dnes dařilo zvládat/kontrolovat závislosti? (látková i nelátková)',
    model: 'maslow',
  },
  {
    id: 'maslow_illness',
    category: WellbeingCategory.ILLNESS,
    text: 'Jak se dnes fyzicky cítíš? Jsi zdravý/á nebo se cítíš nemocný/á?',
    model: 'maslow',
  },
];

export const getCategoryLabel = (category: WellbeingCategory, lang: Language = 'cs'): string => {
  const t = translations[lang];
  const mapping: Record<WellbeingCategory, string> = {
    [WellbeingCategory.PHYSIOLOGICAL]: t.categories.physiological,
    [WellbeingCategory.SAFETY]: t.categories.safety,
    [WellbeingCategory.BELONGING_MASLOW]: t.categories.belongingMaslow,
    [WellbeingCategory.ESTEEM]: t.categories.esteem,
    [WellbeingCategory.SELF_ACTUALIZATION]: t.categories.selfActualization,
    [WellbeingCategory.AUTONOMY]: t.categories.autonomy,
    [WellbeingCategory.COMPETENCE]: t.categories.competence,
    [WellbeingCategory.BELONGING_SDT]: t.categories.belongingSdt,
    [WellbeingCategory.POSITIVE_EMOTIONS]: t.categories.positiveEmotions,
    [WellbeingCategory.ENGAGEMENT]: t.categories.engagement,
    [WellbeingCategory.RELATIONSHIPS]: t.categories.relationships,
    [WellbeingCategory.MEANING]: t.categories.meaning,
    [WellbeingCategory.ACCOMPLISHMENT]: t.categories.accomplishment,
    [WellbeingCategory.CLEANING]: t.categories.cleaning,
    [WellbeingCategory.HYGIENE]: t.categories.hygiene,
    [WellbeingCategory.EXERCISE]: t.categories.exercise,
    [WellbeingCategory.ADDICTION]: t.categories.addiction,
    [WellbeingCategory.ILLNESS]: t.categories.illness,
  };
  return mapping[category];
};

export const getModelLabel = (model: 'maslow' | 'sdt' | 'perma', lang: Language = 'cs'): string => {
  const t = translations[lang];
  const labels = {
    maslow: t.models.maslow,
    sdt: t.models.sdt,
    perma: t.models.perma,
  };
  return labels[model];
};

export const getQuestionText = (questionId: string, lang: Language = 'cs'): string => {
  const t = translations[lang];
  const mapping: Record<string, string> = {
    'maslow_physiological': t.questions.maslowPhysiological,
    'maslow_safety': t.questions.maslowSafety,
    'maslow_belonging': t.questions.maslowBelonging,
    'maslow_esteem': t.questions.maslowEsteem,
    'maslow_self_actualization': t.questions.maslowSelfActualization,
    'sdt_autonomy': t.questions.sdtAutonomy,
    'sdt_competence': t.questions.sdtCompetence,
    'sdt_belonging': t.questions.sdtBelonging,
    'perma_positive_emotions': t.questions.permaPositiveEmotions,
    'perma_engagement': t.questions.permaEngagement,
    'perma_relationships': t.questions.permaRelationships,
    'perma_meaning': t.questions.permaMeaning,
    'perma_accomplishment': t.questions.permaAccomplishment,
    'perma_exercise': t.questions.permaExercise,
    'maslow_hygiene': t.questions.maslowHygiene,
    'maslow_cleaning': t.questions.maslowCleaning,
    'maslow_addiction': t.questions.maslowAddiction,
    'maslow_illness': t.questions.maslowIllness,
  };
  return mapping[questionId] || questions.find(q => q.id === questionId)?.text || questionId;
};
