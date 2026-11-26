import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'chemistry-guru-tn';
const KEY = 'visitors';
const COUNTED_FLAG = 'cg-visitor-counted';
const LAST_COUNT = 'cg-visitor-last';

/** Unique-browser visitor count, kept on the free Abacus counter service. Browser-only; null until loaded. */
@Injectable({ providedIn: 'root' })
export class VisitorCounterService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly count = signal<number | null>(null);

  constructor() {
    // Deferred so the first client render matches the prerendered HTML (no hydration mismatch).
    if (this.isBrowser) setTimeout(() => void this.load());
  }

  private async load(): Promise<void> {
    let counted = false;
    try {
      counted = localStorage.getItem(COUNTED_FLAG) === '1';
      const last = Number(localStorage.getItem(LAST_COUNT));
      if (last > 0) this.count.set(last); // show the last known number instantly
    } catch { /* storage unavailable */ }

    // First visit from this browser increments the total; repeat visits only read it.
    // Retry once: the free service is occasionally slow on a cold request.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(`${API}/${counted ? 'get' : 'hit'}/${NAMESPACE}/${KEY}`, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;
        const { value } = (await res.json()) as { value?: number };
        if (typeof value !== 'number') continue;
        this.count.set(value);
        try {
          localStorage.setItem(LAST_COUNT, String(value));
          localStorage.setItem(COUNTED_FLAG, '1');
        } catch { /* storage unavailable */ }
        return;
      } catch { /* retry */ }
    }
  }
}
