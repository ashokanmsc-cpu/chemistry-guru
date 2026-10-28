import { Component, inject } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { RevealDirective } from '../shared/reveal.directive';
import { LATEST_VIDEOS } from '../data/videos';
import { YOUTUBE_URL } from '../config';

@Component({
  selector: 'app-latest-videos',
  imports: [TranslatePipe, RevealDirective],
  host: { style: 'display:contents' },
  template: `
    @if (videos.length) {
      <section class="section videos" id="videos">
        <div class="wrap">
          <div class="section-head" appReveal style="padding-top:25px">
            <div>
              <div class="kicker">{{ 'vid.kicker' | t }}</div>
              <h2>{{ 'vid.title' | t }}</h2>
              <p>{{ 'vid.text' | t }}</p>
            </div>
            <a class="btn" [href]="channel" target="_blank" rel="noopener">{{ 'vid.all' | t }}</a>
          </div>
          <div class="video-grid" appReveal>
            @for (video of videos; track video.id) {
              <a class="video-card" [href]="'https://www.youtube.com/watch?v=' + video.id" target="_blank" rel="noopener">
                <span class="video-thumb">
                  <img [src]="'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg'" [alt]="video.title"
                       width="480" height="360" loading="lazy" decoding="async">
                  <span class="video-play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span>
                  <span class="video-thumb-label">CHEMISTRY GURU</span>
                </span>
                <span class="video-body">
                  <span class="video-meta"><span class="video-source"><span aria-hidden="true">▶</span> YOUTUBE</span><time [attr.datetime]="video.published">{{ date(video.published) }}</time></span>
                  <h3>{{ video.title }}</h3>
                  <span class="video-watch">{{ 'vid.watch' | t }} <span aria-hidden="true">↗</span></span>
                </span>
              </a>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class LatestVideos {
  private readonly language = inject(LanguageService);
  protected readonly videos = LATEST_VIDEOS;
  protected readonly channel = YOUTUBE_URL + '/videos';

  protected date(iso: string): string {
    return new Date(iso + 'T00:00:00Z').toLocaleDateString(this.language.lang() === 'ta' ? 'ta-IN' : 'en-IN',
      { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
}
