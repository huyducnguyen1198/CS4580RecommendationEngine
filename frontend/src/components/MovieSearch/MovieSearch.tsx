import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageContainer from './PageContainer';
import SortOption from './SortOption/SortOption';
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./MovieCardContainer.module.css";
/************************/
/* just some css styling */
/************************/
const movieDetailsStyle = {
  backgroundColor: '#f8f9fa', // Light gray background
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Box shadow for a subtle effect
};

/*******************************/
/*    Movie interface           */
/*******************************/
interface Movie {
    //backend data
    title: string;
    genres: string;
    imdbId: string;
    year: string;
    jaccard : number;
    cosine : number;
    jac_cos : number;

    //api data
    poster: string;
    rated: string|null;
}


/*******************************/
/*    MoviePage component       */
/*******************************/

const MoviePage: React.FC = () => {
    const { imdbID } = useParams();

    const [sortOption, setSortOption] = React.useState<string[]>([]);
    const handleSortChange = (opt: string, isChecked: boolean) => {
        if (isChecked) {
            setSortOption([...sortOption, opt]);
        } else {
            setSortOption(sortOption.filter((o) => o !== opt));
        }
    }
    useEffect (() => {
        console.log(sortOption);
    }, [sortOption]);

    /*******************************/
    /*       Fetch movie by imdbID */
    /*******************************/
    const [movie, setMovie] = React.useState<Movie | null>(null);
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios({
                    method: "POST",
                    url: "http://localhost:8000/api/movies/imdb/",
                    data: { imdbId: imdbID },
                });
                const json = await res.data;
                setMovie(json[0]);
            } catch (error) {
                console.log(error);
                throw error;
            }
        };
        fetchMovie();
    }, [imdbID]);

    useEffect(() => {
        console.log(movie);
    }, [movie]);

    /************************************/
    /*       Fetch movie list by imdbID */
    /************************************/
    const [movieList, setMovieList] = React.useState<Movie[]>([]);
    const [compl, setCompl] = React.useState<Movie[]>([]);
    useEffect(() => {
        const fetchMovieList = async () => {
            try {
                const res = await axios({
                    method: "POST",
                    url: "http://localhost:8000/api/movies/listbyimdb/",
                    data: { imdbId: imdbID },
                });
                const json = await res.data;
                setMovieList(json);
            } catch (error) {
                console.log(error);
                throw error;
            }
        };

        fetchMovieList();
    }, [imdbID]);

    useEffect(() => {
        const completeMovieList = async (mov: Movie) => {
            const padWithLeadingZeros = (s: string, targetLength: number): string => {
                s = String(s)
                while (s.length < targetLength) {
                    s = '0' + s;
                }
                return s;
            };
    
            const imdb = "tt" + padWithLeadingZeros(mov.imdbId, 7);
            //console.log(imdb);
            /*list of key
                f451c5dd
                4daa1e35
                7cb0f304
            */
            const response = await fetch(`https://www.omdbapi.com/?i=${imdb}&apikey=7cb0f304`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
    
            const movieData: any = await response.json();  

            mov.poster = movieData.Poster;
            mov.rated = movieData.Rated;
        };

        const completeList = movieList.map(async (mov) => {
            await completeMovieList(mov);
            return mov;
        });
        Promise.all(completeList).then((res) => {
            setCompl(res);
        });

    }, [movieList]);

    console.log(compl);


    // Fetch and display movie details using imdbID
    return (
        <PageContainer>
            <div style={movieDetailsStyle}>
                    <h1>Movie Details</h1>
            <p>
                <strong>IMDb ID:</strong> {imdbID}
            </p>
            <p>
                <strong>Title:</strong> {movie?.title}
            </p>
            <p>
                <strong>Genres:</strong> {movie?.genres}
            </p>
            <p>
                <strong>Year:</strong> {movie?.year}
            </p>
                <SortOption onSortChange={handleSortChange} />
            </div>
            <Col md={10}>
                <Container>
                    <Row>
                    {movieList.map((movie, index) => (
                        <Col md={4} key={movie.imdbId}>
                        <Card
                            style={{ width: "15rem", margin: "2px", cursor: "pointer" }}
                        >
                            <Card.Img variant="top" src={movie.poster} />
                            <Card.Body>
                            <Card.Title>{movie.title}</Card.Title>
                            <Card.Text>
                                <div>Genre: {movie.genres}</div>
                                <div>IMDB ID: {movie.imdbId}</div>
                                <div>Year: {movie.year}</div>
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
                    </Row>
                </Container>
                </Col>

        </PageContainer>
    );
};

export default MoviePage;
