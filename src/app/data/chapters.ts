export type Lang = 'en' | 'ta';
export type Bilingual = Record<Lang, string>;

export type Standard = 11 | 12;

export interface Chapter {
  std: Standard;
  no: number;
  volume: 1 | 2;
  symbol: string;
  title: Bilingual;
  /** `en` is optional: when missing, the Tamil-medium form is used for both languages. */
  formUrl: { en?: string; ta: string };
}

const CLASS_12: Omit<Chapter, 'std'>[] = [
  { no: 1, volume: 1, symbol: 'Mt', title: { en: 'Metallurgy', ta: 'உலோகவியல்' }, formUrl: { en: 'https://forms.gle/xuh6TBpy8hd7KQ4R8', ta: 'https://forms.gle/C22DnwoACLKXE9gx8' } },
  { no: 2, volume: 1, symbol: 'Pa', title: { en: 'p-Block Elements – I', ta: 'p-தொகுதி தனிமங்கள் – I' }, formUrl: { en: 'https://forms.gle/qeH2mknuCPdBzdQB9', ta: 'https://forms.gle/QDEjjm54MFRsixyh6' } },
  { no: 3, volume: 1, symbol: 'Pb', title: { en: 'p-Block Elements – II', ta: 'p-தொகுதி தனிமங்கள் – II' }, formUrl: { en: 'https://forms.gle/qvUCwDmGxke6YajB6', ta: 'https://forms.gle/L17mFnLPCyYRRHVw9' } },
  { no: 4, volume: 1, symbol: 'Tr', title: { en: 'Transition and Inner Transition Elements', ta: 'இடைநிலை மற்றும் உள் இடைநிலைத் தனிமங்கள்' }, formUrl: { en: 'https://forms.gle/Et5fMKxJsuf8iXuW9', ta: 'https://forms.gle/hiGJ5ikTBZuDob777' } },
  { no: 5, volume: 1, symbol: 'Co', title: { en: 'Coordination Chemistry', ta: 'அணைவு வேதியியல்' }, formUrl: { en: 'https://forms.gle/5sPvAFxdkjR7erdt7', ta: 'https://forms.gle/dJbSfdQunXjqabBj9' } },
  { no: 6, volume: 1, symbol: 'Ss', title: { en: 'Solid State', ta: 'திட நிலைமை' }, formUrl: { en: 'https://forms.gle/cHARyemHAtGHKk6GA', ta: 'https://forms.gle/Gi3RHWqLKQpnHpz37' } },
  { no: 7, volume: 1, symbol: 'Ck', title: { en: 'Chemical Kinetics', ta: 'வேதிவினை வேகவியல்' }, formUrl: { en: 'https://forms.gle/6YGCrHiTUAKMogGy5', ta: 'https://forms.gle/ipLyomEL4MH1Mmy38' } },
  { no: 8, volume: 2, symbol: 'Ie', title: { en: 'Ionic Equilibrium', ta: 'அயனிச் சமநிலை' }, formUrl: { en: 'https://forms.gle/CQYVyuWsU4gDRwGD7', ta: 'https://forms.gle/MFMC6qTrNNuWt7Yr6' } },
  { no: 9, volume: 2, symbol: 'Ec', title: { en: 'Electrochemistry', ta: 'மின் வேதியியல்' }, formUrl: { en: 'https://forms.gle/XvkQSQxHSsBRS5v98', ta: 'https://forms.gle/mwd4rr8Dbw29XKUZ7' } },
  { no: 10, volume: 2, symbol: 'Sc', title: { en: 'Surface Chemistry', ta: 'புறப்பரப்பு வேதியியல்' }, formUrl: { en: 'https://forms.gle/FeZJEBndv2BkpWVz7', ta: 'https://forms.gle/1NXMr5nXiACqf4sQA' } },
  { no: 11, volume: 2, symbol: 'Hy', title: { en: 'Hydroxy Compounds and Ethers', ta: 'ஹைட்ராக்ஸி சேர்மங்கள் மற்றும் ஈதர்கள்' }, formUrl: { en: 'https://forms.gle/KCzUj771Y1UPBigo7', ta: 'https://forms.gle/deyfYG7GiK7nS49L7' } },
  { no: 12, volume: 2, symbol: 'Cb', title: { en: 'Carbonyl Compounds and Carboxylic Acids', ta: 'கார்பனைல் சேர்மங்கள் மற்றும் கார்பாக்சிலிக் அமிலங்கள்' }, formUrl: { en: 'https://forms.gle/KYM3MxfWD76JNg128', ta: 'https://forms.gle/jbZ9WQGfKNL25MQN6' } },
  { no: 13, volume: 2, symbol: 'On', title: { en: 'Organic Nitrogen Compounds', ta: 'கரிம நைட்ரஜன் சேர்மங்கள்' }, formUrl: { en: 'https://forms.gle/7npxagQXHkkSzNFS6', ta: 'https://forms.gle/ugU2V4rsvjn5X5BU9' } },
  { no: 14, volume: 2, symbol: 'Bm', title: { en: 'Biomolecules', ta: 'உயிரியல் மூலக்கூறுகள்' }, formUrl: { en: 'https://forms.gle/2Ys4MFapJqnYdn2k6', ta: 'https://forms.gle/kimDjHvWoXMBzWt79' } },
  { no: 15, volume: 2, symbol: 'El', title: { en: 'Chemistry in Everyday Life', ta: 'அன்றாட வாழ்வில் வேதியியல்' }, formUrl: { en: 'https://forms.gle/5bJ768Vn3AqUfC458', ta: 'https://forms.gle/T4fxfx2sbCoPdHAz7' } },
];

