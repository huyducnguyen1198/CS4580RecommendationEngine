import React, { useState } from "react";
import styles from "./SearchBar.module.css"; // Import the CSS module
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";

interface searchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<searchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };
  return (
    <Form onSubmit={handleSearch} className="mt-5 mb-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          {" "}
          {/* This will size the column to the content */}
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            className="mr-sm-2"
          />
        </Col>
        <Col md="auto">
          <Button variant="primary" type="submit">
            <Spinner
              className="mr-5"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );

  // return (
  //   <div className={styles.searchBarContainer}>
  //   <form onSubmit={handleSearch}>
  //     {/* Input field for the search term */}
  //     <input
  //       type="text"
  //       placeholder="Search..."
  //       value={searchTerm}
  //       onChange={handleInputChange} // Set the handler for the change event
  //       className={styles.searchInput}

  //     />
  //     {/* Submit button for the form */}
  //     <Button type="submit" className={styles.searchButton}>
  //       Search
  //     </Button>
  //   </form>
  // </div>
  // );
};

export default SearchBar;
