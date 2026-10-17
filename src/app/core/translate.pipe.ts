import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './language.service';
import { TranslationKey } from '../i18n/translations';

/** `{{ 'hero.title1' | t }}` — re-evaluates when the language signal changes. */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly language = inject(LanguageService);

  transform(key: TranslationKey): string {
    return this.language.t(key);
  }
}
