import React, {useState, useEffect} from 'react';
import MovieCard from './MovieCard';
import styles from './MovieCardContainer.module.css'; // We'll create this CSS module next
import axios from 'axios';
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
  // Add more movie objects here...
];

const MovieCardContainer: React.FC = () => {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        const res = axios({
          method: 'POST',
          url: 'http://localhost:8000/api/movies/',

          data: {},
          
        }).then(res => setData(res.data)).catch(err => console.log(err));
        setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

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
