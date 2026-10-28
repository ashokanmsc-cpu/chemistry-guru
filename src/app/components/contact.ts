import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../core/language.service';
import { TranslatePipe } from '../core/translate.pipe';
import { ToastService } from '../core/toast.service';
import { RevealDirective } from '../shared/reveal.directive';
import { CLASS_OPTIONS, TOPIC_OPTIONS, TOPIC_PLACEHOLDER } from '../i18n/translations';
import { TELEGRAM_URL, WHATSAPP_NUMBER, YOUTUBE_URL } from '../config';

@Component({
  selector: 'app-contact',
  imports: [TranslatePipe, RevealDirective, ReactiveFormsModule],
  host: { style: 'display:contents' },
  template: `
    <section class="contact" id="contact">
      <div class="contact-ambient" aria-hidden="true">
        <span class="ambient-shape ambient-ring"></span>
        <span class="ambient-shape ambient-orb"></span>
        <span class="ambient-shape ambient-diamond"></span>
        <span class="ambient-shape ambient-ring-small"></span>
      </div>
      <div class="wrap">
        <div class="contact-grid">
          <div appReveal>
            <div class="kicker">{{ 'contact.kicker' | t }}</div>
            <h2>{{ 'contact.title1' | t }}<br><span>{{ 'contact.title2' | t }}</span></h2>
            <p class="lead">{{ 'contact.lead' | t }}</p>
            <ul class="contact-points">
              <li><em>01</em><span>{{ 'contact.p1' | t }}</span></li>
              <li><em>02</em><span>{{ 'contact.p2' | t }}</span></li>
              <li><em>03</em><span>{{ 'contact.p3' | t }}</span></li>
            </ul>
          </div>

          <form #formEl class="form-card" appReveal novalidate [formGroup]="form" (ngSubmit)="submit()">
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>
              <span>{{ 'form.title' | t }}</span>
            </h3>
            <p>{{ 'form.text' | t }}</p>
            <div class="form-grid">
              <div class="field">
                <label for="name">{{ 'form.name' | t }}</label>
                <input id="name" formControlName="name" required [placeholder]="'form.namePh' | t">
              </div>
              <div class="field">
                <label for="studentClass">{{ 'form.class' | t }}</label>
                <select id="studentClass" formControlName="studentClass">
                  @for (o of classOptions; track o.value) { <option [value]="o.value">{{ language.pick(o.label) }}</option> }
                </select>
              </div>
              <div class="field full">
                <label for="topic">{{ 'form.topic' | t }}</label>
                <select id="topic" formControlName="topic" required>
                  <option value="">{{ language.pick(topicPlaceholder) }}</option>
                  @for (o of topicOptions; track o.value) { <option [value]="o.value">{{ language.pick(o.label) }}</option> }
                </select>
              </div>
              <div class="field full">
                <label for="message">{{ 'form.message' | t }}</label>
                <textarea id="message" formControlName="message" required [placeholder]="'form.messagePh' | t"></textarea>
              </div>
            </div>
            <button class="whatsapp-btn" type="submit"><span>{{ 'form.submit' | t }}</span></button>
            <div class="form-note">{{ 'form.note' | t }}</div>
          </form>
        </div>

        <div class="footer-bottom">
          <div>© {{ year }} Chemistry Guru · Dr. Ashokan P</div>
          <div>{{ 'footer.made' | t }} · <a href="#home">{{ 'footer.top' | t }}</a> · <a href="ta/">{{ 'footer.tamilPage' | t }}</a></div>
          <div class="footer-social">
            <a [href]="youtube" target="_blank" rel="noopener" aria-label="YouTube"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></a>
            <a [href]="telegram" target="_blank" rel="noopener" aria-label="Telegram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3l-3.2 15.1c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3c.9-.3 1.7.2 1.4 1.3z"/></svg></a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  protected readonly language = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly formEl = viewChild.required<ElementRef<HTMLFormElement>>('formEl');

  protected readonly classOptions = CLASS_OPTIONS;
  protected readonly topicOptions = TOPIC_OPTIONS;
  protected readonly topicPlaceholder = TOPIC_PLACEHOLDER;
  protected readonly year = new Date().getFullYear();
  protected readonly youtube = YOUTUBE_URL;
  protected readonly telegram = TELEGRAM_URL;

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    studentClass: ['Class XII'],
    topic: ['', Validators.required],
    message: ['', Validators.required],
  });

  protected submit(): void {
    const { name, studentClass, topic, message } = this.form.getRawValue();
    if (this.form.invalid || !name.trim() || !message.trim()) {
      this.formEl().nativeElement.reportValidity();
      this.toast.show(this.language.t('form.required'));
      return;
    }
    const classLabel = this.language.pick(CLASS_OPTIONS.find(o => o.value === studentClass)!.label);
    const topicLabel = this.language.pick(TOPIC_OPTIONS.find(o => o.value === topic)!.label);

    const text = this.language.lang() === 'ta'
      ? `வணக்கம் Chemistry Guru / Dr. Ashokan P,\n\nஎனக்கு ஒரு விசாரணை உள்ளது.\nபெயர்: ${name.trim()}\nவகுப்பு: ${classLabel}\nதலைப்பு: ${topicLabel}\nசெய்தி: ${message.trim()}\n\nநன்றி.`
      : `Hello Chemistry Guru / Dr. Ashokan P,\n\nI would like to make an enquiry.\nName: ${name.trim()}\nClass / Standard: ${classLabel}\nTopic: ${topicLabel}\nMessage: ${message.trim()}\n\nThank you.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }
}
