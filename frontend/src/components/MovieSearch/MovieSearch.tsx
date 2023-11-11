import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import PageContainer from './PageContainer';
import SortOption from './SortOption/SortOption';


const MoviePage: React.FC = () => {
    const { imdbID } = useParams();

    const [sortOption, setSortOption] = React.useState<string[]>([]);
    const handleSortChange = (opt: string, isChecked: boolean) => {
        if (isChecked) {
            setSortOption([...sortOption, opt]);
        } else {
            setSortOption(sortOption.filter((o) => o !== opt));
        }
    }
    useEffect (() => {
        console.log(sortOption);
    }, [sortOption]);
    // Fetch and display movie details using imdbID
    return (
        <PageContainer>
            <div>
                <h1>Movie Details</h1>
                <p>IMDb ID: {imdbID}</p>
                <SortOption onSortChange={handleSortChange} />
            </div>
        </PageContainer>
    );
};

export default MoviePage;
