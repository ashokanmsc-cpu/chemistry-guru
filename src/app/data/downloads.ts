import { Bilingual } from './chapters';

export interface Download {
  /** File name inside public/downloads/. */
  file: string;
  title: Bilingual;
  description: Bilingual;
  medium: Bilingual;
  pages: number;
  /** Size label shown on the card, e.g. '2.1 MB'. */
  size: string;
}

export const DOWNLOADS: Download[] = [
  {
    file: '12-chemistry-question-bank-tamil-2026-27.pdf',
    title: { en: 'Class 12 Question Bank 2026–27', ta: '12ஆம் வகுப்பு முக்கிய வினாக்கள் 2026–27' },
    description: {
      en: 'Lesson-wise previous-year and important 2, 3 & 5-mark questions for all 15 chapters, with exam years, textbook page numbers and quiz links.',
      ta: '15 பாடங்களுக்கும் பாடவாரியான முந்தைய ஆண்டு மற்றும் முக்கிய 2, 3, 5 மதிப்பெண் வினாக்கள் — தேர்வு ஆண்டுகள், புத்தகப் பக்க எண்கள், வினாடி வினா இணைப்புகளுடன்.',
    },
    medium: { en: 'Tamil medium', ta: 'தமிழ் வழி' },
    pages: 17,
    size: '1.1 MB',
  },
  {
    file: '12-chemistry-question-bank-english-2026-27.pdf',
    title: { en: 'Class 12 Question Bank 2026–27', ta: '12ஆம் வகுப்பு முக்கிய வினாக்கள் 2026–27' },
    description: {
      en: 'Lesson-wise PYQ and important 2, 3 & 5-mark questions for all 15 chapters, with the years each question was asked.',
      ta: '15 பாடங்களுக்கும் பாடவாரியான முந்தைய ஆண்டு மற்றும் முக்கிய 2, 3, 5 மதிப்பெண் வினாக்கள் — கேட்கப்பட்ட ஆண்டுகளுடன்.',
    },
    medium: { en: 'English medium', ta: 'ஆங்கில வழி' },
    pages: 18,
    size: '0.8 MB',
  },
  {
    file: '12-chemistry-star-questions-2026.pdf',
    title: { en: 'Class 12 Public Exam Star Questions', ta: '12ஆம் வகுப்பு பொதுத்தேர்வு புதையல்' },
    description: {
      en: 'The 78 most-repeated public exam questions, ranked five-star, three-star and double-star, with the exam sessions they appeared in.',
      ta: 'பொதுத்தேர்வில் அதிக முறை கேட்கப்பட்ட 78 வினாக்கள் — ஐந்து, மூன்று, இரண்டு நட்சத்திர வரிசையில், கேட்கப்பட்ட தேர்வுகளுடன்.',
    },
    medium: { en: 'Tamil + English', ta: 'தமிழ் + ஆங்கிலம்' },
    pages: 7,
    size: '10.6 MB',
  },
  {
    file: '11-chemistry-question-bank-tamil-2025-26.pdf',
    title: { en: 'Class 11 Question Bank 2025–26', ta: '11ஆம் வகுப்பு முக்கிய வினாக்கள் 2025–26' },
    description: {
      en: 'Lesson-wise previous-year and important questions for all 15 chapters, with exam years, textbook page numbers and quiz links.',
      ta: '15 பாடங்களுக்கும் பாடவாரியான முந்தைய ஆண்டு மற்றும் முக்கிய வினாக்கள் — தேர்வு ஆண்டுகள், புத்தகப் பக்க எண்கள், வினாடி வினா இணைப்புகளுடன்.',
    },
    medium: { en: 'Tamil medium', ta: 'தமிழ் வழி' },
    pages: 17,
    size: '24 MB',
  },
  {
    file: '11-chemistry-question-bank-english-2025-26.pdf',
    title: { en: 'Class 11 Question Bank 2025–26', ta: '11ஆம் வகுப்பு முக்கிய வினாக்கள் 2025–26' },
    description: {
      en: 'Chapter-wise important questions for all 15 chapters, from basic concepts and chemical calculations to environmental chemistry.',
      ta: 'அடிப்படைக் கருத்துக்கள் முதல் சுற்றுச்சூழல் வேதியியல் வரை 15 பாடங்களுக்கும் பாடவாரியான முக்கிய வினாக்கள்.',
    },
    medium: { en: 'English medium', ta: 'ஆங்கில வழி' },
    pages: 19,
    size: '0.4 MB',
  },
];
