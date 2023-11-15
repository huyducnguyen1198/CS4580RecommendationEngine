import React, {useEffect, useRef} from "react";
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

  //check if movie list is empty alert and create alertHtml
  const [showAlert, setShowAlert] = React.useState(false);
  const alertHtml = (
    <div className="alert alert-danger" role="alert">
      Please select at least one movie!
    </div>
  );


  const onSubmitCheck = () => {
    if (movieList.length === 0) {
      setShowAlert(true)
    } else {
      setShowAlert(false)
      onSubmit();
    }
  }

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
      {showAlert && alertHtml}
       <Button variant="primary" onClick={onSubmitCheck} className="mt-3">
        Submit Movies
      </Button>
    </Container>
  );
};

export default MovieSelected;
