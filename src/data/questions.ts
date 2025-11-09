import type { Question } from '../types';
import { WellbeingCategory } from '../types';

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
];

export const getCategoryLabel = (category: WellbeingCategory): string => {
  const labels: Record<WellbeingCategory, string> = {
    [WellbeingCategory.PHYSIOLOGICAL]: 'Fyziologické potřeby',
    [WellbeingCategory.SAFETY]: 'Bezpečí',
    [WellbeingCategory.BELONGING_MASLOW]: 'Sounáležitost (Maslow)',
    [WellbeingCategory.ESTEEM]: 'Sebeúcta',
    [WellbeingCategory.SELF_ACTUALIZATION]: 'Seberealizace',
    [WellbeingCategory.AUTONOMY]: 'Autonomie',
    [WellbeingCategory.COMPETENCE]: 'Kompetence',
    [WellbeingCategory.BELONGING_SDT]: 'Sounáležitost (SDT)',
    [WellbeingCategory.POSITIVE_EMOTIONS]: 'Pozitivní emoce',
    [WellbeingCategory.ENGAGEMENT]: 'Engagement',
    [WellbeingCategory.RELATIONSHIPS]: 'Vztahy',
    [WellbeingCategory.MEANING]: 'Smysl',
    [WellbeingCategory.ACCOMPLISHMENT]: 'Úspěchy',
  };
  return labels[category];
};

export const getModelLabel = (model: 'maslow' | 'sdt' | 'perma'): string => {
  const labels = {
    maslow: 'Maslow - Hierarchie potřeb',
    sdt: 'SDT - Teorie sebedeterminace',
    perma: 'PERMA - Model wellbeingu',
  };
  return labels[model];
};
