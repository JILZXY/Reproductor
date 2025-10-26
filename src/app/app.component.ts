import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from './search-bar/search-bar';
import { Song } from './song/song';
import { TrackList } from './track-list/track-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchBar,
    Song,
    TrackList
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spotify Player';
}