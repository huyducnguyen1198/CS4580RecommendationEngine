import React from 'react';
import { Form } from "react-bootstrap";
import Container from "../PageContainer";
import styles from './SortOption.module.css'; // Import the CSS module

interface SortOptionProps {
  onSortChange: (opt: string, isChecked: boolean) => void;
}

const SortOption: React.FC<SortOptionProps> = ({ onSortChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value, event.target.checked);
  };

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Sort Options:</Form.Label>
          <div className={styles.tagOptions}>
            {['Title', 'Year', 'Genres'].map((option) => (
              <div key={option} className={styles.tagItem}>
                <input
                  type="checkbox"
                  id={`sort-${option.toLowerCase()}`}
                  value={option.toLowerCase()}
                  className={styles.tagCheckbox}
                  onChange={handleChange}
                />
                <label htmlFor={`sort-${option.toLowerCase()}`} className={styles.tagLabel}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default SortOption;
