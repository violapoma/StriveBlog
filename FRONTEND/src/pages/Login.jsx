import {useState } from "react";
import { Button, Form, Container, Modal, Accordion } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import ErrorModal from "../components/ErrorModal";

function Login() {

  const [showError, setShowError] = useState(false); 
  const [consoleMsg, setConsoleMsg] = useState('');

  const [showLogin, setShowLogin] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthContext();
  const navigate = useNavigate();

  const googleLogInPath = `${import.meta.env.VITE_BACKEND_HOST}${import.meta.env.VITE_GOOGLE_PATH}`;
  const showPath = () => console.log('googleLoginPath ',googleLogInPath);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (evt) => {
    evt.preventDefault();
    try {
      console.log("Login con:", formData.email, formData.password);
      const res = await axios.post("/auth/login", formData);
      if (res.status == 200) {
        console.log(res.data);
        login(res.data.jwt);
        console.log("token settato", localStorage.getItem("token"));
        navigate("/");
      }
    } catch (err) {
      setConsoleMsg("Your logging credentials are wrong, please check again");
      setShowError(true); 
      console.log("errore di login", err);
    }
    setShowLogin(false);
  };

  return (
    <Container className="w-50 vh85 my-4 d-flex flex-column justify-content-center align-items-center bg-light rounded ">
      <h2 className="fs-1">Welcome!</h2>
      <div className="py-4 w-50 d-flex justify-content-between">
        <Button
          className="bgEmph borderEmph"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>

        <Link to="/auth/register">
          <Button className="bgEmph borderEmph">Register</Button>
        </Link>
      </div>

      {showLogin && (
        <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <a href={googleLogInPath} className="btn btn-outline-secondary" onClick={showPath}>
              <i className="bi bi-google"></i> Login with Google
            </a>

            <Accordion className="mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Log in with your email</Accordion.Header>
                <Accordion.Body>
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Inserisci email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Inserisci password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={() => setShowLogin(false)}
                        className="me-2"
                      >
                        Annulla
                      </Button>
                      <Button variant="primary" type="submit">
                        Accedi
                      </Button>
                    </div>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Modal.Body>
        </Modal>
      )}
      <ErrorModal consoleMsg={consoleMsg} show={showError} setShow={setShowError} />
    </Container>
  );
}

export default Login;
