import React from "react";
import { Form } from "react-bootstrap";
import Container from "../MovieSearch/PageContainer";

const MovieGenres = () => {
  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Thriller",
    "Western",
    "Science Fiction",
    "Documentary",
    "Animation",
  ];

  return (
    <Container >
  <Form>
    <Form.Group>
      <Form.Label>Genre: </Form.Label>
      {genres.map((genre) => (
        <Form.Check
          type="checkbox"
          id={`genre-${genre}`}
          label={genre}
          key={genre}
        />
      ))}
    </Form.Group>
  </Form>
</Container>
  );
};

export default MovieGenres;
