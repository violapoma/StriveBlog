import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import UserPreview from "../components/UserPreview";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../../data/axios";
import PostPreview from "../components/PostPreview";
import { useAuthContext } from "../contexts/authContext";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function LoggedHome() {
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const navigate = useNavigate();

  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) {
      console.log("nessun token valido");
      navigate("/login");
    }
    console.log("sono nella home");
  }, [token]);

  const getAuthors = async () => {
    try {
      const res = await axios.get("/authors");
      console.log("authors", res.data);
      const just4authors = res.data.slice(0, 4);
      setAuthors(just4authors);
    } catch (e) {
      console.log("errore nel recupero degli autori", e);
    } finally {
      setLoadingAuthors(false);
    }
  };

  const getPosts = async () => {
    try {
      console.log("getPosts, token", token);
      const res = await axios.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("posts", res.data);
      setPosts(res.data);
    } catch (e) {
      console.log("errore nel recuper dei post", e);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    getAuthors();
    getPosts();
  }, []);

  return (
    <>
      {/* Sezione post */}
      {loadingPosts && <Loader />}

      <section className="mt-3 p-4 rounded-3">
        {posts?.length > 0 ? (
          <Row>
            {posts.map((post) => (
              <Col sm={12} key={post._id}>
                <PostPreview post={post} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No posts available.</p>
        )}
      </section>

      {/* Sezione autori */}
      {loadingAuthors && <Loader />}
      <section className="mt-3 p-4 rounded-3 mb-3">
        <h2>Our top authors:</h2>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Browse by author"
            aria-label="Browse by author"
            aria-describedby="browse by author"
          />
          <Button variant="outline-secondary" id="button-addon2">
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>

        {authors?.length > 0 ? (
          <Row className="mt-4">
            {authors.map((author) => (
              <Col sm={4} lg={3} key={author._id}>
                <UserPreview profile={author} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No authors found.</p>
        )}
      </section>
    </>
  );
}

export default LoggedHome;

/**
 * home coi post
 
  const [posts, setPosts] = useState([]); 

  async function getPosts() {
    const resultPosts = await getAll(); 
    setPosts(resultPosts.data);
  }

  useEffect(
    getPosts(), 
    []); 

  return(
   <Container>
  <Row>
    {posts && posts.map(post => (
      <Col key={post.id}>
        <PostPreview post={post} />
      </Col>
    ))}
  </Row>
</Container>
  )
 */
