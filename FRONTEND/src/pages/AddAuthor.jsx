import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import Loader from "../components/Loader";

function AddAuthor({ isEdit }) {
  const { token, userId, setLoggedUser } = useAuthContext();

  const navigate = useNavigate();

  const [show, setShow] = useState(false); //modale
  const [validated, setValidated] = useState(false); //validazione form
  const [avatar, setAvatar] = useState("");
  // const [modalDelete, setModalDelete] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false); //attesa per invio dati

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
  });

  useEffect(() => {
    console.log("IS_EDIT:", isEdit);
    if (isEdit && userId) {
      fetchAuthor();
    } else {
      setFormData({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        dataDiNascita: "",
      });
    }
  }, [isEdit, userId]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDelete = () => {
    setConfirmDelete(true);
    handleShow();
  };
  const deleteAccount = async () => {
    try {
      const res = await axios.delete(`/authors/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("account eliminato");
      setTimeout(() => {
        handleClose();
        navigate(`/`);
        // TODO: fai logout
      }, 1000);
    } catch (error) {
      console.log("errore nella cancellazione account", error);
    }
  };

  function validateBirthDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/; //controllo formato && recupero cifre
    const match = dateStr.match(regex); //array [dateStr, dd, mm, yyyy]
    if (!match)
      return { valid: false, message: "Formato non valido (dd/mm/yyyy)" };

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const dateObj = new Date(`${year}-${month}-${day}`);
    console.log("[validateBirthDate] dateObj", dateObj);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() + 1 !== month ||
      dateObj.getDate() !== day
    ) {
      return { valid: false, message: "Data inesistente" };
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) {
      age--;
    }
    if (age < 18) return { valid: false, message: "Devi essere maggiorenne" };

    return { valid: true, message: "" };
  }

  const addAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(file), //genera preview
      });
    }
  };

  const fetchAuthor = async () => {
    try {
      const author = await axios.get(`/authors/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("editing author", author.data);
      setFormData({ ...author.data });
    } catch (err) {
      console.log("errore fetch autore da modificare", err);
    }
  };

  // SUBMIT
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const validatedDate = validateBirthDate(formData.dataDiNascita);
    if (!validatedDate.valid) {
      console.log(validatedDate.message);
      return;
    }

    setValidated(true);
    setIsLoading(true);
    console.log(formData);

    try {
      let res;
      isEdit
        ? (res = await axios.put(`/me/edit`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          }))
        : (res = await axios.post("/auth/register", formData));
      console.log("Autore creato/modificato con successo");

      const authorID = res.data._id;
      if (avatar) {
        const formDataWithAvatar = new FormData();
        formDataWithAvatar.append("avatar", avatar);

        const avatarRes = await axios.patch(
          `/me/edit/avatar`,
          formDataWithAvatar,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(avatarRes.data);
      }
      setLoggedUser(res.data); //aggiorna l'avatar

      handleShow();
      setTimeout(() => {
        handleClose();
        navigate(`/`);
      }, 1000);
    } catch (error) {
      console.error("Errore durante la creazione/modifica dell'autore", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {isLoading && (
        
      <Loader />
      )}
      <h2 className="mt-3 pb-3">Welcome!</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Row className="gy-4">
              <Form.Group as={Col} md="12" controlId="validationName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Name"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChanges}
                />
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationLastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last Name"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChanges}
                />
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChanges}
                />
              </Form.Group>
              {!isEdit && (
                <Form.Group as={Col} md="12" controlId="validationPw">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChanges}
                  />
                </Form.Group>
              )}
              <Form.Group as={Col} md="12" controlId="validationImage">
                <Form.Label>Cover image</Form.Label>
                <Form.Control
                  required={!isEdit}
                  type="file"
                  name="avatar"
                  onChange={addAvatar}
                />
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationBirthday">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  as={InputMask}
                  mask="99/99/9999"
                  value={formData.dataDiNascita}
                  name="dataDiNascita"
                  onChange={handleChanges}
                  placeholder="dd/mm/yyyy"
                  required
                />
              </Form.Group>
            </Row>
          </Col>
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <img
              src={
                formData.avatar
                  ? formData.avatar
                  : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngmart.com%2Ffiles%2F23%2FProfile-PNG-Photo.png&f=1&nofb=1&ipt=e64683b34558b6940f0dc81994fbb70f0096a4c3327a2e6976adecbb913d3dec"
              }
              alt="avatar preview"
              className="avatarPreview"
            />
          </Col>
          <Col md={6}>
            <Button
              type="submit"
              variant="success"
              className="mt-4 w-100"
              disabled={isLoading} // disabilita mentre carica
            >
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Signing up..."
                : isEdit
                ? "Submit changes"
                : "Sign up!"}
            </Button>

            {isEdit && (
              <Button
                type="submit"
                variant="secondary"
                className="mt-4 w-100"
                onClick={handleDelete}
              >
                Delete account
              </Button>
            )}
          </Col>
        </Row>
      </Form>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          {confirmDelete ? (
            <>
              <p>
                Are you sure you want to delete your account? It won't be
                possible to recover your data afterwards...
              </p>
              <Row className="align-items-center">
                <Col md={6}>
                  <Button variant="danger" onClick={deleteAccount}>
                    Delete my account <strong>irreversibly</strong>
                  </Button>
                </Col>
                <Col md={6}>
                  <Button variant="secondary" onClick={handleClose}>
                    I changed my mind
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <Alert variant="success">
              {isEdit ? "Profile updated successfully" : "Welcome!"}
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
export default AddAuthor;
