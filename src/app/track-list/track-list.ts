import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MusicStateService } from '../services/music-state';
import { Track } from '../models/track.models';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-list.html',
  styleUrls: ['./track-list.css']
})
export class TrackList implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentTrack: Track | null = null;
  isLoading = false;

  private subscriptions: Subscription[] = [];

  constructor(private musicState: MusicStateService) {}

  ngOnInit(): void {
    const tracksSub = this.musicState.trackList$.subscribe(tracks => {
      this.tracks = tracks;
    });

    const currentSub = this.musicState.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    const loadingSub = this.musicState.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    this.subscriptions.push(tracksSub, currentSub, loadingSub);
  }

  selectTrack(track: Track): void {
    if (!track || !track.id) {
      console.error('Canción inválida');
      return;
    }
    this.musicState.selectTrack(track);
  }

  isCurrentTrack(track: Track): boolean {
    return this.currentTrack?.id === track.id;
  }

  getDuration(ms: number): string {
    if (!ms) return '0:00';
    
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getTrackNumber(index: number): string {
    return (index + 1).toString().padStart(2, '0');
  }

  hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  getTrackCount(): string {
    const count = this.tracks.length;
    return `${count} canción${count !== 1 ? 'es' : ''}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
