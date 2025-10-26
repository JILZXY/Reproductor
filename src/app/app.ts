import { Component, signal } from '@angular/core';
import { Song } from './song/song';
import { TrackList } from './track-list/track-list';
import { SearchBar } from './search-bar/search-bar';

@Component({
  selector: 'app-root',
  imports: [Song, TrackList, SearchBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Reproductor_propio');
}
