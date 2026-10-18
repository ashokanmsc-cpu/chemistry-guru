import { Component } from '@angular/core';
import { TranslatePipe } from '../core/translate.pipe';
import { ProfileCard } from './profile-card';
import { CHAPTERS } from '../data/chapters';

@Component({
  selector: 'app-hero',
  imports: [TranslatePipe, ProfileCard],
  host: { style: 'display:contents' },
  template: `
    <section class="hero" id="home">
      <img class="molecule-animation" src="images/chemistry_guru_rotating_molecule.svg" alt="" aria-hidden="true"
           width="800" height="600" decoding="async">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <div class="eyebrow"><span>{{ 'hero.eyebrow' | t }}</span></div>
          <h1>{{ 'hero.title1' | t }}<br><span>{{ 'hero.title2' | t }}</span></h1>
          <p>{{ 'hero.text' | t }}</p>
          <div class="hero-actions">
            <a class="btn" href="#quizzes">{{ 'hero.start' | t }}</a>
            <a class="btn ghost" href="#profile">{{ 'hero.meet' | t }}</a>
          </div>
          <div class="hero-note">
            <div><strong>{{ chapterCount }}</strong><small>{{ 'hero.stat1' | t }}</small></div>
            <div><strong>{{ 'hero.stat2v' | t }}</strong><small>{{ 'hero.stat2' | t }}</small></div>
            <div><strong>{{ 'hero.stat3v' | t }}</strong><small>{{ 'hero.stat3' | t }}</small></div>
          </div>
        </div>
        <app-profile-card />
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly chapterCount = CHAPTERS.length;
}
