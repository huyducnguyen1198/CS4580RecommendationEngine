import React from "react";
import styles from './MovieCard.module.css'; // Import the CSS module
import { useNavigate } from 'react-router-dom';


interface movieCardProps {
    title: string;
    year: string;
    posterUrl: string;
    imdbID: string;
    genres: string[];
}

const MovieCard: React.FC<movieCardProps> = ({title, year, posterUrl, imdbID, genres}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/movie/${imdbID}`);
    };
    
    //test a anchor
    const movieUrl = `/movie/${imdbID}`;

    return (
        <a href={movieUrl}target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
            <div className={styles.card}>
            <img src={posterUrl} alt={title} className={styles.poster} />
            <div className={styles.info}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.genres}>{genres.join(', ')}</p>
            </div>
        </div>
        </a>
        
    );
};

export default MovieCard;