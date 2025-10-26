import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth';
import { Track, TrackMapper } from '../models/track.models';
import { Album, AlbumMapper } from '../models/album.model';
import { Artist, ArtistMapper } from '../models/artist.model';
import { SearchResult, SearchResultMapper } from '../models/search-result.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private readonly API_URL = environment.spotify.API_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    let errorMessage = `Error en ${context}`;

    if (error.status === 0) {
      errorMessage = 'Error de conexión. Verifica tu internet';
    } else if (error.status === 401) {
      errorMessage = 'Token expirado. Renovando...';
      this.authService.forceRefreshToken().subscribe();
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 429) {
      errorMessage = 'Demasiadas peticiones. Intenta más tarde';
    } else if (error.error?.error?.message) {
      errorMessage = error.error.error.message;
    }

    console.error(`${context}:`, errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  public search(query: string, limit: number = 3): Observable<SearchResult> {
    if (!query || query.trim().length === 0) {
      return of(SearchResultMapper.createEmpty());
    }

    const url = `${this.API_URL}/search`;
    const params = {
      q: query.trim(),
      type: 'track,album,artist',
      limit: limit.toString(),
      market: 'US'
    };

    return this.http.get<any>(url, { 
      headers: this.getAuthHeaders(), 
      params 
    }).pipe(
      retry(1), 
      map(response => {
        if (!response) {
          return SearchResultMapper.createEmpty();
        }
        return SearchResultMapper.fromSpotifySearch(response);
      }),
      catchError(error => {
        console.error('Error en búsqueda:', error);
        return of(SearchResultMapper.createEmpty());
      })
    );
  }

  public isAuthenticated(): boolean {
    return this.authService.hasValidToken();
  }
}
