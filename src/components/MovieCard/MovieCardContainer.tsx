import React from 'react';
import MovieCard from './MovieCard';
import styles from './MovieCardContainer.module.css'; // We'll create this CSS module next

// Sample data for movie cards
const movies = [
  {
    title: "Inception",
    genres: ["Action", "Adventure", "Sci-Fi"],
    posterUrl: "https://example.com/poster1.jpg",
    imdbID: "tt1375666",
    year: "2010",
  },
  // Add more movie objects here...
];

const MovieCardContainer: React.FC = () => {
  return (
    <div className={styles.container}>
      {movies.map((movie, index) => (
        <MovieCard
            key={index}
            title={movie.title}
            genres={movie.genres}
            posterUrl={movie.posterUrl}
            imdbID={movie.imdbID}
            year={movie.year}
        />
      ))}
    </div>
  );
};

export default MovieCardContainer;
