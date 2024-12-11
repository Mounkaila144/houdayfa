// rating.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private ratingBaseUrl = "http://localhost:5001/api"; // URL de votre backend scraping

  constructor(private http: HttpClient) {}

  getRating(imdbId: string): Observable<any> {
    return this.http.get<any>(`${this.ratingBaseUrl}/imdb-rating?imdb_id=${imdbId}`);
  }
}
