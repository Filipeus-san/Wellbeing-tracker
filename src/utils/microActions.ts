import type { MicroAction, Language } from '../types';
import { WellbeingCategory } from '../types';
import { questions } from '../data/questions';

/**
 * Překlady pro mikro-akce
 */
const microActionTranslations: Record<string, { title: { cs: string; en: string }; description: { cs: string; en: string } }> = {
  physio_1: { title: { cs: 'Kvalitní spánek', en: 'Quality Sleep' }, description: { cs: 'Spi alespoň 7-8 hodin. Jdi spát ve stejnou dobu každý den.', en: 'Sleep at least 7-8 hours. Go to bed at the same time every day.' } },
  physio_2: { title: { cs: 'Pravidelné jídlo', en: 'Regular Meals' }, description: { cs: 'Sněz 3 vyvážená jídla denně. Nezapomeň na snídani.', en: 'Eat 3 balanced meals daily. Don\'t skip breakfast.' } },
  physio_3: { title: { cs: 'Hydratace', en: 'Hydration' }, description: { cs: 'Vypij alespoň 2 litry vody denně.', en: 'Drink at least 2 liters of water daily.' } },
  physio_4: { title: { cs: '10 minut pohybu', en: '10 Minutes Movement' }, description: { cs: 'Krátká procházka, protažení nebo lehké cvičení.', en: 'Short walk, stretching, or light exercise.' } },
  safety_1: { title: { cs: 'Finanční plán', en: 'Financial Plan' }, description: { cs: 'Udělej si přehled příjmů a výdajů na tento týden.', en: 'Review your income and expenses for this week.' } },
  safety_2: { title: { cs: 'Úklid prostoru', en: 'Space Cleaning' }, description: { cs: 'Uklid si svůj pracovní nebo osobní prostor.', en: 'Clean your work or personal space.' } },
  safety_3: { title: { cs: 'Zdravotní check', en: 'Health Check' }, description: { cs: 'Naplánuj nebo absolvuj preventivní lékařskou prohlídku.', en: 'Schedule or attend a preventive medical checkup.' } },
  belong_m_1: { title: { cs: 'Kontakt s blízkými', en: 'Contact Loved Ones' }, description: { cs: 'Zavolej nebo napiš člověku, na kterém ti záleží.', en: 'Call or text someone you care about.' } },
  belong_m_2: { title: { cs: 'Společenská aktivita', en: 'Social Activity' }, description: { cs: 'Zúčastni se skupinové aktivity nebo srazu s přáteli.', en: 'Join a group activity or meet with friends.' } },
  belong_m_3: { title: { cs: 'Pomoc druhým', en: 'Help Others' }, description: { cs: 'Udělej něco milého pro někoho z tvého okolí.', en: 'Do something nice for someone around you.' } },
  esteem_1: { title: { cs: 'Seznam úspěchů', en: 'Success List' }, description: { cs: 'Zapiš si 3 věci, které se ti dnes/tento týden povedly.', en: 'Write down 3 things that went well today/this week.' } },
  esteem_2: { title: { cs: 'Pozitivní afirmace', en: 'Positive Affirmations' }, description: { cs: 'Řekni si 3 pozitivní věci o sobě, třeba před zrcadlem.', en: 'Tell yourself 3 positive things, perhaps in the mirror.' } },
  esteem_3: { title: { cs: 'Dokončení úkolu', en: 'Complete a Task' }, description: { cs: 'Dokončí jeden malý úkol, který odkládáš.', en: 'Finish one small task you\'ve been postponing.' } },
  selfact_1: { title: { cs: 'Učení se nové dovednosti', en: 'Learn New Skill' }, description: { cs: 'Věnuj 20 minut učení něčeho nového, co tě zajímá.', en: 'Spend 20 minutes learning something new that interests you.' } },
  selfact_2: { title: { cs: 'Kreativní aktivita', en: 'Creative Activity' }, description: { cs: 'Věnuj se tvorbě - kreslení, psaní, hudba, cokoliv tě baví.', en: 'Engage in creation - drawing, writing, music, whatever you enjoy.' } },
  selfact_3: { title: { cs: 'Reflexe hodnot', en: 'Reflect on Values' }, description: { cs: 'Zamysli se, jestli tvoje aktivity odpovídají tvým hodnotám.', en: 'Reflect on whether your activities align with your values.' } },
  autonomy_1: { title: { cs: 'Vlastní rozhodnutí', en: 'Own Decision' }, description: { cs: 'Udělej dnes alespoň jedno rozhodnutí nezávisle na ostatních.', en: 'Make at least one decision independently today.' } },
  autonomy_2: { title: { cs: 'Volný čas', en: 'Free Time' }, description: { cs: 'Naplánuj si 30 minut, kdy budeš dělat přesně to, co chceš.', en: 'Schedule 30 minutes to do exactly what you want.' } },
  autonomy_3: { title: { cs: 'Stanovení hranic', en: 'Set Boundaries' }, description: { cs: 'Řekni "ne" něčemu, co nechceš dělat.', en: 'Say "no" to something you don\'t want to do.' } },
  competence_1: { title: { cs: 'Procvičení dovednosti', en: 'Practice a Skill' }, description: { cs: 'Věnuj se aktivitě, ve které jsi dobrý/á.', en: 'Engage in an activity you\'re good at.' } },
  competence_2: { title: { cs: 'Malý výzva', en: 'Small Challenge' }, description: { cs: 'Zkus něco trochu náročnějšího, ale dosažitelného.', en: 'Try something slightly challenging but achievable.' } },
  competence_3: { title: { cs: 'Zpětná vazba', en: 'Feedback' }, description: { cs: 'Požádej někoho o konstruktivní zpětnou vazbu.', en: 'Ask someone for constructive feedback.' } },
  belong_s_1: { title: { cs: 'Kvalitní konverzace', en: 'Quality Conversation' }, description: { cs: 'Pokecej si s někým o něčem smysluplném alespoň 15 minut.', en: 'Have a meaningful conversation with someone for at least 15 minutes.' } },
  belong_s_2: { title: { cs: 'Sdílení zážitku', en: 'Share Experience' }, description: { cs: 'Sdílej s někým svůj zážitek nebo emoci.', en: 'Share your experience or emotion with someone.' } },
  belong_s_3: { title: { cs: 'Poděkování', en: 'Give Thanks' }, description: { cs: 'Poděkuj někomu za podporu nebo pomoc.', en: 'Thank someone for their support or help.' } },
  posemo_1: { title: { cs: 'Gratitude journal', en: 'Gratitude Journal' }, description: { cs: 'Zapiš si 3 věci, za které jsi dnes vděčný/á.', en: 'Write down 3 things you\'re grateful for today.' } },
  posemo_2: { title: { cs: 'Příjemná aktivita', en: 'Pleasant Activity' }, description: { cs: 'Udělej něco, co tě spolehlivě rozveselí (hudba, komiks, pořad).', en: 'Do something that reliably cheers you up (music, comics, show).' } },
  posemo_3: { title: { cs: 'Smích', en: 'Laughter' }, description: { cs: 'Podívej se na něco vtipného nebo si s někým zasmějte.', en: 'Watch something funny or laugh with someone.' } },
  engage_1: { title: { cs: 'Flow aktivita', en: 'Flow Activity' }, description: { cs: 'Věnuj se 30 minut aktivitě, která tě pohltí (hobby, práce).', en: 'Spend 30 minutes on an activity that absorbs you (hobby, work).' } },
  engage_2: { title: { cs: 'Zaměření', en: 'Focus' }, description: { cs: 'Vypni rušivé elementy a soustřeď se na jednu věc.', en: 'Turn off distractions and focus on one thing.' } },
  engage_3: { title: { cs: 'Tvůrčí projekt', en: 'Creative Project' }, description: { cs: 'Začni nebo pokračuj v nějakém projektu, který tě baví.', en: 'Start or continue a project you enjoy.' } },
  relation_1: { title: { cs: 'Aktivní naslouchání', en: 'Active Listening' }, description: { cs: 'Při příštím rozhovoru aktivně naslouchej bez přerušování.', en: 'Actively listen in your next conversation without interrupting.' } },
  relation_2: { title: { cs: 'Společný čas', en: 'Quality Time' }, description: { cs: 'Naplánuj aktivitu s někým blízkým.', en: 'Plan an activity with someone close to you.' } },
  relation_3: { title: { cs: 'Komplement', en: 'Compliment' }, description: { cs: 'Dej upřímný komplement někomu ve svém okolí.', en: 'Give a sincere compliment to someone around you.' } },
  meaning_1: { title: { cs: 'Smysluplný projekt', en: 'Meaningful Project' }, description: { cs: 'Věnuj čas projektu nebo aktivitě, která má pro tebe hluboký význam.', en: 'Dedicate time to a project or activity that has deep meaning for you.' } },
  meaning_2: { title: { cs: 'Hodnoty', en: 'Values' }, description: { cs: 'Zapiš si 3 své hlavní životní hodnoty a zkontroluj, jestli podle nich žiješ.', en: 'Write down your 3 main life values and check if you\'re living by them.' } },
  meaning_3: { title: { cs: 'Pomoc komunitě', en: 'Help Community' }, description: { cs: 'Udělej něco pro širší komunitu nebo dobrou věc.', en: 'Do something for the broader community or a good cause.' } },
  accomp_1: { title: { cs: 'Denní cíl', en: 'Daily Goal' }, description: { cs: 'Nastav si jeden jasný, dosažitelný cíl na dnes a splň ho.', en: 'Set one clear, achievable goal for today and accomplish it.' } },
  accomp_2: { title: { cs: 'Oslavení úspěchu', en: 'Celebrate Success' }, description: { cs: 'Oslaví něco, co se ti nedávno povedlo, i kdyby to bylo malé.', en: 'Celebrate something you recently accomplished, even if small.' } },
  accomp_3: { title: { cs: 'Pokrok tracking', en: 'Track Progress' }, description: { cs: 'Zaznamenej si pokrok v nějakém dlouhodobém cíli.', en: 'Record progress on a long-term goal.' } },
  cleaning_1: { title: { cs: 'Denní úklid', en: 'Daily Cleaning' }, description: { cs: 'Věnuj 15 minut úklidu - ukliď pracovní prostor nebo jednu místnost.', en: 'Spend 15 minutes cleaning - tidy workspace or one room.' } },
  cleaning_2: { title: { cs: 'Uspořádání věcí', en: 'Organize Items' }, description: { cs: 'Roztřiď a uspořádej věci na jednom místě (stůl, šuplík, police).', en: 'Sort and organize items in one place (desk, drawer, shelf).' } },
  cleaning_3: { title: { cs: 'Vyhození nepotřebných věcí', en: 'Discard Unneeded Items' }, description: { cs: 'Projdi jednu oblast a zbav se 5 věcí, které už nepotřebuješ.', en: 'Go through one area and get rid of 5 things you no longer need.' } },
  hygiene_1: { title: { cs: 'Ranní rutina', en: 'Morning Routine' }, description: { cs: 'Začni den sprchováním a kompletní ranní hygienou.', en: 'Start the day with a shower and complete morning hygiene.' } },
  hygiene_2: { title: { cs: 'Péče o zuby', en: 'Dental Care' }, description: { cs: 'Vyčisti si zuby alespoň 2x denně a použ zubní nit.', en: 'Brush your teeth at least 2x daily and use dental floss.' } },
  hygiene_3: { title: { cs: 'Péče o tělo', en: 'Body Care' }, description: { cs: 'Věnuj čas péči o kůži, vlasy nebo nehty.', en: 'Spend time on skin, hair, or nail care.' } },
  exercise_1: { title: { cs: 'Denní procházka', en: 'Daily Walk' }, description: { cs: 'Jdi na 20-30 minutovou procházku na čerstvém vzduchu.', en: 'Go for a 20-30 minute walk in fresh air.' } },
  exercise_2: { title: { cs: 'Protažení', en: 'Stretching' }, description: { cs: 'Věnuj 10 minut protahování nebo lehké józe.', en: 'Spend 10 minutes stretching or doing light yoga.' } },
  exercise_3: { title: { cs: 'Aktivní cvičení', en: 'Active Exercise' }, description: { cs: 'Zacvič si alespoň 20 minut - běh, posilovna, sport.', en: 'Exercise for at least 20 minutes - running, gym, sports.' } },
  addiction_1: { title: { cs: 'Monitoring spouštěčů', en: 'Monitor Triggers' }, description: { cs: 'Zaznamenej si situace, které vyvolávají touhu po závislosti.', en: 'Record situations that trigger addiction cravings.' } },
  addiction_2: { title: { cs: 'Náhradní aktivita', en: 'Alternative Activity' }, description: { cs: 'Když cítíš touhu, udělej něco jiného - procházka, cvičení, volání příteli.', en: 'When you feel a craving, do something else - walk, exercise, call a friend.' } },
  addiction_3: { title: { cs: 'Podpora skupiny', en: 'Support Group' }, description: { cs: 'Kontaktuj podporující osobu nebo skupinu, když se cítíš slabý/á.', en: 'Contact a supportive person or group when feeling weak.' } },
  addiction_4: { title: { cs: 'Odstranění spouštěčů', en: 'Remove Triggers' }, description: { cs: 'Identifikuj a odstraň věci/situace, které podporují závislost.', en: 'Identify and remove things/situations that support addiction.' } },
  addiction_5: { title: { cs: 'Denní úspěch', en: 'Daily Success' }, description: { cs: 'Oslavuj každý den bez závislosti - zapiš si to a pochval se.', en: 'Celebrate each day without addiction - write it down and praise yourself.' } },
  illness_1: { title: { cs: 'Odpočinek', en: 'Rest' }, description: { cs: 'Dopřej si dostatek odpočinku a spánku pro regeneraci těla.', en: 'Get enough rest and sleep for body recovery.' } },
  illness_2: { title: { cs: 'Hydratace', en: 'Hydration' }, description: { cs: 'Pij dostatek tekutin - voda, čaj, polévky.', en: 'Drink plenty of fluids - water, tea, soups.' } },
  illness_3: { title: { cs: 'Lékařská pomoc', en: 'Medical Help' }, description: { cs: 'Pokud se cítíš velmi špatně, kontaktuj lékaře nebo zdravotní poradnu.', en: 'If feeling very unwell, contact a doctor or health center.' } },
  illness_4: { title: { cs: 'Lehká strava', en: 'Light Diet' }, description: { cs: 'Jez lehká, výživná jídla, která ti dodají energii a podpoří imunitu.', en: 'Eat light, nutritious foods that provide energy and support immunity.' } },
  illness_5: { title: { cs: 'Prevence', en: 'Prevention' }, description: { cs: 'Mysli na prevenci - vitamíny, odpočinek, mytí rukou, čerstvý vzduch.', en: 'Think about prevention - vitamins, rest, hand washing, fresh air.' } },
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
