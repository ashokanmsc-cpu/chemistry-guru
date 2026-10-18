import { Component } from '@angular/core';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Marquee } from './components/marquee';
import { ChapterList } from './components/chapter-list';
import { LatestVideos } from './components/latest-videos';
import { Contact } from './components/contact';
import { Overlays } from './components/overlays';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Marquee, ChapterList, LatestVideos, Contact, Overlays],
  templateUrl: './app.html',
})
export class App {}
