import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { Chapter } from '../data/chapters';

@Component({
  selector: 'app-chapter-card',
  imports: [TranslatePipe, DecimalPipe],
  host: { style: 'display:contents' },
  template: `
    <a class="chapter" [attr.data-vol]="chapter().volume" [style.--delay]="index() * 35 + 'ms'"
       [href]="url()" target="_blank" rel="noopener">
      <div class="chapter-top">
        <span class="number">{{ chapter().no | number: '2.0-0' }}</span>
        <span>{{ 'card.vol' | t }} {{ chapter().volume }}</span>
      </div>
      <div class="sym">{{ chapter().symbol }}</div>
      <h3>{{ language.pick(chapter().title) }}</h3>
      <p>
        {{ 'card.sub' | t }}
        @if (!chapter().formUrl.en) { <span class="medium-tag">{{ 'card.taOnly' | t }}</span> }
      </p>
      <div class="quiz-link"><span>{{ 'card.open' | t }}</span><b>→</b></div>
    </a>
  `,
})
export class ChapterCard {
  protected readonly language = inject(LanguageService);
  readonly chapter = input.required<Chapter>();
  readonly index = input(0);

  /** Current-language form, falling back to the Tamil-medium form. */
  protected readonly url = computed(() => {
    const urls = this.chapter().formUrl;
    return (this.language.lang() === 'en' && urls.en) || urls.ta;
  });
}
