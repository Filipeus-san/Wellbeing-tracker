import type { MicroAction, Language } from '../types';
import { WellbeingCategory } from '../types';
import { questions } from '../data/questions';

/**
 * Překlady pro mikro-akce
 */
const microActionTranslations: Record<string, { title: { cs: string; en: string }; description: { cs: string; en: string } }> = {
  // Již existující české texty zůstanou jako fallback
  physio_1: {
    title: { cs: 'Kvalitní spánek', en: 'Quality Sleep' },
    description: { cs: 'Spi alespoň 7-8 hodin. Jdi spát ve stejnou dobu každý den.', en: 'Sleep at least 7-8 hours. Go to bed at the same time every day.' }
  },
  physio_2: {
    title: { cs: 'Pravidelné jídlo', en: 'Regular Meals' },
    description: { cs: 'Sněz 3 vyvážená jídla denně. Nezapomeň na snídani.', en: 'Eat 3 balanced meals daily. Don\'t skip breakfast.' }
  },
  physio_3: {
    title: { cs: 'Hydratace', en: 'Hydration' },
    description: { cs: 'Vypij alespoň 2 litry vody denně.', en: 'Drink at least 2 liters of water daily.' }
  },
  physio_4: {
    title: { cs: '10 minut pohybu', en: '10 Minutes Movement' },
    description: { cs: 'Krátká procházka, protažení nebo lehké cvičení.', en: 'Short walk, stretching, or light exercise.' }
  },
  safety_1: {
    title: { cs: 'Finanční plán', en: 'Financial Plan' },
    description: { cs: 'Udělej si přehled příjmů a výdajů na tento týden.', en: 'Review your income and expenses for this week.' }
  },
  safety_2: {
    title: { cs: 'Úklid prostoru', en: 'Space Cleaning' },
    description: { cs: 'Uklid si svůj pracovní nebo osobní prostor.', en: 'Clean your work or personal space.' }
  },
  safety_3: {
    title: { cs: 'Zdravotní check', en: 'Health Check' },
    description: { cs: 'Naplánuj nebo absolvuj preventivní lékařskou prohlídku.', en: 'Schedule or attend a preventive medical checkup.' }
  },
};

export const getMicroActionText = (actionId: string, field: 'title' | 'description', lang: Language = 'cs'): string => {
  const translation = microActionTranslations[actionId];
  if (translation) {
    return translation[field][lang];
  }
  // Fallback pro akce které nemají překlad
  return actionId;
};

/**
 * Databáze mikro-akcí pro každou kategorii
 */
