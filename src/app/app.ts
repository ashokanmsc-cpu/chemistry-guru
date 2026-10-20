import { Component } from '@angular/core';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Marquee } from './components/marquee';
import { ChapterList } from './components/chapter-list';
import { Downloads } from './components/downloads';
import { LatestVideos } from './components/latest-videos';
import { Testimonials } from './components/testimonials';
import { PptLibrary } from './components/ppt-library';
import { Contact } from './components/contact';
import { Overlays } from './components/overlays';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Marquee, ChapterList, Downloads, Testimonials, PptLibrary, LatestVideos, Contact, Overlays],
  templateUrl: './app.html',
})
export class App {}
