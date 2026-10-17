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
          <div class="legend">
            <span><i style="background:var(--forest)"></i>{{ 'quiz.vol1' | t }}</span>
            <span><i style="background:var(--rust)"></i>{{ 'quiz.vol2' | t }}</span>
          </div>
        </div>

        <div class="std-switch" role="tablist" aria-label="Choose class">
          @for (s of standards; track s.value) {
            <button class="std-tab" type="button" role="tab" [attr.aria-selected]="std() === s.value"
                    [class.active]="std() === s.value" (click)="std.set(s.value)">{{ s.key | t }}</button>
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
