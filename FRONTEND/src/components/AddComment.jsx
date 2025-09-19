import { Button, Col, Container, Form, Spinner } from "react-bootstrap";
import { useAuthContext } from "../contexts/authContext";
import { useState } from "react";
import axios from "../../data/axios";
import { useParams } from "react-router-dom";

function AddComment() {
  const { token } = useAuthContext();
  const { id } = useParams(); //id post

  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    text: "",
  });

  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addComment = async () => {
    try {
      setIsLoading(true);
      const toAdd = await axios.post(`${id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("errore aggiunta commento", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {};

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="gy-4">
          <Col sm={12}>
            <Form.Control as="textarea" aria-label="With textarea" />
          </Col>
          <Col sm={3}>
            <Button type="submit" variant="secondary" className="mt-4 w-100">
            {isLoading && <Spinner animation="border" size="sm" className="me-2" />} Add comment
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddComment;
