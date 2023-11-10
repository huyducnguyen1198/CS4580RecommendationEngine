import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import './Container.css';
import MovieCardContainer from "../MovieCard/MovieCardContainer";

const PageContainer: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    console.log(searchTerm);
  }

  return (
    <div className="container">
        <div style={{ textAlign: 'center' }}>
            <SearchBar onSearch={handleSearch} />
            <MovieCardContainer />
        </div>
    </div>
    )
};

export default PageContainer;