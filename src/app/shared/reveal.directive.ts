import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Adds the `reveal` class, then `in` once the element scrolls into view (browser only). */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class RevealDirective {
  constructor() {
    const node: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        node.classList.add('in');
        return;
      }
      const observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          node.classList.add('in');
          observer.disconnect();
        }
      }, { threshold: 0.12 });
      observer.observe(node);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