/** Class 11 – Tamil-medium links from "11 CHEMISTRY QUIZ LINK.pdf". Add `en` links when available. */
const CLASS_11: Omit<Chapter, 'std'>[] = [
  { no: 1, volume: 1, symbol: 'Bc', title: { en: 'Basic Concepts of Chemistry and Chemical Calculations', ta: 'வேதியியலின் அடிப்படைக் கருத்துக்கள் மற்றும் வேதிக் கணக்கீடுகள்' }, formUrl: { ta: 'https://forms.gle/icSF3ypc1voqrTgW6' } },
  { no: 2, volume: 1, symbol: 'Qm', title: { en: 'Quantum Mechanical Model of Atom', ta: 'அணுவின் குவாண்டம் இயக்கவியல் மாதிரி' }, formUrl: { ta: 'https://forms.gle/mY3q9tPWcs9Rjb3T7' } },
  { no: 3, volume: 1, symbol: 'Pc', title: { en: 'Periodic Classification of Elements', ta: 'தனிமங்களின் ஆவர்த்தன வகைப்பாடு' }, formUrl: { ta: 'https://forms.gle/bHN8kJdP2GzyjC2k7' } },
  { no: 4, volume: 1, symbol: 'H', title: { en: 'Hydrogen', ta: 'ஹைட்ரஜன்' }, formUrl: { ta: 'https://forms.gle/oHDaKxQDwuHkxx2N7' } },
  { no: 5, volume: 1, symbol: 'Ak', title: { en: 'Alkali and Alkaline Earth Metals', ta: 'கார மற்றும் காரமண் உலோகங்கள்' }, formUrl: { ta: 'https://forms.gle/RDwm6ZNf6ihpSx4e6' } },
  { no: 6, volume: 1, symbol: 'Gs', title: { en: 'Gaseous State', ta: 'வாயு நிலைமை' }, formUrl: { ta: 'https://forms.gle/z6QczgDYEao38kS7A' } },
  { no: 7, volume: 1, symbol: 'Td', title: { en: 'Thermodynamics', ta: 'வெப்ப இயக்கவியல்' }, formUrl: { ta: 'https://forms.gle/89MKJ94m6e6WCDFb7' } },
  { no: 8, volume: 2, symbol: 'Eq', title: { en: 'Physical and Chemical Equilibrium', ta: 'இயற் மற்றும் வேதிச்சமநிலை' }, formUrl: { ta: 'https://forms.gle/M8Z4dQEdkBeeKC73A' } },
  { no: 9, volume: 2, symbol: 'So', title: { en: 'Solutions', ta: 'கரைசல்கள்' }, formUrl: { ta: 'https://forms.gle/feEZFQwja1A4dAEg6' } },
  { no: 10, volume: 2, symbol: 'Cb', title: { en: 'Chemical Bonding', ta: 'வேதிப் பிணைப்புகள்' }, formUrl: { ta: 'https://forms.gle/DiWorw1PnksQuQMk7' } },
  { no: 11, volume: 2, symbol: 'Fo', title: { en: 'Fundamentals of Organic Chemistry', ta: 'கரிம வேதியியலின் அடிப்படைகள்' }, formUrl: { ta: 'https://forms.gle/Cc9SvZRK3HPoM52P9' } },
  { no: 12, volume: 2, symbol: 'Or', title: { en: 'Basic Concepts of Organic Reactions', ta: 'கரிம வேதி வினைகளின் அடிப்படைக் கருத்துக்கள்' }, formUrl: { ta: 'https://forms.gle/5147ZL1yhMqRrjof7' } },
  { no: 13, volume: 2, symbol: 'Hc', title: { en: 'Hydrocarbons', ta: 'ஹைட்ரோகார்பன்கள்' }, formUrl: { ta: 'https://forms.gle/wwpJXjoAqJoc3qv29' } },
  { no: 14, volume: 2, symbol: 'Ha', title: { en: 'Haloalkanes and Haloarenes', ta: 'ஹேலோ ஆல்கேன்கள் மற்றும் ஹேலோ அரீன்கள்' }, formUrl: { ta: 'https://forms.gle/Tx5LGEbxwu2eDXJz9' } },
  { no: 15, volume: 2, symbol: 'En', title: { en: 'Environmental Chemistry', ta: 'சுற்றுச் சூழல்வேதியியல்' }, formUrl: { ta: 'https://forms.gle/sKtXF6QZ8BYYm5iNA' } },
];

export const CHAPTERS: Chapter[] = [
  ...CLASS_12.map(c => ({ ...c, std: 12 as const })),
  ...CLASS_11.map(c => ({ ...c, std: 11 as const })),
];
