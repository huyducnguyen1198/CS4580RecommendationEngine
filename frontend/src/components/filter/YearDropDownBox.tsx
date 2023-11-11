import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import Container from "../MovieSearch/PageContainer";

const YearDropdown = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(30), (val, index) => currentYear - index);

  return (
        <Container>
      <Form.Group >
         <Row >
        <Col md={4}>
        <Form.Label>Year: </Form.Label>
        </Col>
        <Col md={8}>
        <Form.Select aria-label="Year select">
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>
        </Col>
        </Row>
      </Form.Group>
      </Container>

  );
};

export default YearDropdown;
