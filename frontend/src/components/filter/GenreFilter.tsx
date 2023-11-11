import React from "react";
import { Form } from "react-bootstrap";
import Container from "../MovieSearch/PageContainer";


interface MovieGenresProps {
  onGenreChange: (genre: string, isChecked: boolean) => void;
}

const MovieGenres:React.FC<MovieGenresProps> = ({onGenreChange}) => {
  const genres = ['Action', 'Adventure', 'Animation', 'Children',
  'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy',
  'Film-Noir', 'Horror', 'IMAX', 'Musical', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']

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
          onChange={(e) => onGenreChange(genre, e.target.checked)}
        />
      ))}
    </Form.Group>
  </Form>
</Container>
  );
};

export default MovieGenres;
