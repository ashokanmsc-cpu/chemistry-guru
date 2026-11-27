import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header';
import { Overlays } from './components/overlays';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Overlays],
  templateUrl: './app.html',
})
export class App {}
