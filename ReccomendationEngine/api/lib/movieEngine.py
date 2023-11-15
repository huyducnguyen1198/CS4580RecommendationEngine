import Levenshtein as lev
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

pd.set_option('expand_frame_repr', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_colwidth', None)



#############################################
#               Preprocessing                #
#############################################

def editIMDB(df):
    def edit(row):
        return 'tt' + str(row).zfill(7)

    df['imdbId'] = df['imdbId'].map(edit)
    return df

    # extract genres from a string and remove no genre listed


def extractGenre(df):
    genre = df['genres'].map(lambda x: x.split('|'))
    allGen = np.unique(np.concatenate(genre.values))
    allGen = allGen.tolist()
    allGen.remove('(no genres listed)')
    return genre, allGen

    # mappeing genres to a binary vector each column is a genre


def transformGenre(df):
    genre, allGen = extractGenre(df)

    def mapGenre(row):
        return [1 if g in row else 0 for g in allGen]

    mappedGen = genre.map(mapGenre)
    ##binary array to dataframe with column names
    mappedGen = mappedGen.apply(pd.Series)
    mappedGen.columns = allGen
    df = df.join(mappedGen)
    return df, allGen

    # extract year from title and add it as a feature and remove year from title
    # used for movies.csv not moviesWRating.csv


def extractYear(df):
    def getYear(row):
        year = row.split('(')[-1].split(')')[0]
        if year.isdigit():
            return int(year)
        return 0

    df['year'] = df['title'].map(getYear)
    df['title'] = df['title'].map(lambda x: x.split('(')[0])
    return df



###############################################################
#                   GET KNN MOVIE BASED ON TITLE              #
#                   USING Lavenshtien distance                #
###############################################################

def titlesimilarity(title, df_t, n=10):
    '''Calculate similarity between title and all titles in df
        using lavenshtien distance
        :arg:
            - df: dataframe
            - title: string
            - n: number of similar titles to return
        :return:
            - n similar titles location in df(index)
    '''

    def similarity(row, test):
        '''Calculate similarity between two strings using lavenshtien distance
            Typically used for dataframe.apply()
            :arg:
                - row: string
                - test: string
            :return:
                - similarity: float
        '''
        lavenshtienDistance = lev.distance(row, test)
        similarity = 1 - (lavenshtienDistance / max(len(row), len(test)))
        return similarity
    # Calculate lavenshtien similarity for each movie's title
    # Then sort it by similarity descending
    lavenshtien = df_t['title'].apply(lambda x: similarity(x, title))
    firstTen = lavenshtien.sort_values(ascending=False)[:n]
    # firstTenName = df.loc[firstTen.index]['title']
    return df_t.loc[firstTen.index]


############################################################
#                   GET KNN MOVIE BASED ON GENRES          #
#                   USING Jaccard Similarity               #
############################################################

allGen = ['Action', 'Adventure', 'Animation', 'Children',
          'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy',
          'Film-Noir', 'Horror', 'IMAX', 'Musical', 'Mystery',
          'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']


def genresimilarity(df, genres=['Drama', 'Comedy'], p=.5):
    '''
    Get a list of similar movies by genre.
    Using jacard similarity
    :param df: dataframe that contain genres column by default a|b|c|d
    :param genres: an array of genres
    :param p: percentage of similarity
    :return: n similar movies location in df(index)
    '''

    def jacard_similarity(row, query):
        '''
        Calculate similarity between two sets using jacard distance
        Typically used for dataframe.apply()
        :arg:
            - row: df row
            - test: set
        :return:
            - similarity: float
        '''

        def getGenre(genre):
            '''
            df default genres is in for a|b|c|d
            this method split it into a list.
            :param genre:
            :return: list of genres:String[]
            '''

            return genre.split('|')

        def createGenreList(genreList):
            '''create and check list of genres using allGen
            :param genreList:String[], a list  string of genres from user input
            :return: a list of official genres
            '''
            l = []
            for g in allGen:
                if g in genreList:
                    l.append(g)
                if g not in allGen:
                    print(f'{g} not in {allGen}')
            return l

        row = set(getGenre(row))
        test = set(createGenreList(query))
        num = len(row.intersection(test))
        den = len(row.union(test))
        return float(num) / float(den)

    # Calculate jaccard similarity for each movie's genres
    # Then sort it by similarity descending
    jaccard = df['genres'].apply(lambda x: jacard_similarity(x, genres))
    genresSortedBySimilarity = jaccard.sort_values(ascending=False)
    #print(df.loc[(genresSortedBySimilarity > p).index][:10])
    return df.loc[(genresSortedBySimilarity > p).index]


def getMovieRec(df_rec, imdb,  n=10, random_state=0):
    '''
    Get recommendation based on a reference movie
    :param df_rec:
    :param imdb: imdbId of reference movie
    :param n: number of movies to return
    :param random_state:
    :return: knn movies to past movies
    '''




    # Remove past movies from df_rec
    # so that it won't recommend past movies
    i = df_rec[df_rec['imdbId'] == imdb].index
    movie = df_rec[df_rec['imdbId'] == imdb]

    df_rec = df_rec.drop(i, axis=0)
    refGenres = movie['genres'].values[0]
    # Get weighted_jaccard_similarity for past genres
    # Using weight from getWeightForJaccard()(count of each genres in past movies)
    # Then calculate weighted jaccard similarity using getJaccardSim()
    # Finally, add weighted jaccard similarity to df_rec
    def getJaccardSim(row, ref):
        ''' Get weighted jaccard similarity
        :param row: row of dataframe
        :param weight: dict of genres and its weight(count) index is the same as allGen {'Action': 1, 'Adventure': 2, etc.}
        :return: weighted jaccard similarity
        '''

        row = row.split('|')
        ref = ref.split('|')
        row = set(row)
        ref = set(ref)
        numerator = len(row.intersection(ref))
        denominator = len(row.union(ref))
        return numerator / denominator

    # Get weighted_jaccard_similarity for past genres
    # Using weight from getWeightForJaccard()(count of each genres in past movies)
    # Then calculate weighted jaccard similarity using getJaccardSim()
    # Finally, add weighted jaccard similarity to df_rec

    jaccard = df_rec['genres'].apply(lambda x: getJaccardSim(x, refGenres))
    df_rec['jaccard'] = jaccard

    #year
    # Get year similarity between reference movie and all movies
    # Then add year similarity to df_rec
    df_rec['yearDif'] = df_rec['year'].apply(lambda x: getYearDif(x, movie['year'].values[0]))
    df_rec['yearSim'] = -(1 - df_rec['yearDif'] / df_rec['yearDif'].abs().max())
    df_rec.drop('yearDif', axis=1, inplace=True)



    # Get movied based on tfidf-cosine similarity on past title
    # First get tfidf vectorizer of all titles
    # Then combine all past titles into one string
    #       and transform past titles into tfidf vector
    # Final, Calculate cosine similarity between past titles
    #       and all titles via tfidf vector
    tfidf = TfidfVectorizer()
    tfidf.fit(df_rec['title'])
    movVec = tfidf.transform([movie['title'].values[0]])

    df_vector = tfidf.transform(df_rec['title'])
    df_rec['cosine'] = cosine_similarity(df_vector, movVec)

    #  Combine jaccard and cosine similarity
    #  using 20% jaccard and 80% cosine
    df_rec['JacCosScore'] = 0.4 * df_rec['jaccard'] + 0.6 * df_rec['cosine']
    return df_rec.sort_values(by='JacCosScore', ascending=False)[:n]


##########################################
#           Get Recommendation           #
#           Based on Year                #
##########################################

def getYearDif(year1, year2):
    '''
    Get difference between two years
    :param year1:
    :param year2:
    :return: difference
    '''
    return year1 - year2
def getMovieRecByYear(df_rec, yearRef=2020, n=10, random_state=0):
    '''
    Get recommendation based on past movies
    :param df_rec:
    :param n: number of movies to return
    :param random_state:
    :return: knn movies to past movies
    '''
    df_rec['yearDif'] = df_rec['year'].apply(lambda x: getYearDif(x, yearRef))
    df_rec['yearScore'] = 1 - df_rec['yearDif'] / df_rec['yearDif'].max()
    return df_rec.sort_values(by='yearScore', ascending=False)[:n]


##########################################
#           Get Recommendation           #
#         Based on a list of IMDB        #
##########################################
def getWeightForJaccard(arr=[]):
    '''
    Get weight for jaccard distance based on past movies,
    :param arr: array of list of genres [['Action', 'Children', etc.][][]]
    :return: weight: dict of genres and its weight(count) index is the same as allGen [0,1,...]
    '''
    if len(arr) == 0:
        return None
    weight = {'Total': 0}
    for m in arr:
        for g in m:
            if g in weight:
                weight[g] += 1
            else:
                weight[g] = 1
            weight['Total'] += 1
    return weight
def getMovieRecByImdbList(df_rec, imdbList,  n=10, random_state=0):
    '''
    Get recommendation based on a list of movies' imdbId
    :param df_rec:
    :param n: number of movies to return
    :param random_state:
    :return: knn movies to past movies
    '''


    # Load and check past movies
    imdbList = [int(i) for i in imdbList]
    ref_df = df_rec[df_rec['imdbId'].isin(imdbList)]
    if ref_df is None:
        return df_rec.sample(n, random_state=random_state)
    weight = getWeightForJaccard(ref_df['genres'].map(lambda x: x.split('|')).tolist())
    if weight is None:
        return df_rec.sample(n, random_state=random_state)

    # Remove past movies from df_rec
    # so that it won't recommend past movies
    df_rec = df_rec.drop(ref_df.index)

    # Get weighted_jaccard_similarity for past genres
    # Using weight from getWeightForJaccard()(count of each genres in past movies)
    # Then calculate weighted jaccard similarity using getJaccardSim()
    # Finally, add weighted jaccard similarity to df_rec
    def getJaccardSim(row, weight):
        ''' Get weighted jaccard similarity
        :param row: row of dataframe
        :param weight: dict of genres and its weight(count) index is the same as allGen {'Action': 1, 'Adventure': 2, etc.}
        :return: weighted jaccard similarity
        '''

        row = row.split('|')
        numerator = 0
        denominator = weight['Total']
        for g in row:
            if g in weight:
                numerator += weight[g]
        return numerator / denominator

    jaccard = df_rec['genres'].apply(lambda x: getJaccardSim(x, weight))
    df_rec['jaccard'] = jaccard

    # Get movied based on tfidf-cosine similarity on past title
    # First get tfidf vectorizer of all titles
    # Then combine all past titles into one string
    #       and transform past titles into tfidf vector
    # Final, Calculate cosine similarity between past titles
    #       and all titles via tfidf vector
    tfidf = TfidfVectorizer()
    tfidf.fit(df_rec['title'])
    '''pastDf_vector = tfidf.transform(pastDf['title'])
    cosine_similarities = (cosine_similarity(df_vector, pastDf_vector) + 1)/2.0
    df_rec['cosine'] = cosine_similarities.mean(axis=1)'''
    pastTit = ' '.join(ref_df['title'].tolist())
    pastTit_vector = tfidf.transform([pastTit])

    df_vector = tfidf.transform(df_rec['title'])
    df_rec['cosine'] = cosine_similarity(df_vector, pastTit_vector)

    #  Combine jaccard and cosine similarity
    #  using 20% jaccard and 80% cosine
    df_rec['JacCosScore'] = 0.2 * df_rec['jaccard'] + 0.8 * df_rec['cosine']
    return df_rec.sort_values(by='JacCosScore', ascending=False)[:n]

##########################################
#           Get Recommendation           #
#           randomly                    #
##########################################
def getRandomMovies(df, n=10):
    return df.sample(n)

##########################################
#           Get Dataset                  #
##########################################

def getDataset():
    df = pd.read_csv('api/lib/movies.csv')
    df = extractYear(df)
    #df, allGen = transformGenre(df)
    return df
