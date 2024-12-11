import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from 'src/app/services/movies.service';
import {RatingService} from "../../rating-service.service";


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {

  getMovieDetailResult?: any;
  getMovieVideoResult?: any;
  getMovieCastResult?: any;
  rating?: string; // Nouveau champ pour stocker la note

  constructor (private moviesService: MoviesService, private router: ActivatedRoute, private title: Title, private meta: Meta,private ratingService: RatingService) { }

  ngOnInit (): void {
    let getParamId = this.router.snapshot.paramMap.get('id');
    console.log(getParamId, 'getparamid#');

    this.getMovie(getParamId);
    this.getVideo(getParamId);
    this.getMovieCast(getParamId);
  }

  getMovie (id: any) {
    this.moviesService.getMovieDetails(id).subscribe(async (result) => {
      console.log(result, 'getmoviedetails#');
      this.getMovieDetailResult = await result;

      // updatetags
      this.title.setTitle(`${this.getMovieDetailResult.original_title} | ${this.getMovieDetailResult.tagline}`);
      this.meta.updateTag({ name: 'title', content: this.getMovieDetailResult.original_title });
      this.meta.updateTag({ name: 'description', content: this.getMovieDetailResult.overview });

      // facebook
      this.meta.updateTag({ property: 'og:type', content: "website" });
      this.meta.updateTag({ property: 'og:url', content: `` });
      this.meta.updateTag({ property: 'og:title', content: this.getMovieDetailResult.original_title });
      this.meta.updateTag({ property: 'og:description', content: this.getMovieDetailResult.overview });
      this.meta.updateTag({ property: 'og:image', content: `https://image.tmdb.org/t/p/original/${this.getMovieDetailResult.backdrop_path}` });

      // Récupération de l'IMDb ID et appel du service de rating
      const imdbId = this.getMovieDetailResult.imdb_id;
      console.log('id imbd '+imdbId)
      if (imdbId) {
        this.ratingService.getRating(imdbId).subscribe((ratingData) => {
          console.log('Rating data:', ratingData);
          this.rating = ratingData.rating; // Supposez que votre backend renvoie { rating: "9.3" }
          console.log('data'+ratingData)
        });
      }
    });
  }

  getVideo (id: any) {
    this.moviesService.getMovieVideo(id).subscribe((result) => {
      console.log(result, 'getMovieVideo#');
      result.results.forEach((element: any) => {
        if (element.type == "Trailer") {
          this.getMovieVideoResult = element.key;
        }
      });

    });
  }

  getMovieCast (id: any) {
    this.moviesService.getMovieCast(id).subscribe((result) => {
      console.log(result, 'movieCast#');
      this.getMovieCastResult = result.cast;
    });
  }

  protected readonly Math = Math;
  protected readonly Number = Number;
}
