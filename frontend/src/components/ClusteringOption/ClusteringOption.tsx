
import React, { useEffect, useState } from "react";
import styles from "./SearchBar.module.css"; // Import the CSS module
import { Button, Form, Row, Col, Container } from "react-bootstrap";

interface clusteringOptionProps {
  onChange: (option: string[], k: number) => void;
}


const ClusteringOption: React.FC<clusteringOptionProps> = ({ onChange }) => {
// const ClusteringOption: React.FC = () => {
  const [option, setOption] = useState<string[]>([]);
  const [k, setK] = useState<number>(0);


  

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const val = Number(value);
    if (isNaN(val)) {
      return;
    }
    if (val < 0) {
      setK(0);

    }
    if (val > 100) {  
      setK(100);
    }
    setK(Number(value));
    }; 
  
    const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setOption([...option, "genres"]);
      }else{
        setOption(option.filter((item) => item !== "genres"));
      }
      };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setOption([...option, "title"]);
      }else{
        setOption(option.filter((item) => item !== "title"));
      }
    };

    useEffect(() => {

      onChange(option, k);
    }
    , [option, k]);



  return (
    <Container>
    <h4>Clustering Options:</h4>
    <Form className="mt-1 mb-1">
      <Row className="justify-content-md-center">
        <Col md="auto">
            <Form.Check
            inline
            type="checkbox"
            id="inlineFormCheck"
            label="Title"
            className="mr-sm-2"
            onChange={handleTitleChange}
            />
            <Form.Check
            inline
            type="checkbox"
            id="inlineFormCheck"
            label="Genre"
            className="mr-sm-2"
            onChange={handleGenreChange}
            />
            </Col>
        <Row className="justify-content-md-center">
            <Form.Control
            type="number"
            required
            placeholder="Enter K number"
            onChange={handleNumberChange }
            />
        </Row>
      </Row>
    </Form>
    </Container>
  );
};

export default ClusteringOption;