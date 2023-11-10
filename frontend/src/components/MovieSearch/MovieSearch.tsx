import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from './PageContainer';
const MoviePage: React.FC = () => {
  const { imdbID } = useParams();

  // Fetch and display movie details using imdbID
  return (
     <PageContainer>
        <div>
            <h1>Movie Details</h1>
            <p>IMDb ID: {imdbID}</p>
            {/* Display movie details here */}
        </div>
    </PageContainer>
  );
};

export default MoviePage;
