import { Button, Col, Container, InputGroup, Row } from "react-bootstrap";
import UserPreview from "../components/UserPreview";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../../data/axios";
import PostPreview from "../components/PostPreview";
import { useAuthContext } from "../contexts/authContext";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import MyPagination from "../components/MyPagination";

function LoggedHome() {
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [searchString, setSearchString] = useState("");

  //paginazione
  const [howManyPages, setHowManyPages] = useState(0);
  const [active, setActive] = useState(
    parseInt(new URLSearchParams(window.location.search).get("page")) || 1
  );
  const [postsForPage, setPostsForPage] = useState([]);
  const perPage = 3;

  const navigate = useNavigate();

  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) {
      console.log("nessun token valido");
      navigate("/login");
    }
    console.log("sono nella home");
  }, [token]);

  // //paginazione
  // useEffect(() => {
  //   const startIdx = perPage * (active - 1);
  //   const endIdx = startIdx + perPage;
  //   setPostsForPage(posts.slice(startIdx, endIdx));
  // }, [posts, active]);

  //ricerca
  useEffect(() => {
    if (searchString === "") {
      getPosts();
    }
  }, [searchString]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchString(value);

    if (value === "") {
      getPosts(1);
    } else {
      getPosts(1); // puoi anche filtrare mentre scrivi
    }
  };

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

  const getPosts = async (page = 1) => {
    try {
      const params = { page, perPage };
      if (searchString) params.title = searchString;

      const res = await axios.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log("posts ricevuti", res.data.posts);
      setPosts(res.data.posts);
      setHowManyPages(res.data.totalPages);
      setActive(res.data.page); // assicuriamoci che la pagina corrente sia aggiornata
    } catch (e) {
      console.log("errore nel recupero dei post", e);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    getAuthors();
    getPosts();
    setActive(1);
  }, []);

  return (
    <>
      <Row className="justify-content-center mt-3">
        <Col sm={6}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Browse by title"
              aria-label="Browse by title"
              aria-describedby="browse by title"
              onChange={handleChange}
            />
            <Button variant="outline-secondary" onClick={getPosts}>
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Sezione post */}
      {loadingPosts && <Loader />}

      <section className="mt-3 p-4 rounded-3">
        {posts?.length > 0 ? (
          <Row className="justify-content-center">
            <MyPagination
              howManyPages={howManyPages}
              active={active}
              setActive={(page) => getPosts(page)}
            />
            {posts.map((post) => (
              <Col sm={12} key={post._id}>
                <PostPreview post={post} />
              </Col>
            ))}
            <MyPagination
              howManyPages={howManyPages}
              active={active}
              setActive={(page) => getPosts(page)}
            />
          </Row>
        ) : (
          <p>No posts available.</p>
        )}
      </section>

      {/* Sezione autori */}
      {loadingAuthors && <Loader />}
      <section className="mt-3 p-4 rounded-3 mb-3">
        <h2>Our top authors:</h2>
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
