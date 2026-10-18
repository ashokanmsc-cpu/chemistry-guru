import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  host: { style: 'display:contents' },
  template: `
    <section class="section testimonials" id="testimonials" aria-labelledby="testimonials-title">
      <div class="wrap">
        <div class="section-head testimonial-heading">
          <div>
            <div class="kicker">A teacher’s journey</div>
            <h2 id="testimonials-title">Testimonials &amp; moments</h2>
            <p>Snapshots from the classroom and beyond.</p>
          </div>
          <div class="testimonial-controls" aria-label="Photo slider controls">
            <button type="button" aria-label="Previous photo" (click)="move(track, -1)">←</button>
            <button type="button" aria-label="Next photo" (click)="move(track, 1)">→</button>
          </div>
        </div>

        <div #track class="testimonial-track" (scroll)="updateActive(track)" (scrollend)="normalizePosition(track)"
             (mouseenter)="paused = true" (mouseleave)="paused = false"
             (focusin)="paused = true" (focusout)="paused = false"
             aria-label="Dr. Ashokan photo gallery" tabindex="0">
          @for (photo of slides; track $index; let i = $index) {
            <figure class="testimonial-slide" [class.is-active]="activeSlideIndex === i">
              <img [src]="photo.src" [alt]="photo.alt" [attr.loading]="i === 4 ? 'eager' : 'lazy'" decoding="async">
            </figure>
          }
        </div>
        <div class="testimonial-dots" aria-hidden="true">
          @for (photo of photos; track photo.src; let i = $index) {
            <span [class.is-active]="activeIndex === i"></span>
          }
        </div>
      </div>
    </section>
  `,
})
export class Testimonials implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('track') private trackRef!: ElementRef<HTMLDivElement>;
  protected activeSlideIndex = 4;
  protected activeIndex = 0;
  protected paused = false;
  private autoplay?: ReturnType<typeof setInterval>;
  protected readonly photos = [
    { src: 'testrimonials/1.jpg', alt: 'Testimonial photo 1' },
    { src: 'testrimonials/2.jpg', alt: 'Testimonial photo 2' },
    { src: 'testrimonials/3.jpg', alt: 'Testimonial photo 3' },
    { src: 'testrimonials/4.jpg', alt: 'Testimonial photo 4' },
  ];
  protected readonly slides = [...this.photos, ...this.photos, ...this.photos];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const track = this.trackRef.nativeElement;
    this.centerSlide(track, this.activeSlideIndex, 'auto');
    this.updateActive(track);
    this.autoplay = setInterval(() => {
      if (!this.paused) this.move(track, 1);
    }, 4500);
  }

  ngOnDestroy(): void {
    if (this.autoplay) clearInterval(this.autoplay);
  }

  protected move(track: HTMLDivElement, direction: number): void {
    const slides = track.querySelectorAll<HTMLElement>('.testimonial-slide');
    const next = (this.activeSlideIndex + direction + slides.length) % slides.length;
    this.centerSlide(track, next, 'smooth');
  }

  private centerSlide(track: HTMLDivElement, index: number, behavior: ScrollBehavior): void {
    const slide = track.querySelectorAll<HTMLElement>('.testimonial-slide')[index];
    if (!slide) return;
    const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + offset + slide.offsetWidth / 2 - track.clientWidth / 2, behavior });
  }

  protected normalizePosition(track: HTMLDivElement): void {
    const count = this.photos.length;
    if (this.activeSlideIndex >= count * 2) {
      this.centerSlide(track, this.activeSlideIndex - count, 'auto');
      this.activeSlideIndex -= count;
    } else if (this.activeSlideIndex < count) {
      this.centerSlide(track, this.activeSlideIndex + count, 'auto');
      this.activeSlideIndex += count;
    }
    this.activeIndex = this.activeSlideIndex % count;
  }

  protected updateActive(track: HTMLDivElement): void {
    if (typeof track.getBoundingClientRect !== 'function') return;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    const slides = Array.from(track.querySelectorAll<HTMLElement>('.testimonial-slide'));
    const activeSlide = slides.reduce((closest, slide, index) =>
      Math.abs(slide.getBoundingClientRect().left + slide.offsetWidth / 2 - center) <
      Math.abs(slides[closest].getBoundingClientRect().left + slides[closest].offsetWidth / 2 - center)
        ? index
        : closest, 0);
    this.activeSlideIndex = activeSlide;
    this.activeIndex = activeSlide % this.photos.length;
  }
}
