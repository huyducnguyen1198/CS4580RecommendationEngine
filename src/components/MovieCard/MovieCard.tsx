import React from "react";
import styles from './MovieCard.module.css'; // Import the CSS module

interface movieCardProps {
    title: string;
    year: string;
    posterUrl: string;
    imdbID: string;
    genres: string[];
}

const MovieCard: React.FC<movieCardProps> = ({title, year, posterUrl, imdbID, genres}) => {
    return (
        <div className={styles.card}>
            <img src={posterUrl} alt={title} className={styles.poster} />
            <div className={styles.info}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.genres}>{genres.join(', ')}</p>
            </div>
        </div>
    );
};

export default MovieCard;