const microActionsDatabase: Record<WellbeingCategory, MicroAction[]> = {
  [WellbeingCategory.PHYSIOLOGICAL]: [
    {
      id: 'physio_1',
      title: 'Kvalitní spánek',
      description: 'Spi alespoň 7-8 hodin. Jdi spát ve stejnou dobu každý den.',
      category: WellbeingCategory.PHYSIOLOGICAL,
      priority: 'high',
    },
    {
      id: 'physio_2',
      title: 'Pravidelné jídlo',
      description: 'Sněz 3 vyvážená jídla denně. Nezapomeň na snídani.',
      category: WellbeingCategory.PHYSIOLOGICAL,
      priority: 'high',
    },
    {
      id: 'physio_3',
      title: 'Hydratace',
      description: 'Vypij alespoň 2 litry vody denně.',
      category: WellbeingCategory.PHYSIOLOGICAL,
      priority: 'medium',
    },
    {
      id: 'physio_4',
      title: '10 minut pohybu',
      description: 'Krátká procházka, protažení nebo lehké cvičení.',
      category: WellbeingCategory.PHYSIOLOGICAL,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.SAFETY]: [
    {
      id: 'safety_1',
      title: 'Finanční plán',
      description: 'Udělej si přehled příjmů a výdajů na tento týden.',
      category: WellbeingCategory.SAFETY,
      priority: 'high',
    },
    {
      id: 'safety_2',
      title: 'Úklid prostoru',
      description: 'Uklid si svůj pracovní nebo osobní prostor.',
      category: WellbeingCategory.SAFETY,
      priority: 'medium',
    },
    {
      id: 'safety_3',
      title: 'Zdravotní check',
      description: 'Naplánuj nebo absolvuj preventivní lékařskou prohlídku.',
      category: WellbeingCategory.SAFETY,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.BELONGING_MASLOW]: [
    {
      id: 'belong_m_1',
      title: 'Kontakt s blízkými',
      description: 'Zavolej nebo napiš člověku, na kterém ti záleží.',
      category: WellbeingCategory.BELONGING_MASLOW,
      priority: 'high',
    },
    {
      id: 'belong_m_2',
      title: 'Společenská aktivita',
      description: 'Zúčastni se skupinové aktivity nebo srazu s přáteli.',
      category: WellbeingCategory.BELONGING_MASLOW,
      priority: 'medium',
    },
    {
      id: 'belong_m_3',
      title: 'Pomoc druhým',
      description: 'Udělej něco milého pro někoho z tvého okolí.',
      category: WellbeingCategory.BELONGING_MASLOW,
      priority: 'low',
    },
  ],
  [WellbeingCategory.ESTEEM]: [
    {
      id: 'esteem_1',
      title: 'Seznam úspěchů',
      description: 'Zapiš si 3 věci, které se ti dnes/tento týden povedly.',
      category: WellbeingCategory.ESTEEM,
      priority: 'high',
    },
    {
      id: 'esteem_2',
      title: 'Pozitivní afirmace',
      description: 'Řekni si 3 pozitivní věci o sobě, třeba před zrcadlem.',
      category: WellbeingCategory.ESTEEM,
      priority: 'medium',
    },
    {
      id: 'esteem_3',
      title: 'Dokončení úkolu',
      description: 'Dokončí jeden malý úkol, který odkládáš.',
      category: WellbeingCategory.ESTEEM,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.SELF_ACTUALIZATION]: [
    {
      id: 'selfact_1',
      title: 'Učení se nové dovednosti',
      description: 'Věnuj 20 minut učení něčeho nového, co tě zajímá.',
      category: WellbeingCategory.SELF_ACTUALIZATION,
      priority: 'medium',
    },
    {
      id: 'selfact_2',
      title: 'Kreativní aktivita',
      description: 'Věnuj se tvorbě - kreslení, psaní, hudba, cokoliv tě baví.',
      category: WellbeingCategory.SELF_ACTUALIZATION,
      priority: 'low',
    },
    {
      id: 'selfact_3',
      title: 'Reflexe hodnot',
      description: 'Zamysli se, jestli tvoje aktivity odpovídají tvým hodnotám.',
      category: WellbeingCategory.SELF_ACTUALIZATION,
      priority: 'low',
    },
  ],
  [WellbeingCategory.AUTONOMY]: [
    {
      id: 'autonomy_1',
      title: 'Vlastní rozhodnutí',
      description: 'Udělej dnes alespoň jedno rozhodnutí nezávisle na ostatních.',
      category: WellbeingCategory.AUTONOMY,
      priority: 'high',
    },
    {
      id: 'autonomy_2',
      title: 'Volný čas',
      description: 'Naplánuj si 30 minut, kdy budeš dělat přesně to, co chceš.',
      category: WellbeingCategory.AUTONOMY,
      priority: 'medium',
    },
    {
      id: 'autonomy_3',
      title: 'Stanovení hranic',
      description: 'Řekni "ne" něčemu, co nechceš dělat.',
      category: WellbeingCategory.AUTONOMY,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.COMPETENCE]: [
    {
      id: 'competence_1',
      title: 'Procvičení dovednosti',
      description: 'Věnuj se aktivitě, ve které jsi dobrý/á.',
      category: WellbeingCategory.COMPETENCE,
      priority: 'high',
    },
    {
      id: 'competence_2',
      title: 'Malý výzva',
      description: 'Zkus něco trochu náročnějšího, ale dosažitelného.',
      category: WellbeingCategory.COMPETENCE,
      priority: 'medium',
    },
    {
      id: 'competence_3',
      title: 'Zpětná vazba',
      description: 'Požádej někoho o konstruktivní zpětnou vazbu.',
      category: WellbeingCategory.COMPETENCE,
      priority: 'low',
    },
  ],
  [WellbeingCategory.BELONGING_SDT]: [
    {
      id: 'belong_s_1',
      title: 'Kvalitní konverzace',
      description: 'Pokecej si s někým o něčem smysluplném alespoň 15 minut.',
      category: WellbeingCategory.BELONGING_SDT,
      priority: 'high',
    },
    {
      id: 'belong_s_2',
      title: 'Sdílení zážitku',
      description: 'Sdílej s někým svůj zážitek nebo emoci.',
      category: WellbeingCategory.BELONGING_SDT,
      priority: 'medium',
    },
    {
      id: 'belong_s_3',
      title: 'Poděkování',
      description: 'Poděkuj někomu za podporu nebo pomoc.',
      category: WellbeingCategory.BELONGING_SDT,
      priority: 'low',
    },
  ],
  [WellbeingCategory.POSITIVE_EMOTIONS]: [
    {
      id: 'posemo_1',
      title: 'Gratitude journal',
      description: 'Zapiš si 3 věci, za které jsi dnes vděčný/á.',
      category: WellbeingCategory.POSITIVE_EMOTIONS,
      priority: 'high',
    },
    {
      id: 'posemo_2',
      title: 'Příjemná aktivita',
      description: 'Udělej něco, co tě spolehlivě rozveselí (hudba, komiks, pořad).',
      category: WellbeingCategory.POSITIVE_EMOTIONS,
      priority: 'medium',
    },
    {
      id: 'posemo_3',
      title: 'Smích',
      description: 'Podívej se na něco vtipného nebo si s někým zasmějte.',
      category: WellbeingCategory.POSITIVE_EMOTIONS,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.ENGAGEMENT]: [
    {
      id: 'engage_1',
      title: 'Flow aktivita',
      description: 'Věnuj se 30 minut aktivitě, která tě pohltí (hobby, práce).',
      category: WellbeingCategory.ENGAGEMENT,
      priority: 'high',
    },
    {
      id: 'engage_2',
      title: 'Zaměření',
      description: 'Vypni rušivé elementy a soustřeď se na jednu věc.',
      category: WellbeingCategory.ENGAGEMENT,
      priority: 'medium',
    },
    {
      id: 'engage_3',
      title: 'Tvůrčí projekt',
      description: 'Začni nebo pokračuj v nějakém projektu, který tě baví.',
      category: WellbeingCategory.ENGAGEMENT,
      priority: 'low',
    },
  ],
  [WellbeingCategory.RELATIONSHIPS]: [
    {
      id: 'relation_1',
      title: 'Aktivní naslouchání',
      description: 'Při příštím rozhovoru aktivně naslouchej bez přerušování.',
      category: WellbeingCategory.RELATIONSHIPS,
      priority: 'high',
    },
    {
      id: 'relation_2',
      title: 'Společný čas',
      description: 'Naplánuj aktivitu s někým blízkým.',
      category: WellbeingCategory.RELATIONSHIPS,
      priority: 'medium',
    },
    {
      id: 'relation_3',
      title: 'Komplement',
      description: 'Dej upřímný komplement někomu ve svém okolí.',
      category: WellbeingCategory.RELATIONSHIPS,
      priority: 'low',
    },
  ],
  [WellbeingCategory.MEANING]: [
    {
      id: 'meaning_1',
      title: 'Smysluplný projekt',
      description: 'Věnuj čas projektu nebo aktivitě, která má pro tebe hluboký význam.',
      category: WellbeingCategory.MEANING,
      priority: 'high',
    },
    {
      id: 'meaning_2',
      title: 'Hodnoty',
      description: 'Zapiš si 3 své hlavní životní hodnoty a zkontroluj, jestli podle nich žiješ.',
      category: WellbeingCategory.MEANING,
      priority: 'medium',
    },
    {
      id: 'meaning_3',
      title: 'Pomoc komunitě',
      description: 'Udělej něco pro širší komunitu nebo dobrou věc.',
      category: WellbeingCategory.MEANING,
      priority: 'low',
    },
  ],
  [WellbeingCategory.ACCOMPLISHMENT]: [
    {
      id: 'accomp_1',
      title: 'Denní cíl',
      description: 'Nastav si jeden jasný, dosažitelný cíl na dnes a splň ho.',
      category: WellbeingCategory.ACCOMPLISHMENT,
      priority: 'high',
    },
    {
      id: 'accomp_2',
      title: 'Oslavení úspěchu',
      description: 'Oslaví něco, co se ti nedávno povedlo, i kdyby to bylo malé.',
      category: WellbeingCategory.ACCOMPLISHMENT,
      priority: 'medium',
    },
    {
      id: 'accomp_3',
      title: 'Pokrok tracking',
      description: 'Zaznamenej si pokrok v nějakém dlouhodobém cíli.',
      category: WellbeingCategory.ACCOMPLISHMENT,
      priority: 'low',
    },
  ],
  [WellbeingCategory.CLEANING]: [
    {
      id: 'cleaning_1',
      title: 'Denní úklid',
      description: 'Věnuj 15 minut úklidu - ukliď pracovní prostor nebo jednu místnost.',
      category: WellbeingCategory.CLEANING,
      priority: 'high',
    },
    {
      id: 'cleaning_2',
      title: 'Uspořádání věcí',
      description: 'Roztřiď a uspořádej věci na jednom místě (stůl, šuplík, police).',
      category: WellbeingCategory.CLEANING,
      priority: 'medium',
    },
    {
      id: 'cleaning_3',
      title: 'Vyhození nepotřebných věcí',
      description: 'Projdi jednu oblast a zbav se 5 věcí, které už nepotřebuješ.',
      category: WellbeingCategory.CLEANING,
      priority: 'low',
    },
  ],
  [WellbeingCategory.HYGIENE]: [
    {
      id: 'hygiene_1',
      title: 'Ranní rutina',
      description: 'Začni den sprchováním a kompletní ranní hygienou.',
      category: WellbeingCategory.HYGIENE,
      priority: 'high',
    },
    {
      id: 'hygiene_2',
      title: 'Péče o zuby',
      description: 'Vyčisti si zuby alespoň 2x denně a použ zubní nit.',
      category: WellbeingCategory.HYGIENE,
      priority: 'high',
    },
    {
      id: 'hygiene_3',
      title: 'Péče o tělo',
      description: 'Věnuj čas péči o kůži, vlasy nebo nehty.',
      category: WellbeingCategory.HYGIENE,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.EXERCISE]: [
    {
      id: 'exercise_1',
      title: 'Denní procházka',
      description: 'Jdi na 20-30 minutovou procházku na čerstvém vzduchu.',
      category: WellbeingCategory.EXERCISE,
      priority: 'high',
    },
    {
      id: 'exercise_2',
      title: 'Protažení',
      description: 'Věnuj 10 minut protahování nebo lehké józe.',
      category: WellbeingCategory.EXERCISE,
      priority: 'medium',
    },
    {
      id: 'exercise_3',
      title: 'Aktivní cvičení',
      description: 'Zacvič si alespoň 20 minut - běh, posilovna, sport.',
      category: WellbeingCategory.EXERCISE,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.ADDICTION]: [
    {
      id: 'addiction_1',
      title: 'Monitoring spouštěčů',
      description: 'Zaznamenej si situace, které vyvolávají touhu po závislosti.',
      category: WellbeingCategory.ADDICTION,
      priority: 'high',
    },
    {
      id: 'addiction_2',
      title: 'Náhradní aktivita',
      description: 'Když cítíš touhu, udělej něco jiného - procházka, cvičení, volání příteli.',
      category: WellbeingCategory.ADDICTION,
      priority: 'high',
    },
    {
      id: 'addiction_3',
      title: 'Podpora skupiny',
      description: 'Kontaktuj podporující osobu nebo skupinu, když se cítíš slabý/á.',
      category: WellbeingCategory.ADDICTION,
      priority: 'medium',
    },
    {
      id: 'addiction_4',
      title: 'Odstranění spouštěčů',
      description: 'Identifikuj a odstraň věci/situace, které podporují závislost.',
      category: WellbeingCategory.ADDICTION,
      priority: 'high',
    },
    {
      id: 'addiction_5',
      title: 'Denní úspěch',
      description: 'Oslavuj každý den bez závislosti - zapiš si to a pochval se.',
      category: WellbeingCategory.ADDICTION,
      priority: 'medium',
    },
  ],
  [WellbeingCategory.ILLNESS]: [
    {
      id: 'illness_1',
      title: 'Odpočinek',
      description: 'Dopřej si dostatek odpočinku a spánku pro regeneraci těla.',
      category: WellbeingCategory.ILLNESS,
      priority: 'high',
    },
    {
      id: 'illness_2',
      title: 'Hydratace',
      description: 'Pij dostatek tekutin - voda, čaj, polévky.',
      category: WellbeingCategory.ILLNESS,
      priority: 'high',
    },
    {
      id: 'illness_3',
      title: 'Lékařská pomoc',
      description: 'Pokud se cítíš velmi špatně, kontaktuj lékaře nebo zdravotní poradnu.',
      category: WellbeingCategory.ILLNESS,
      priority: 'high',
    },
    {
      id: 'illness_4',
      title: 'Lehká strava',
      description: 'Jez lehká, výživná jídla, která ti dodají energii a podpoří imunitu.',
      category: WellbeingCategory.ILLNESS,
      priority: 'medium',
    },
    {
      id: 'illness_5',
      title: 'Prevence',
      description: 'Mysli na prevenci - vitamíny, odpočinek, mytí rukou, čerstvý vzduch.',
      category: WellbeingCategory.ILLNESS,
      priority: 'medium',
    },
  ],
};

/**
 * Vygeneruje mikro-akce na základě skóre a kritických oblastí
 */
export const generateMicroActions = (
  averages: Record<string, number>,
  criticalAreas: Array<{ questionId: string; score: number }>
): MicroAction[] => {
  const actions: MicroAction[] = [];
  const categoriesProcessed = new Set<WellbeingCategory>();

  // 1. Prioritizovat kritické oblasti
  criticalAreas.slice(0, 3).forEach(({ questionId }) => {
    const question = questions.find((q) => q.id === questionId);
    if (question && !categoriesProcessed.has(question.category)) {
      const categoryActions = microActionsDatabase[question.category];
      if (categoryActions.length > 0) {
        // Vybrat náhodnou akci z kategorie (nebo první high priority)
        const highPriorityAction = categoryActions.find((a) => a.priority === 'high');
        actions.push(highPriorityAction || categoryActions[0]);
        categoriesProcessed.add(question.category);
      }
    }
  });

  // 2. Přidat obecné mikro-rituály pro základní potřeby
  if (!categoriesProcessed.has(WellbeingCategory.PHYSIOLOGICAL)) {
    const physioActions = microActionsDatabase[WellbeingCategory.PHYSIOLOGICAL];
    actions.push(physioActions[0]); // Spánek
  }

  // 3. Doplnit do max 5 akcí
  if (actions.length < 5) {
    const allQuestions = questions.filter(
      (q) => averages[q.id] !== undefined && !categoriesProcessed.has(q.category)
    );

    // Seřadit podle skóre
    allQuestions.sort((a, b) => (averages[a.id] || 5) - (averages[b.id] || 5));

    allQuestions.slice(0, 5 - actions.length).forEach((question) => {
      if (!categoriesProcessed.has(question.category)) {
        const categoryActions = microActionsDatabase[question.category];
        if (categoryActions.length > 0) {
          const mediumPriorityAction = categoryActions.find((a) => a.priority === 'medium');
          actions.push(mediumPriorityAction || categoryActions[0]);
          categoriesProcessed.add(question.category);
        }
      }
    });
  }

  return actions.slice(0, 5); // Max 5 akcí
};
