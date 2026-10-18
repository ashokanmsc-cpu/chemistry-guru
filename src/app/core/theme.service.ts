import { DOCUMENT, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';
export const THEME_STORAGE_KEY = 'cg-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  /**
   * Light is the default. In the browser, start from the attribute the inline
   * script in index.html already set from the saved choice, so there is no flash.
   * Templates never branch on this signal (icons switch via CSS), so hydration stays in sync.
   */
  readonly theme = signal<Theme>(
    isPlatformBrowser(inject(PLATFORM_ID)) && this.document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light',
  );

  constructor() {
    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* storage unavailable */ }
  }
}
