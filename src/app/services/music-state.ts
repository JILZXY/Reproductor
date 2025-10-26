import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotifyApiService } from './spotify-api';
import { Track } from '../models/track.models';
import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class MusicStateService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  public currentTrack$ = this.currentTrackSubject.asObservable();

  private trackListSubject = new BehaviorSubject<Track[]>([]);
  public trackList$ = this.trackListSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private spotifyApi: SpotifyApiService) {}

  public selectTrack(track: Track): void {
    if (!track || !track.id) {
      this.setError('Canción inválida');
      return;
    }

    this.clearError();
    this.currentTrackSubject.next(track);
    this.trackListSubject.next([]); 
  }

  public selectAlbum(album: Album): void {
    if (!album || !album.id) {
      this.setError('Álbum inválido');
      return;
    }

    this.clearError();
    this.loadingSubject.next(true);

    this.spotifyApi.getAlbumTracks(album.id).subscribe({
      next: (tracks) => {
        if (tracks.length === 0) {
          this.setError('No se encontraron canciones en este álbum');
          this.loadingSubject.next(false);
          return;
        }

        this.currentTrackSubject.next(tracks[0]);
        this.trackListSubject.next(tracks);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.setError('Error al cargar las canciones del álbum');
        this.loadingSubject.next(false);
        console.error('Error al cargar álbum:', error);
      }
    });
  }

  public selectArtist(artist: Artist): void {
    if (!artist || !artist.id) {
      this.setError('Artista inválido');
      return;
    }

    this.clearError();
    this.loadingSubject.next(true);

    this.spotifyApi.getArtistTopTracks(artist.id).subscribe({
      next: (tracks) => {
        if (tracks.length === 0) {
          this.setError('No se encontraron canciones de este artista');
          this.loadingSubject.next(false);
          return;
        }

        this.currentTrackSubject.next(tracks[0]);
        this.trackListSubject.next(tracks);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.setError('Error al cargar las canciones del artista');
        this.loadingSubject.next(false);
        console.error('Error al cargar artista:', error);
      }
    });
  }

  public getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  public getTrackList(): Track[] {
    return this.trackListSubject.value;
  }

  public hasTrackList(): boolean {
    return this.trackListSubject.value.length > 0;
  }

  public clearSelection(): void {
    this.currentTrackSubject.next(null);
    this.trackListSubject.next([]);
    this.clearError();
  }

  private setError(message: string): void {
    this.errorSubject.next(message);
  }

  public clearError(): void {
    this.errorSubject.next(null);
  }

  public hasError(): boolean {
    return this.errorSubject.value !== null;
  }

  public getError(): string | null {
    return this.errorSubject.value;
  }
}