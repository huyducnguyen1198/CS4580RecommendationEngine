import json

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .lib import movieEngine

@api_view(['GET'])
def getMoviebyTitle(request):
    try:
        body = json.loads(request.body)

        if 'title' not in body:
            return Response({'error': 'title not found'}, status=400)
        title = body['title']
        df = movieEngine.getDataset()
        movies = movieEngine.titlesimilarity(title, df)

        return Response(movies, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def getRandomMovies(request):
    try:
        df = movieEngine.getDataset()
        movies = movieEngine.getPastMovies(df).to_dict('records')

        return Response(movies, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
# Create your views here.

@api_view(['GET'])
def getMoviebyGenre(request):
    try:
        body = json.loads(request.body)
        print("Here", body)
        if 'genres' not in body:
            return Response({'error': 'genres not found'}, status=400)
        genres = body['genres']
        genres = genres.split('|')
        df = movieEngine.getDataset()
        movies = movieEngine.genresimilarity(df,genres ).to_json(orient='records')

        return Response(movies, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def getMoviebyYear(request):
    try:
        body = json.loads(request.body)
        print("Here", body)
        if 'year' not in body:
            return Response({'error': 'year not found'}, status=400)
        year = int(body['year'])
        df = movieEngine.getDataset()
        movies = movieEngine.getMovieRecByYear(df,year ).to_json(orient='records')

        return Response(movies, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def getMovie(request):
    try:
        print("Here", request.body)
        body = json.loads(request.body)
        required = ['year', 'genres', 'title']
        movies = movieEngine.getDataset()

        if not any(k in body for k in required):
            movies = movieEngine.getRandomMovies(movies, 10).to_dict('records')
            return Response(movies, status=200)
        year = int(body['year']) if 'year' in body else None
        genres = body['genres'].split('|') if 'genres' in body else None
        title = body['title'] if 'title' in body else None


        if title:
            movies = movieEngine.titlesimilarity(title, movies)
        if genres:
            movies = movieEngine.genresimilarity(movies,genres )[:50]
        if year:
            movies = movieEngine.getMovieRecByYear(movies,year )

        movies = movies[['title', 'genres' , 'imdbId', 'year']][:10].to_dict(orient='records')

        return Response(movies, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def getMoviebyImdb(request):
    try:
        body = json.loads(request.body)
        print("Here", body)
        if 'imdbId' not in body:
            return Response({'error': 'imdbId not found'}, status=400)
        imdbId = int(body['imdbId'])
        df = movieEngine.getDataset()

        movie = df[['title', 'genres' , 'imdbId', 'year']][df['imdbId'] == imdbId].to_dict('records')
        print(movie)
        return Response(movie, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def getMovieListbyImdb(request):
    try:
        body = json.loads(request.body)
        print("Here", body)
        if 'imdbId' not in body:
            return Response({'error': 'imdbId not found'}, status=400)
        imdbId = int(body['imdbId'])
        df = movieEngine.getDataset()

        movieList = movieEngine.getMovieRec(df, imdbId, 10).to_dict('records')

        print(movieList)
        return Response(movieList, status=200)
    except json.JSONDecodeError:
        return Response({'error': 'Invalid Json'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)