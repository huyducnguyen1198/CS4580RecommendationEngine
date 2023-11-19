import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import styles from './SortOption.module.css'; // Import the CSS module
export interface CheckedOptionsType {
  Title: boolean;
  Plot: boolean;
  Genres: boolean;
};

export interface WeightsType  {
  Title: number;
  Plot: number;
  Genres: number;
};
interface SortOptionProps  {
  onSortChange: (weight: WeightsType) => void;
};



const SortOption: React.FC<SortOptionProps> = ({ onSortChange }) => {
  const [checkedOptions, setCheckedOptions] = useState<CheckedOptionsType>({
      Title: false,
      Plot: false,
      Genres: false,
  });

  const [weights, setWeights] = useState<WeightsType>({
      Title: 0,
      Plot: 0,
      Genres: 0,
  });

  const [lastModified, setLastModified] = useState<keyof WeightsType | null>(null);

  const [compWeights, setCompWeight] = useState<WeightsType>({
    Title: 0,
    Plot: 0,
    Genres: 0,
});
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value as keyof CheckedOptionsType;
    const isChecked = event.target.checked;

    setCheckedOptions(prev => ({
        ...prev,
        [option]: isChecked,
    }));
  };
  useEffect(() => {

    setCompWeight(prev => {
        
        const newWeights = { ...prev };
        
        // Count the number of selected options before this change
        let selectedCount = Object.values(checkedOptions).filter(Boolean).length;
        

        // turn checkedOptions into a dictionary
        const checkedDict = Object.entries(checkedOptions).map(([key, value]) => ({ [key]: value }));
        const checkedOpt = checkedDict.reduce((acc, obj) => {
        const key = Object.keys(obj)[0]; // Get the key of the current object (e.g., 'Title', 'Plot', 'Genres')
        acc[key] = obj[key]; // Assign its value to the accumulated object
        return acc;
        }, {});

        // turn newWeights into a dictionary
        const weightDict = Object.entries(newWeights).map(([key, value]) => ({ [key]: value }));
        const weightOpt = weightDict.reduce((acc, obj) => {
        const key = Object.keys(obj)[0]; // Get the key of the current object (e.g., 'Title', 'Plot', 'Genres')
        acc[key] = obj[key]; // Assign its value to the accumulated object
        return acc;
        }, {});

        // check the number of selected options after this change and update the weights accordingly
        if (selectedCount === 1) {
            // If this is the only selected option
            Object.keys(newWeights).forEach(key => {
                if (checkedOpt[key as keyof CheckedOptionsType]) {
                    newWeights[key as keyof WeightsType] = 1;
                }else
                {
                    newWeights[key as keyof WeightsType] = 0;
                }
            });
        } else if (selectedCount === 2) {
            // If there is one other option selected
            Object.keys(newWeights).forEach(key => {
                if (checkedOpt[key as keyof CheckedOptionsType]) {
                    newWeights[key as keyof WeightsType] = 0.5;
                }else
                {
                    newWeights[key as keyof WeightsType] = 0;
                }
            });
        } else if (selectedCount === 3) {
            // If all three options are selected
            Object.keys(newWeights).forEach(key => {
                newWeights[key as keyof WeightsType] = 0.33;
            });
        }
        return newWeights;
    });
    // Log or return newWeights as needed
    setWeights(compWeights)

  }, [checkedOptions]);

  const handleWeightChange = (option: keyof WeightsType, value: number) => {
    console.log(option, value, Math.min(Math.max(value, 0), 1));
      setCompWeight(prev => ({
          ...prev,
          [option]: Math.min(Math.max(value, 0), 1)
      }));
      setWeights(prev => ({
        ...prev,
        [option]: Math.min(Math.max(value, 0), 1),
    }));
      setLastModified(option);
  };



  useEffect(() => {
      const checkedCount = Object.values(checkedOptions).filter(Boolean).length;

      if (checkedCount === 2 && lastModified) {
          const otherOption = Object.keys(checkedOptions).find(key => key !== lastModified && checkedOptions[key as keyof CheckedOptionsType]) as keyof WeightsType;
          setCompWeight(prev => ({
              ...prev,
              [otherOption]: (1 - prev[lastModified]).toFixed(2),
          }));
      } else if (checkedCount === 3 && lastModified) {
          const remainingOptions = Object.keys(checkedOptions).filter(key => key !== lastModified && checkedOptions[key as keyof CheckedOptionsType]) as (keyof WeightsType)[];
          const remainingWeight = 1 - compWeights[lastModified];
          setCompWeight(prev => ({
              ...prev,
              [remainingOptions[0]]: (remainingWeight / 2).toFixed(2),
              [remainingOptions[1]]: (remainingWeight / 2).toFixed(2),
          }));
      }
  }, [weights]);

  const handleSort = () => {
      onSortChange(weights);
  };

  return (
      <Container>
          <Form>
              <Form.Group>
                  <Form.Label>Sort Options:</Form.Label>
                  <div className={styles.tagOptions}>
                      {Object.keys(checkedOptions).map((option) => (
                          <div key={option} className={styles.tagItem}>
                              <input
                                  type="checkbox"
                                  id={`sort-${option}`}
                                  value={option}
                                  className={styles.tagCheckbox}
                                  onChange={handleCheckboxChange}
                                  checked={checkedOptions[option as keyof CheckedOptionsType]}
                              />
                              <label htmlFor={`sort-${option}`} className={styles.tagLabel}>
                                  {option.charAt(0).toUpperCase() + option.slice(1)}
                              </label>
                              {Object.values(checkedOptions).filter(Boolean).length > 1 && (
                                  <input 
                                    style={{ width: '80px'}} // Adjust the width and height as needed

                                      type="number"
                                      step="0.05"
                                      value={compWeights[option as keyof WeightsType]}
                                      onChange={(e) => handleWeightChange(option as keyof WeightsType, parseFloat(e.target.value))}
                                      disabled={!checkedOptions[option as keyof CheckedOptionsType]}

                                  />
                              )}
                          </div>
                      ))}
                  </div>
              </Form.Group>
              <Button onClick={handleSort}>Sort</Button>
          </Form>
      </Container>
  );
};

export default SortOption;