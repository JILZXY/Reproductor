import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Song } from './song/song';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Song],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Reproductor_propio');
}
