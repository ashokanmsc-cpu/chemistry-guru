import { Component } from '@angular/core';
import { TranslatePipe } from '../core/translate.pipe';
import { RevealDirective } from '../shared/reveal.directive';
import { TELEGRAM_URL, YOUTUBE_URL } from '../config';

@Component({
  selector: 'app-social-links',
  imports: [TranslatePipe, RevealDirective],
  host: { style: 'display:contents' },
  template: `
    <div class="social-grid" appReveal>
      <a class="youtube-band" [href]="youtube" target="_blank" rel="noopener">
        <div class="yt-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div>
        <div><h3>{{ 'yt.title' | t }}</h3><p>{{ 'yt.text' | t }}</p></div>
        <span class="btn">{{ 'yt.btn' | t }}</span>
      </a>
      <a class="youtube-band tg" [href]="telegram" target="_blank" rel="noopener">
        <div class="yt-icon tg-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M21.9 4.3l-3.2 15.1c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3c.9-.3 1.7.2 1.4 1.3z"/></svg></div>
        <div><h3>{{ 'tg.title' | t }}</h3><p>{{ 'tg.text' | t }}</p></div>
        <span class="btn">{{ 'tg.btn' | t }}</span>
      </a>
    </div>
  `,
})
export class SocialLinks {
  protected readonly youtube = YOUTUBE_URL;
  protected readonly telegram = TELEGRAM_URL;
}
