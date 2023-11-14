import React from "react";
import { Card, ListGroup, Container, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Movie {
  title: string;
  genres: string[];
  posterUrl: string;
  imdbId: string;
  year: string;
  rated: string;
  plot: string;
}

interface MovieSelectedProps {
    movieList: Movie[];
    onRemove: (imdbId: string) => void; // Add this line
    onSubmit: () => void;
  }
const MovieSelected: React.FC<MovieSelectedProps> = ({ movieList , onRemove, onSubmit }) => {
  return (
    <Container>
      <h3>Selected Movies:</h3>
      {movieList.map((movie, index) => (
        <Card key={movie.imdbId} className="mb-3">
          <Card.Header as="h5">
            {movie.title} ({movie.year}){" "}
            <i
              className="bi bi-trash3"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the Card onClick from being called
                onRemove(movie.imdbId);
              }}
              style={{ cursor: "pointer" }}
            ></i>
          </Card.Header>
        </Card>
      ))}
       <Button variant="primary" onClick={onSubmit} className="mt-3">
        Submit Movies
      </Button>
    </Container>
  );
};

export default MovieSelected;
