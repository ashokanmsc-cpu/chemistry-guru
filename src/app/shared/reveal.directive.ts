import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/** Adds the `reveal` class, then `in` once the element scrolls into view. */
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (!('IntersectionObserver' in window)) {
      node.classList.add('in');
      return;
    }
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('in');
          this.observer?.disconnect();
        }
      }
    }, { threshold: 0.12 });
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
