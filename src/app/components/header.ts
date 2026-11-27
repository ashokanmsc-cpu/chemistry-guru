import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { ThemeService } from '../core/theme.service';
import { LAB_ITEMS } from '../data/virtual-lab';
import { LOGO_SRC } from '../config';

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  host: {
    style: 'display:contents',
    '(window:scroll)': 'onScroll()',
  },
  template: `
    <header class="topbar" [class.scrolled]="scrolled()">
      <div class="wrap nav">
        <a class="brand" routerLink="/" fragment="home" aria-label="Chemistry Guru home">
          <span class="brand-mark"><img [src]="logo" alt="Chemistry Guru logo" width="44" height="44"></span>
          <span><b>CHEMISTRY GURU</b><small class="ls">YOUR SUCCESS IS MY REACTION</small></span>
        </a>
        <nav class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/" fragment="profile" [class.active]="active() === 'profile'" (click)="menuOpen.set(false); active.set('profile')">{{ 'nav.profile' | t }}</a>
          <a routerLink="/" fragment="quizzes" [class.active]="active() === 'quizzes'" (click)="menuOpen.set(false); active.set('quizzes')">{{ 'nav.quizzes' | t }}</a>
          <a routerLink="/" fragment="downloads" [class.active]="active() === 'downloads'" (click)="menuOpen.set(false); active.set('downloads')">{{ 'nav.downloads' | t }}</a>
          <div class="mega" routerLinkActive="mega-active" [class.open]="megaOpen()" [class.dismissed]="dismissed()" (mouseleave)="dismissed.set(false)">
            <button type="button" class="mega-trigger" [attr.aria-expanded]="megaOpen()" aria-haspopup="true" (click)="megaOpen.set(!megaOpen()); dismissed.set(false)">
              {{ 'nav.lab' | t }}<span class="nav-new">{{ 'nav.new' | t }}</span><svg class="mega-caret" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3.5l3 3 3-3"/></svg>
            </button>
            <div class="mega-panel">
              <div class="mega-head"><b>{{ 'nav.lab' | t }}</b><span>Interactive chemistry simulators &amp; practicals</span></div>
              <div class="mega-grid">
                @for (item of labItems; track item.path) {
                  <a class="mega-item" [routerLink]="'/' + item.path" routerLinkActive="active" (click)="closeAll()">
                    <span class="mega-ico" aria-hidden="true">{{ item.icon }}</span>
                    <span class="mega-txt"><strong>{{ item.title }}</strong><small>{{ item.ready ? item.desc : 'Coming soon' }}</small></span>
                  </a>
                }
              </div>
            </div>
          </div>
          <a routerLink="/" fragment="contact" [class.active]="active() === 'contact'" (click)="menuOpen.set(false); active.set('contact')">{{ 'nav.contact' | t }}</a>
          <div class="language-switch menu-lang" aria-label="Choose language">
            <button type="button" class="lang-btn" [class.active]="language.lang() === 'en'" (click)="language.set('en')">EN</button>
            <button type="button" class="lang-btn" [class.active]="language.lang() === 'ta'" (click)="language.set('ta')">தமிழ்</button>
          </div>
        </nav>
        <div class="language-switch bar-lang" aria-label="Choose language">
          <button type="button" class="lang-btn" [class.active]="language.lang() === 'en'" (click)="language.set('en')">EN</button>
          <button type="button" class="lang-btn" [class.active]="language.lang() === 'ta'" (click)="language.set('ta')">தமிழ்</button>
        </div>
        <button class="theme-btn" type="button" aria-label="Switch dark / light theme" title="Switch dark / light theme" (click)="theme.toggle()">
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>
        </button>
        <a class="nav-cta" routerLink="/" fragment="quizzes">{{ 'nav.cta' | t }}</a>
        <button class="menu-btn" type="button" aria-label="Open menu" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())"><span></span></button>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly language = inject(LanguageService);
  protected readonly theme = inject(ThemeService);
  protected readonly logo = LOGO_SRC;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly active = signal('');
  protected readonly megaOpen = signal(false);
  protected readonly dismissed = signal(false);
  protected readonly labItems = LAB_ITEMS;
  protected closeAll(): void { this.menuOpen.set(false); this.megaOpen.set(false); this.dismissed.set(true); }
  private readonly sections = ['profile', 'quizzes', 'downloads', 'contact'];

  private ticking = false;

  protected onScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.ticking = false; this.update(); });
  }

  private update(): void {
    this.scrolled.set(window.scrollY > 8);
    let current = '';
    for (const id of this.sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
    if (current !== this.active()) this.active.set(current);
  }
}
