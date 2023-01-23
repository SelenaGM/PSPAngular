import {Component, OnInit} from '@angular/core';
import {Imdb, Movie} from "../../common/movie";
import {MovieService} from "../../services/movie.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit{

  formMovie: FormGroup = this.formBuilder.group({
    _id: [''],
    imdb: this.formBuilder.group({
      rating: [0],
      votes:[0]
    }),
    title: [''],
    year: [2023],
    director: [''],
    plot: [''],
    poster: [''],
    genres: [[],[Validators.required]], //así lo hacemos obligatorio
    __v : ['']
  })

  movies: Movie[] = [];

  //Esto es para poder añadirle más generos a la película
  myNewGenre = new FormGroup(
    {
      newGenre: new FormControl('')
    }
  );

  genres: string[] = [];

  editar = false;

  constructor(private movieService : MovieService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.loadMovies();
  }

  //GETTERS
  get title(): any {
    return this.formMovie.get('title')?.value;
  }
  get year(): any {
    return this.formMovie.get('year')?.value;
  }
  get director(): any {
    return this.formMovie.get('director')?.value;
  }
  get plot(): any {
    return this.formMovie.get('plot')?.value;
  }
  get genresF(): any {
    return this.formMovie.get('genresF')?.value;
  }
  get poster(): any {
    return this.formMovie.get('poster')?.value;
  }
  get rating(): any {
    return this.formMovie.get('imdb.rating')?.value;
  }
  get votes(): any {
    return this.formMovie.get('imdb.votes')?.value;
  }
  get newGenre(): any {
    return this.myNewGenre.get('newGenre')?.value;
  }


  private loadMovies() {
    //conecta a nuestro servicio para conectarse a la API
    this.movieService.getMovieList().subscribe(
      //si suelto da error ponerlo asi (data:Movie[])
      data => {
        this.movies = data;
      }
    );

    this.movieService.getGenres().subscribe(
      data => this.genres = data
    );

  }

  newMovie() {
    this.formMovie.reset(); //reseteamos el formulario
    this.editar = false; //ponemos el editar en falso.

  }

  loadMovie(movie: Movie) {
    this.formMovie.setValue(movie);
    this.editar = true;
  }

  removeMovie(movie: Movie) {
    if(confirm('Desea borrar '+movie.title+'?')){
      this.movieService.deteleMovie(movie._id).subscribe(
        data=> this.loadMovies()
      )
    }

  }

  addNewGenre(newGenre: any) {
      let newGenres;
      if(!this.editar)this.genres.push(newGenre) //funcion para añadir generos, si no estamos editando(es nuevo), lo metemos desde cero.
      else{
        //si estamos editando
        newGenres = this.formMovie.getRawValue().genres; //metemos los generos actuales en un auxiliar
        newGenres.push(newGenre); //añadimos el nuevo
        this.formMovie.setControl('genres', new FormControl(newGenres)) //añadimos el control de los generos
      }
      this.myNewGenre.reset();

  }

  onSubmit(form: any) {

    if(form.valid){
    if(this.editar){
      const id = this.formMovie.getRawValue()._id; //guardamos el id en la variable
      this.movieService.updateMovie(id, this.formMovie.getRawValue()) //le pasamos la id y la pelicula para que en el movie.service se reciba
        .subscribe(data => this.loadMovies()); //llamamos a la funcion de cargar las peliculas otra vez
    }else{
      this.movieService.addMovie(this.formMovie.getRawValue()) //el getRawValue coge la información del form y lo transforma en json
        .subscribe(data => this.loadMovies());
    }
  }
  }
}
