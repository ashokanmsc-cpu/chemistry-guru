import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { Bilingual, Lang } from '../data/chapters';
import { TRANSLATIONS, TranslationKey } from '../i18n/translations';

const STORAGE_KEY = 'cg-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  readonly lang = signal<Lang>(this.readSaved());

  constructor() {
    effect(() => {
      const lang = this.lang();
      this.document.documentElement.lang = lang;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }

  /** Text for a translation key in the current language. */
  t(key: TranslationKey): string {
    return TRANSLATIONS[key][this.lang()];
  }

  /** Pick the current-language value from any bilingual object. */
  pick(value: Bilingual): string {
    return value[this.lang()];
  }

  private readSaved(): Lang {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'ta' ? 'ta' : 'en';
    } catch {
      return 'en';
    }
  }
}
