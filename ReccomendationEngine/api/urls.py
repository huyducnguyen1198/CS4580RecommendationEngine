from django.urls import path
from .views import *

urlpatterns = [
    path('movies/', getMovie, name='movie-recommendation'),
    path('movies/title/', getMoviebyTitle, name='movie-recommendation'),
    path('movies/random/', getRandomMovies, name='random-movies'),
    path('movies/genres/', getMoviebyGenre, name='genre-recommendation'),
    path('movies/year/', getMoviebyYear, name='year-recommendation'),
    path('movies/imdb/', getMoviebyImdb, name='imdb-recommendation'),
    path('movies/listbyimdbs/', getMovieRecByImdbList, name='imdb-list-recommendation'),

]