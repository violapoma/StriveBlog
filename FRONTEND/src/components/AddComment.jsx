import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useRef, useState } from "react";
import axios from "../../data/axios";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddComment({
  commentToEdit,
  setCommentToEdit,
  isAccordionOpen,
  containerRef,
  refreshComments,
  setScrollCommentId,
  setIsAccordionOpen,
}) {
  const { token, loggedUser } = useAuthContext();
  const { id } = useParams(); // id post
  const isEdit = commentToEdit && commentToEdit._id ? true : false; // true se sto editando

  const quillRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    author: loggedUser._id,
    text: "",
  });

  const quillModules = {
    toolbar: [["bold", "italic", "underline"], ["link"], ["clean"]],
  };
  const quillFormats = ["bold", "italic", "underline", "link"];

  // Aggiorna testo del form o commentToEdit a seconda del caso
  const handleTextChanges = (value) => {
    if (isEdit) {
      setCommentToEdit((prev) => ({
        ...prev,
        text: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, text: value }));
    }
  };

  const handleDismiss = ()=>{
    setIsAccordionOpen(false)
    setCommentToEdit({});
    formData.text='';
  }

  // Focus automatico e scroll quando l'Accordion si apre
  useEffect(() => {
    if (isAccordionOpen && containerRef.current) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        const bottom = container.offsetTop + container.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollPos = bottom - viewportHeight + 20;
        window.scrollTo({ top: scrollPos, behavior: "smooth" });

        if (quillRef.current) {
          quillRef.current.getEditor().focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
    console.log('isEdit', isEdit);
  }, [isAccordionOpen, containerRef]);

  /////////////////////////// SUBIT //////////////////////////////////
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const textValue = isEdit ? commentToEdit.text : formData.text;
    const cleanText = DOMPurify.sanitize(textValue);
    const finalData = isEdit
      ? { ...commentToEdit, text: cleanText }
      : { ...formData, text: cleanText };

    setValidated(true);
    setIsLoading(true);

    console.log("formData", formData);
    console.log("idPost", id);
    console.log("commentToEdit", commentToEdit);
    console.log("finalData", finalData);

    try {
      if (isEdit) {
        console.log("idCommento", commentToEdit._id);
        await axios.put(
          `/posts/${id}/comments/${commentToEdit._id}`,
          {
            text: DOMPurify.sanitize(commentToEdit.text),
            author: commentToEdit.author._id || commentToEdit.author,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setScrollCommentId(commentToEdit._id);
        setCommentToEdit(null); // reset
      } else {
        const toAdd = await axios.post(`/posts/${id}/comments`, finalData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newComment = toAdd.data;
        setScrollCommentId(newComment._id);
        setFormData({ ...formData, text: "" });
      }
      refreshComments();
      setIsAccordionOpen(false);
    } catch (err) {
      console.error("Errore durante il salvataggio del commento", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container ref={containerRef}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="gy-4">
          <Col sm={12}>
            <ReactQuill
              ref={quillRef}
              className="my-editor commentEditor"
              value={isEdit ? commentToEdit.text : formData.text}
              modules={quillModules}
              formats={quillFormats}
              onChange={handleTextChanges}
              theme="snow"
            />
          </Col>
          <Col sm={3}>
            <Button
              type="submit"
              variant="outline-success"
              className="mt-4 w-100"
            >
              {isLoading && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              {isEdit ? "Update Comment" : "Add Comment"}
            </Button>
          </Col>
          {isEdit && (
            <Col sm={3}>
              <Button variant="outline-danger" className="mt-4 w-100" onClick={handleDismiss}>
                Dismiss
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </Container>
  );
}

export default AddComment;
