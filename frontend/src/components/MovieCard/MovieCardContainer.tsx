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
// Sample data for movie cards
const movies = [
  {
    title: "Inception",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1375666",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  {
    title: "BLablabla",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1374444",
    year: "2010",
  },
  // Add more movie objects here...
];
interface Movie {
  title: string;
  genres: string[];
  posterUrl: string;
  imdbID: string;
  year: string;
}

const MovieCardContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          method: "POST",
          url: "http://localhost:8000/api/movies/",
          data: {},
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMovie]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCardClick = (movie: Movie) => {
    console.log("Card clicked:", movie.title);
    setSelectedMovie(movie); // Update the selectedMovie state
  };


  return (
    <Row>
      <Col md={2}>
      
      <MovieGenres/>
      <YearDropdown />
      </Col>
      <Col md={10}>
        <Container>
          <Row>
            {movies.map((movie, index) => (
              <Col md={4} key={movie.imdbID}>
                <Card
                  className={styles.cardZoom}
                  style={{ width: "18rem", margin: "10px", cursor: "pointer" }}
                  onClick={() => handleCardClick(movie)}
                >
                  <Card.Img variant="top" src={movie.posterUrl} />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>
                      <div>Genre: {movie.genres.join(", ")}</div>
                      <div>IMDB ID: {movie.imdbID}</div>
                      <div>Year: {movie.year}</div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            
          </Row>
          <Row className="mt-5">
            <Col md={6} className="mx-auto">
            <Page/>
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
//           imdbID={movie.imdbID}
//           year={movie.year}
//       />
//     ))}
//   </div>
// );
//};

export default MovieCardContainer;
