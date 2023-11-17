
import React, { useState } from "react";
import styles from "./SearchBar.module.css"; // Import the CSS module
import { Button, Form, Row, Col, Container } from "react-bootstrap";
/*
interface clusteringOptionProps {
  onSubmit: (option: string[], isChecked: boolean[], Knumber: number) => void;
}
*/

//const ClusteringOption: React.FC<clusteringOptionProps> = ({ onSubmit }) => {
const ClusteringOption: React.FC = () => {
  const [option, setOption] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //onSubmit(option);
  };
  return (
    <Container>
    <h4>Clustering Options:</h4>
    <Form onSubmit={handleSubmit} className="mt-1 mb-1">
      <Row className="justify-content-md-center">
        <Col md="auto">
            <Form.Check
            inline
            type="checkbox"
            id="inlineFormCheck"
            label="Title"
            className="mr-sm-2"
            />
            <Form.Check
            inline
            type="checkbox"
            id="inlineFormCheck"
            label="Genre"
            className="mr-sm-2"
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