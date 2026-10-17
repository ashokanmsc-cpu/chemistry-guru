import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { LOGO_SRC } from '../config';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe],
  host: {
    style: 'display:contents',
    '(window:scroll)': 'onScroll()',
  },
  template: `
    <header class="topbar" [class.scrolled]="scrolled()">
      <div class="wrap nav">
        <a class="brand" href="#home" aria-label="Chemistry Guru home">
          <span class="brand-mark"><img [src]="logo" alt="Chemistry Guru logo"></span>
          <span><b>CHEMISTRY GURU</b><small>LEARN • PRACTISE • EXCEL</small></span>
        </a>
        <nav class="nav-links" [class.open]="menuOpen()">
          <a href="#profile" (click)="menuOpen.set(false)">{{ 'nav.profile' | t }}</a>
          <a href="#quizzes" (click)="menuOpen.set(false)">{{ 'nav.quizzes' | t }}</a>
          <a href="#contact" (click)="menuOpen.set(false)">{{ 'nav.contact' | t }}</a>
        </nav>
        <div class="language-switch" aria-label="Choose language">
          <button type="button" class="lang-btn" [class.active]="language.lang() === 'en'" (click)="language.set('en')">EN</button>
          <button type="button" class="lang-btn" [class.active]="language.lang() === 'ta'" (click)="language.set('ta')">தமிழ்</button>
        </div>
        <a class="nav-cta" href="#quizzes">{{ 'nav.cta' | t }}</a>
        <button class="menu-btn" type="button" aria-label="Open menu" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())"><span></span></button>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly language = inject(LanguageService);
  protected readonly logo = LOGO_SRC;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
