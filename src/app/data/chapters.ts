export type Lang = 'en' | 'ta';
export type Bilingual = Record<Lang, string>;

export interface Chapter {
  no: number;
  volume: 1 | 2;
  symbol: string;
  title: Bilingual;
  formUrl: Bilingual;
}

export const CHAPTERS: Chapter[] = [
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
