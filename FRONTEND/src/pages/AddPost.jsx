import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ContentPreview from "../components/ContentPreview";
import axios from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";

function AddPost() {
  const { token } = useAuthContext();

  const { id } = useParams();
  const isEdit = !!id;

  const [showPreview, setShowPreview] = useState(false); //preview del contenuto
  const [validated, setValidated] = useState(false); //validazione form
  const [cover, setCover] = useState(); //gestione coverImg

  const [show, setShow] = useState(false);
  const [successAdd, setSuccessAdd] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    author: "",
    title: "",
    category: "",
    readTime: {
      value: "",
      unit: "minutes",
    },
    content: "",
  });

  const fetchPost = async () => {
    try {
      const post = await axios.get(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("editing", post.data);
      setFormData({ author: post.data.author, ...post.data });
    } catch (e) {
      console.log("erore fetch post da modificare", e);
    }
  };
  useEffect(() => {
    if (isEdit && id) {
      fetchPost();
    } else {
      setFormData({
        author: "Viola",
        title: "",
        category: "",
        readTime: {
          value: "",
          unit: "minutes",
        },
        content: "",
      });
    }
  }, [isEdit, id]);

  // quill-react
  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }], // Solo H2, H3 e paragrafo, no H1 perché il titolo non è nella preview
      ["bold", "italic", "underline"],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  function handleChanges(evt) {
    const { name, value } = evt.target;

    if (name === "readTimeValue" || name === "readTimeUnit") {
      setFormData((prev) => ({
        ...prev,
        readTime: {
          ...prev.readTime,
          [name === "readTimeValue" ? "value" : "unit"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleContentChanges(value) {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  }

  // SUBMIT
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const cleanContent = DOMPurify.sanitize(formData.content);

    const finalData = {
      ...formData,
      content: cleanContent,
    };

    setValidated(true); // opzionale, se hai validazione visuale

    try {
      let response;
      isEdit
        ? (response = await axios.put(
          `/posts/${id}`,
          finalData, // dati corretti
          {
            headers: {
              Authorization: `Bearer ${token}`, // qui va il token
            },
          }))
        : (response = await axios.post(
            "/posts",
            finalData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ));
      console.log("Post creato/modificato con successo:", response.data);
      const idPost = response.data._id; //var 'id' solo se faccio edit
      if (cover) {
        const fData = new FormData();
        fData.append("cover", cover);

        const resCover = await axios.patch(
          `posts/${idPost}/cover`,
          fData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("resCover", resCover.data);
      }
      handleShow();
      setTimeout(() => {
        handleClose();
        navigate(`/posts/${idPost}`);
      }, 1000);
    } catch (error) {
      console.error("Errore durante la creazione/modifica del post", error);
    }
  };

  const addCover = (e) => {
    setCover(e.target.files[0]);
  };

  return (
    <Container className="mt-3 px-3">
      <h2 className="mt-3 pb-3">Write your post!</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={9}>
            <Row>
              <Form.Group as={Col} md="12" controlId="validationTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChanges}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChanges}
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationReadTime">
                <Form.Label>Read time</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    placeholder="Enter time"
                    name="readTimeValue"
                    value={formData.readTime.value}
                    onChange={handleChanges}
                    inputMode="numeric"
                  />
                  <Form.Select
                    name="readTimeUnit"
                    value={formData.readTime.unit}
                    className="flex-grow-0 w-auto"
                    onChange={handleChanges}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationImage">
                <Form.Label>Cover image</Form.Label>
                <Form.Control
                  required={!isEdit}
                  type="file"
                  name="cover"
                  onChange={addCover}
                />
              </Form.Group>
            </Row>
          </Col>
          <Col
            md={3}
            className="d-flex align-items-center justify-content-center"
          >
            {/* TODO: non si aggiorna live */}
            <img
              src={
                formData.cover
                  ? formData.cover
                  : "https://placehold.net/default.png"
              }
              alt="cover preview"
              className="coverPreview"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group className="mb-3" controlId="validationContent">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                className="my-editor"
                value={formData.content}
                name="content"
                modules={quillModules}
                formats={quillFormats}
                onChange={handleContentChanges}
                theme="snow"
              />
            </Form.Group>
            <Button
              variant={showPreview ? "outline-secondary" : "secondary"}
              className="mt-3"
              onClick={() => setShowPreview((prev) => !prev)}
            >
              {showPreview ? "Hide text preview" : "Show text preview"}
            </Button>
          </Col>
          <Col md={12}>
            {showPreview && <ContentPreview content={formData.content} />}
          </Col>
        </Row>

        <Button type="submit">Submit form</Button>
      </Form>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          <Alert variant="success">Post created successfully!</Alert>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AddPost;
