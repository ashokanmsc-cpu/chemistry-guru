import { DOCUMENT, Injectable, afterNextRender, effect, inject, signal } from '@angular/core';
import { Bilingual, Lang } from '../data/chapters';
import { TRANSLATIONS, TranslationKey } from '../i18n/translations';

const STORAGE_KEY = 'cg-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  /** Always starts in English so the pre-rendered HTML matches the first browser render. */
  readonly lang = signal<Lang>('en');

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.lang();
    });
    // Browser only: restore the visitor's saved choice after hydration.
    afterNextRender(() => {
      try {
        const requestedLanguage = new URLSearchParams(this.document.defaultView?.location.search ?? '').get('lang');
        if (requestedLanguage === 'en' || requestedLanguage === 'ta') {
          this.lang.set(requestedLanguage);
          localStorage.setItem(STORAGE_KEY, requestedLanguage);
        } else if (localStorage.getItem(STORAGE_KEY) === 'ta') {
          this.lang.set('ta');
        }
      } catch { /* storage unavailable */ }
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }

  /** Text for a translation key in the current language. */
  t(key: TranslationKey): string {
    return TRANSLATIONS[key][this.lang()];
  }

  /** Pick the current-language value from any bilingual object. */
  pick(value: Bilingual): string {
    return value[this.lang()];
  }
}
