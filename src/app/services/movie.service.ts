import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Movie} from "../common/movie";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  //baseURI = 'http://localhost:3000/api/movies/';
   baseURI = 'https://nodedamcmovies2023-aby8.onrender.com/api/movies'; //esto es para poder meterte en la API desplegada online


  constructor(private http: HttpClient) { }

  getMovieList(): Observable<Movie[]>{
    return this.http.get<Movie[]>(this.baseURI);
  }

  getGenres(): Observable<string[]>{
    return this.http.get<string[]>(this.baseURI+'genres');
  }

  updateMovie(id: string, movie: Movie): Observable<any>{
    return this.http.put<any>(this.baseURI+id, movie);
  }

  addMovie(movie: Movie): Observable<any>{
    return this.http.post<any>(this.baseURI, movie);
  }

  deteleMovie(id: string): Observable<any>{
    return this.http.delete<any>(this.baseURI+id);
  }

}
