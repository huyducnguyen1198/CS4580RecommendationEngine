import React, {useState} from "react";
import styles from './SearchBar.module.css'; // Import the CSS module

interface searchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<searchBarProps> = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchTerm);
    }
    return (
      <div className={styles.searchBarContainer}> 
      <form onSubmit={handleSearch}>
        {/* Input field for the search term */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange} // Set the handler for the change event
          className={styles.searchInput}

        />
        {/* Submit button for the form */}
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </div>
    );
};

export default SearchBar;