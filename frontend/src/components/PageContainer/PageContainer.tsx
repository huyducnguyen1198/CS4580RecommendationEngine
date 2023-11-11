import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import './Container.css';
import MovieCardContainer from "../MovieCard/MovieCardContainer";

const PageContainer: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    console.log(searchTerm);
  }

  return (
        <div style={{ textAlign: 'center' }}>
            <SearchBar onSearch={handleSearch} />
            <MovieCardContainer />
        </div>
    )
};

export default PageContainer;