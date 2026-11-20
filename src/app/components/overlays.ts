import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../core/toast.service';

/** Floating back-to-top button and toast message. */
@Component({
  selector: 'app-overlays',
  host: {
    style: 'display:contents',
    '(window:scroll)': 'onScroll()',
  },
  template: `
    <a class="to-top" href="#home" aria-label="Back to top" [class.show]="showTop()" (click)="toTop($event)">↑</a>
    <div class="toast" role="status" [class.show]="toast.visible()">{{ toast.message() }}</div>
  `,
})
export class Overlays {
  protected readonly toast = inject(ToastService);
  protected readonly showTop = signal(false);

  private ticking = false;

  protected onScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.ticking = false; this.showTop.set(window.scrollY > 600); });
  }

  /** Jump instantly: a long smooth scroll over the whole page is what made going back to top lag. */
  protected toTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    history.replaceState(null, '', '#home');
  }
}
