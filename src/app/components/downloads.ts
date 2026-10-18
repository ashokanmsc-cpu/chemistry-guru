import { Component, inject } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { RevealDirective } from '../shared/reveal.directive';
import { DOWNLOADS } from '../data/downloads';

@Component({
  selector: 'app-downloads',
  imports: [TranslatePipe, RevealDirective],
  host: { style: 'display:contents' },
  template: `
    <section class="section downloads" id="downloads">
      <div class="wrap">
        <div class="section-head" appReveal>
          <div>
            <div class="kicker">{{ 'dl.kicker' | t }}</div>
            <h2>{{ 'dl.title' | t }}</h2>
            <p>{{ 'dl.text' | t }}</p>
          </div>
        </div>
        <div class="download-grid" appReveal>
          @for (item of items; track item.file) {
            <article class="download-card">
              <div class="download-top">
                <span class="pdf-badge" aria-hidden="true">PDF</span>
                <span class="chip">{{ language.pick(item.medium) }}</span>
              </div>
              <h3>{{ language.pick(item.title) }}</h3>
              <p>{{ language.pick(item.description) }}</p>
              <div class="download-meta">{{ item.pages }} {{ 'dl.pages' | t }}@if (item.size) { · {{ item.size }} }</div>
              <div class="download-actions">
                <a class="btn" [href]="'downloads/' + item.file" [attr.download]="item.file">{{ 'dl.download' | t }}</a>
                <a class="btn ghost" [href]="'downloads/' + item.file" target="_blank" rel="noopener">{{ 'dl.view' | t }}</a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Downloads {
  protected readonly language = inject(LanguageService);
  protected readonly items = DOWNLOADS;
}
