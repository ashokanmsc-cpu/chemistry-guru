import { Component } from '@angular/core';
import { Hero } from './hero';
import { Marquee } from './marquee';
import { ChapterList } from './chapter-list';
import { Downloads } from './downloads';
import { PublicExamQuestions } from './public-exam-questions';
import { PeriodicTable } from './periodic-table';
import { LatestVideos } from './latest-videos';
import { Testimonials } from './testimonials';
import { PptLibrary } from './ppt-library';
import { Contact } from './contact';

@Component({
  selector: 'app-home',
  imports: [Hero, Marquee, ChapterList, Downloads, PublicExamQuestions, PeriodicTable, Testimonials, PptLibrary, LatestVideos, Contact],
  host: { style: 'display:contents' },
  template: `
    <app-hero />
    <app-marquee />
    <app-chapter-list />
    <app-downloads />
    <app-public-exam-questions />
    <app-periodic-table />
    <app-testimonials />
    <app-ppt-library />
    <app-latest-videos />
    <app-contact />
  `,
})
export class Home {}
