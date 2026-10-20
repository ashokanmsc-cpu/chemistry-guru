import { Component, inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { Bilingual } from '../data/chapters';

interface Presentation {
  file: string;
  unit: string;
  title: Bilingual;
}

@Component({
  selector: 'app-ppt-library',
  imports: [TranslatePipe],
  host: { style: 'display:contents' },
  template: `
    <section class="section ppt-library" id="ppt" aria-labelledby="ppt-title">
      <div class="wrap" style="padding-top:25px">
        <div class="section-head ppt-heading">
          <div>
            <div class="kicker">{{ 'ppt.kicker' | t }}</div>
            <h2 id="ppt-title">{{ 'ppt.title' | t }}</h2>
            <p>{{ 'ppt.text' | t }}</p>
          </div>
        </div>
        <div class="ppt-grid">
          @for (item of presentations; track item.file; let i = $index) {
            <button class="ppt-card" type="button" (click)="openPdf(item, pdfDialog)"
                    [attr.aria-label]="language.pick(item.title) + ' PDF'" [style.--card-index]="i">
              <div class="ppt-card-top">
                <div class="ppt-card-context">
                  <span class="ppt-standard">{{ 'ppt.class12' | t }}</span>
                  <span class="ppt-unit">{{ item.unit }}</span>
                </div>
                <span class="pdf-badge" aria-hidden="true">PDF</span>
              </div>
              <span class="ppt-card-title">{{ language.pick(item.title) }}</span>
              <span class="ppt-open">{{ 'ppt.open' | t }}</span>
            </button>
          }
        </div>
        <dialog #pdfDialog class="ppt-dialog" (click)="closeFromBackdrop($event, pdfDialog)"
                (keydown.escape)="closePdf(pdfDialog)" (close)="restoreBodyScroll()"
                aria-label="Presentation PDF viewer">
          <div class="ppt-dialog-shell" (click)="$event.stopPropagation()">
            <div class="ppt-dialog-bar">
              <div class="ppt-dialog-heading">
                <span class="ppt-dialog-label">{{ activePresentation?.unit }} · PDF</span>
                <h3>{{ activePresentation ? language.pick(activePresentation.title) : '' }}</h3>
              </div>
              <div class="ppt-dialog-actions">
                <button type="button" class="ppt-new-window" (click)="openInNewWindow()">{{ 'ppt.window' | t }} <span aria-hidden="true">↗</span></button>
                <button type="button" class="ppt-close" (click)="closePdf(pdfDialog)" aria-label="Close PDF">×</button>
              </div>
            </div>
            @if (activePdfUrl; as pdfUrl) {
              <iframe [src]="pdfUrl" [title]="activePresentation ? language.pick(activePresentation.title) + ' PDF' : 'PDF viewer'"></iframe>
            }
          </div>
        </dialog>
      </div>
    </section>
  `,
})
export class PptLibrary implements OnDestroy {
  protected readonly language = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private previousBodyOverflow = '';
  protected activePdfUrl: SafeResourceUrl | null = null;
  protected activePresentation: Presentation | null = null;
  protected readonly presentations: Presentation[] = [
    { file: 'XII STD UNIT 14 BIOMOLECULES AI.pdf', unit: 'UNIT 14', title: { en: 'Biomolecules', ta: 'உயிரியல் மூலக்கூறுகள்' } },
    { file: 'XII STD UNIT 10 Surface Chemistry.pdf', unit: 'UNIT 10', title: { en: 'Surface Chemistry', ta: 'புறப்பரப்பு வேதியியல்' } },
    { file: 'XII STD UNIT 5  Coordination Chemistry.pdf', unit: 'UNIT 05', title: { en: 'Coordination Chemistry', ta: 'அணைவு வேதியியல்' } },
    { file: 'XII STD UNIT 9  Electro Chemistry.pdf', unit: 'UNIT 09', title: { en: 'Electrochemistry', ta: 'மின் வேதியியல்' } },
    { file: 'XII STD UNIT 15 Chemistry in Everyday Life AI.pdf', unit: 'UNIT 15', title: { en: 'Chemistry in Everyday Life', ta: 'அன்றாட வாழ்வில் வேதியியல்' } },
  ];

  protected openPdf(item: Presentation, dialog: HTMLDialogElement): void {
    this.activePresentation = item;
    this.activePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('ppt/' + item.file);
    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    dialog.showModal();
  }

  protected closePdf(dialog: HTMLDialogElement): void {
    if (dialog.open) dialog.close();
    this.activePdfUrl = null;
    this.activePresentation = null;
    this.restoreBodyScroll();
  }

  protected openInNewWindow(): void {
    if (this.activePresentation) window.open('ppt/' + this.activePresentation.file, '_blank', 'noopener');
  }

  protected restoreBodyScroll(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  protected closeFromBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) this.closePdf(dialog);
  }
}
