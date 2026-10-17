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
    <a class="to-top" href="#home" aria-label="Back to top" [class.show]="showTop()">↑</a>
    <div class="toast" role="status" [class.show]="toast.visible()">{{ toast.message() }}</div>
  `,
})
export class Overlays {
  protected readonly toast = inject(ToastService);
  protected readonly showTop = signal(false);

  protected onScroll(): void {
    this.showTop.set(window.scrollY > 600);
  }
}
