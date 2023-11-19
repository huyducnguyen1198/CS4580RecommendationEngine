
import React, { useState } from "react";
import styles from "./SearchBar.module.css"; // Import the CSS module
import { Button, Form, Row, Col, Container } from "react-bootstrap";

interface clusteringOptionProps {
  onChange: (option: string[], k: number) => void;
}


const ClusteringOption: React.FC<clusteringOptionProps> = ({ onChange }) => {
// const ClusteringOption: React.FC = () => {
  const [option, setOption] = useState<string[]>([]);
  const [k, setK] = useState<number>(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setK(Number(value));
    onChange(option, k);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //onSubmit(option);
  };
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
            onChange={(e) => {
              if (e.target.checked) {
                setOption([...option, "title"]);
              } else {
                setOption(option.filter((item) => item !== "title"));
              }
              onChange(option, k);
            
            }}
            />
            <Form.Check
            inline
            type="checkbox"
            id="inlineFormCheck"
            label="Genre"
            className="mr-sm-2"
            onChange={(e) => {
              if (e.target.checked) {
                setOption([...option, "genres"]);
              } else {
                setOption(option.filter((item) => item !== "genres"));
              }
              onChange(option, k);
            }}
            />
            </Col>
        <Row className="justify-content-md-center">
            <Form.Control
            type="number"
            required
            placeholder="Enter K number"
            onChange={handleInputChange}
            />
        </Row>
      </Row>
    </Form>
    </Container>
  );
};

export default ClusteringOption;