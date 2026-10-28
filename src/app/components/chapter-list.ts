import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { RevealDirective } from '../shared/reveal.directive';
import { CHAPTERS, Standard } from '../data/chapters';
import { ChapterCard } from './chapter-card';
import { SocialLinks } from './social-links';

type VolumeFilter = 'all' | 1 | 2;

@Component({
  selector: 'app-chapter-list',
  imports: [TranslatePipe, RevealDirective, ChapterCard, SocialLinks],
  host: { style: 'display:contents' },
  template: `
    <section class="section" id="quizzes">
      <div class="wrap">
        <div class="section-head" appReveal>
          <div>
            <div class="kicker">{{ 'quiz.kicker' | t }}</div>
            <h2>{{ 'quiz.title' | t }}</h2>
            <p>{{ 'quiz.text' | t }}</p>
          </div>
        </div>

        <div class="std-switch" role="tablist" aria-label="Choose class">
          @for (s of standards; track s.value) {
            <button class="std-tab" type="button" role="tab" [attr.aria-selected]="std() === s.value"
                    [class.active]="std() === s.value" (click)="std.set(s.value)">
              <span class="std-tab-icon" aria-hidden="true">
                @if (s.value === 12) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8M9 3v5l-4.5 8.2A3.2 3.2 0 0 0 7.3 21h9.4a3.2 3.2 0 0 0 2.8-4.8L15 8V3"/><path d="M7 15h10M9 11h6"/></svg>
                } @else {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M8 7h8M8 11h8"/></svg>
                }
              </span>
              <span class="std-tab-label">{{ s.key | t }}</span>
              <svg class="std-tab-check" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          }
        </div>

        <div class="toolbar">
          <div class="tabs">
            @for (tab of tabs; track tab.value) {
              <button class="tab" type="button" [class.active]="volume() === tab.value" (click)="volume.set(tab.value)">{{ tab.key | t }}</button>
            }
          </div>
          <label class="searchbox">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input type="search" [placeholder]="'quiz.search' | t" aria-label="Search chapters"
                   [value]="term()" (input)="term.set($any($event.target).value)">
          </label>
        </div>

        <div class="chapter-grid">
          @for (chapter of filtered(); track chapter.std + '-' + chapter.no) {
            <app-chapter-card [chapter]="chapter" [index]="$index" />
          }
        </div>
        <div class="empty" [style.display]="filtered().length ? 'none' : 'block'">{{ 'quiz.empty' | t }}</div>

        <app-social-links />
      </div>
    </section>
  `,
})
export class ChapterList {
  protected readonly language = inject(LanguageService);
  protected readonly std = signal<Standard>(12);
  protected readonly volume = signal<VolumeFilter>('all');
  protected readonly term = signal('');

  protected readonly standards = [
    { value: 12, key: 'quiz.std12' },
    { value: 11, key: 'quiz.std11' },
  ] as const;

  protected readonly tabs = [
    { value: 'all', key: 'quiz.all' },
    { value: 1, key: 'quiz.vol1' },
    { value: 2, key: 'quiz.vol2' },
  ] as const;

  protected readonly filtered = computed(() => {
    const term = this.term().trim().toLowerCase();
    const volume = this.volume();
    const std = this.std();
    return CHAPTERS.filter(c =>
      c.std === std &&
      (volume === 'all' || c.volume === volume) &&
      `${c.title.en} ${c.title.ta}`.toLowerCase().includes(term));
  });
}
