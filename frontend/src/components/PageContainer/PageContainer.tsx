import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import './Container.css';
import MovieCardContainer from "../MovieCard/MovieCardContainer";

const PageContainer: React.FC = () => {

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  }

  return (
        <div style={{ textAlign: 'center' }}>
            <SearchBar onSearch={handleSearch} />
            <MovieCardContainer searchTitle={searchTerm} />
        </div>
    )
};

export default PageContainer;