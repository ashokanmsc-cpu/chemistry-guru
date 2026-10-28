import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';

interface ExamPdf {
  file: string;
  title: { en: string; ta: string };
  tag: { en: string; ta: string };
}

@Component({
  selector: 'app-public-exam-questions',
  imports: [TranslatePipe],
  host: { style: 'display:contents' },
  template: `
    <section class="section public-exams" id="public-exam-questions" aria-labelledby="public-exams-title">
      <div class="wrap">
        <div class="section-head ppt-heading">
          <div>
            <div class="kicker">{{ 'exam.kicker' | t }}</div>
            <h2 id="public-exams-title">{{ 'exam.title' | t }}</h2>
            <p>{{ 'exam.text' | t }}</p>
          </div>
        </div>
        <div class="public-exam-grid">
          @for (item of exams; track item.file; let i = $index) {
            <button class="ppt-card" type="button" (click)="openPdf(item, pdfDialog)"
                    [attr.aria-label]="language.pick(item.title) + ' PDF'" [style.--card-index]="i">
              <span class="ppt-card-top">
                <span class="ppt-card-context">
                  <span class="ppt-standard">{{ language.pick(item.tag) }}</span>
                </span>
                <span class="pdf-badge" aria-hidden="true">PDF</span>
              </span>
              <span class="ppt-card-title">{{ language.pick(item.title) }}</span>
              <span class="ppt-open">{{ 'ppt.open' | t }} <span aria-hidden="true">↗</span></span>
            </button>
          }
        </div>
        <dialog #pdfDialog class="ppt-dialog" (click)="closeFromBackdrop($event, pdfDialog)"
                (keydown.escape)="closePdf(pdfDialog)" aria-label="Public exam PDF viewer">
          <div class="ppt-dialog-shell" (click)="$event.stopPropagation()">
            <div class="ppt-dialog-bar">
              <div class="ppt-dialog-heading">
                <span class="ppt-dialog-label">{{ activeExam ? language.pick(activeExam.tag) : '' }} · PDF</span>
                <h3>{{ activeExam ? language.pick(activeExam.title) : '' }}</h3>
              </div>
              <div class="ppt-dialog-actions">
                <button type="button" class="ppt-new-window" (click)="openInNewWindow()">{{ 'ppt.window' | t }} <span aria-hidden="true">↗</span></button>
                <button type="button" class="ppt-close" (click)="closePdf(pdfDialog)" aria-label="Close PDF">×</button>
              </div>
            </div>
            @if (activePdfUrl; as pdfUrl) {
              <iframe [src]="pdfUrl" [title]="activeExam ? language.pick(activeExam.title) + ' PDF' : 'PDF viewer'"></iframe>
            }
          </div>
        </dialog>
      </div>
    </section>
  `,
})
export class PublicExamQuestions {
  protected readonly language = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);
  protected activePdfUrl: SafeResourceUrl | null = null;
  protected activeExam: ExamPdf | null = null;
  protected readonly exams: ExamPdf[] = [
    { file: 'PUBLIC EXAM 3 MARKS T&E.pdf', title: { en: 'Public Exam 3-Mark Questions', ta: 'பொதுத்தேர்வு 3 மதிப்பெண் வினாக்கள்' }, tag: { en: 'Tamil & English', ta: 'தமிழ் & ஆங்கிலம்' } },
    { file: 'PYQ PUBLIC EXAM 2 MARK QUESTION TM.pdf', title: { en: 'Public Exam 2-Mark Questions', ta: 'பொதுத்தேர்வு 2 மதிப்பெண் வினாக்கள்' }, tag: { en: 'Tamil medium', ta: 'தமிழ் வழி' } },
    { file: 'PYQ PUBLIC EXAM 3 MARK T&E.pdf', title: { en: 'Previous-Year 3-Mark Questions', ta: 'முந்தைய ஆண்டு 3 மதிப்பெண் வினாக்கள்' }, tag: { en: 'Tamil & English', ta: 'தமிழ் & ஆங்கிலம்' } },
    { file: 'PYQ PUBLIC EXAM 2 MARK T&E.pdf', title: { en: 'Previous-Year 2-Mark Questions', ta: 'முந்தைய ஆண்டு 2 மதிப்பெண் வினாக்கள்' }, tag: { en: 'Tamil & English', ta: 'தமிழ் & ஆங்கிலம்' } },
  ];

  protected openPdf(item: ExamPdf, dialog: HTMLDialogElement): void {
    this.activeExam = item;
    this.activePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('Public-Exam-Questions/' + encodeURIComponent(item.file));
    dialog.showModal();
  }

  protected closePdf(dialog: HTMLDialogElement): void {
    if (dialog.open) dialog.close();
    this.activePdfUrl = null;
    this.activeExam = null;
  }

  protected openInNewWindow(): void {
    if (this.activeExam) window.open('Public-Exam-Questions/' + encodeURIComponent(this.activeExam.file), '_blank', 'noopener');
  }

  protected closeFromBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) this.closePdf(dialog);
  }
}
