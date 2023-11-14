import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import styles from "./MovieCardContainer.module.css"; // We'll create this CSS module next
import axios from "axios";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../filter/YearDropDownBox"
import YearDropdown from "../filter/YearDropDownBox";
import MovieGenres from "../filter/GenreFilter"
import Page from "../filter/pagination";


const dbUrl = process.env.DATABASE_URL;
console.log("URL:" + dbUrl);
// Sample data for movie cards
const movies = [
    {
        title: "Inception",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt13756f66",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt1374f444",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt1374v444",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt13745444",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt13744`44",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt1374444",
        year: "2010",
        rated: "PG-13",

    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt13174444",
        year: "2010",
        rated: "PG-13",
    },
    {
        title: "BLablabla",
        genres: ["Action", "Adventure", "Sci-Fi"],
        posterUrl: "https://example.com/poster1.jpg",
        imdbId: "tt13743444",
        year: "2010",
        rated: "PG-13",
    },
    // Add more movie objects here...
];
interface Movie {
    title: string;
    genres: string[];
    posterUrl: string;
    imdbId: string;
    year: string;
    rated: string;
    plot: string;
}

interface MovieTitleProps {
    searchTitle: string;
}

interface queryData {
    title?: string;
    year?: string;
    genres?: string;
}

/*************************/
/* backend Movie props  */
/*************************/
interface MovieProps {
    title: string;
    genres: string;
    posterUrl: string;
    imdbId: string;
    year: string;
    rated: string;
};

const modifyMovie = async (movie: MovieProps): Promise<Movie> => {
    try {
        const padWithLeadingZeros = (s: string, targetLength: number): string => {
            s = String(s)
            while (s.length < targetLength) {
                s = '0' + s;
            }
            return s;
        };

        const imdb = "tt" + padWithLeadingZeros(movie.imdbId, 7);
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
        const m: Movie = {
            //from backend
            imdbId: movie.imdbId,
            title: movie.title,
            genres: movie.genres.split("|"),
            year: movie.year,
            //from omdb
            posterUrl: movieData.Poster,
            rated: movieData.Rated,
            plot: movieData.Plot,
        }

        return m;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const MovieCardContainer: React.FC<MovieTitleProps> = ({ searchTitle }) => {
    /***************************/
    /* Fetch data from backend */
    /***************************/
    const [qdata, setData] = useState<MovieProps[]>([]);
    /****************************/
    /* complete movie list */
    /****************************/
    const [moviesList, setMovies] = useState<Movie[]>([]);


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get the selected movie from the card
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const handleCardClick = (movie: Movie) => {
        setSelectedMovie(movie); // Update the selectedMovie state
    };

    /***************************/
    /* Get the selected year */
    /***************************/
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    /***************************/
    /* Get the selected genres */
    /***************************/
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const handleGenreChange = (genre: string, isChecked: boolean) => {

        if (isChecked) {
            setSelectedGenres([...selectedGenres, genre]);

        } else {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));

        }
    }


    /***************************/
    /* Fetch data from backend */
    /***************************/
    useEffect(() => {
        const query: queryData = {};
        if (searchTitle) {
            query["title"] = searchTitle;
        }
        if (selectedYear) {
            query["year"] = selectedYear;
        }
        if (selectedGenres.length > 0) {
            query["genres"] = selectedGenres.join("|");
        }
        const fetchData = async () => {
            try {
                const res = await axios({
                    method: "POST",
                    url: "http://localhost:8000/api/movies/",
                    data: query,
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError("Failed to fetch data");
                setLoading(false);
            }

        }
        fetchData();
    }, [searchTitle, selectedYear, selectedGenres]);


    /***************************/
    /* Fetch data from omdb */
    /* and complete movie list */
    /***************************/
    useEffect(() => {
        const moviesPro = qdata.map((movie) => modifyMovie(movie));

        Promise.all(moviesPro)
            .then((movies) => {
                setMovies(movies);
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to fetch data");
                setLoading(false);
            });

    }, [qdata])


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    return (
        <Row>
            <Col md={2}>

                <MovieGenres onGenreChange={handleGenreChange} />
                <YearDropdown onYearChange={handleYearChange} />
            </Col>
            <Col md={10}>
                <Container>
                    <Row>
                        {moviesList.map((movie, index) => (
                                <Col md={4} key={movie.imdbId}>
                                    <a href={`/movie/${movie.imdbId}`}>
                                    <Card
                                        className={styles.cardZoom}
                                        style={{ width: "15rem",  margin: "2px", cursor: "pointer" }}
                                        onClick={() => handleCardClick(movie)}
                                    >
                                        <Card.Img variant="top" src={movie.posterUrl} />
                                        <Card.Body>
                                            <Card.Title>{movie.title}</Card.Title>
                                            <Card.Text>
                                                <div>Genre: {movie.genres.join(", ")}</div>
                                                <div>IMDB ID: {movie.imdbId}</div>
                                                <div>Year: {movie.year}</div>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    </a>

                                </Col>
                        ))}

                    </Row>
                    <Row className="mt-5">
                        <Col md={6} className="mx-auto">
                            <Page />
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Row>
    );
};
// return (
//   <div className={styles.container}>
//     {movies.map((movie, index) => (
//       <MovieCard
//           key={index}
//           title={movie.title}
//           genres={movie.genres}
//           posterUrl={movie.posterUrl}
//           imdbId={movie.imdbID}
//           year={movie.year}
//       />
//     ))}
//   </div>
// );
//};

export default MovieCardContainer;
