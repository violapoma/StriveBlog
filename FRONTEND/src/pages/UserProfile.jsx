import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../data/axios";

function UserProfile() {
  const { id } = useParams();

  const [author, setAuthor] = useState();

  const get = async () => {
    try {
      const author = await axios.get(`/authors/${id}`);
      console.log("author", author.data);
      setAuthor(author.data);
    } catch (e) {
      console.log("errore nel recupero dell'autore", e);
    }
  };

  useEffect(() => {
    get();
  }, [id]);

  return (
    <>
      {author && (
        <section className="homeSection mt-3 p-3 rounded-3">
          <Row className="align-items-center">
            <Col sm={3}>
              <img
                src={author.avatar}
                alt="profile picture"
                className="profileImg"
              />
            </Col>
            <Col sm={9}>
              <h2 className="titleColor">
                {author.nome} {author.cognome}
              </h2>
              <p className="d-flex align-items-center">
                <i className="bi bi-cake me-3"></i>
                {author.dataDiNascita}
              </p>
              <p className="d-flex align-items-center">
                <i className="bi bi-envelope-at me-3"></i>
                {author.email}
              </p>
            </Col>
          </Row>
        </section>
      )}
    </>
  );
}

export default UserProfile;
