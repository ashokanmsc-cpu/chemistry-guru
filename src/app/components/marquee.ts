import { Component, inject } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { CHAPTERS } from '../data/chapters';

@Component({
  selector: 'app-marquee',
  host: { style: 'display:contents' },
  template: `
    <div class="strip" aria-hidden="true">
      <div class="strip-track">
        @for (chapter of items; track $index) {
          <span>{{ language.pick(chapter.title) }}</span>
        }
      </div>
    </div>
  `,
})
export class Marquee {
  protected readonly language = inject(LanguageService);
  /** Listed twice so the -50% translate loops seamlessly. */
  protected readonly items = [...CHAPTERS, ...CHAPTERS];
}
