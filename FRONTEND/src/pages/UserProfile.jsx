import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import axios from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import PostPreview from "../components/PostPreview";
import Loader from "../components/Loader";
import ErrorModal from "../components/ErrorModal";

function UserProfile({ isMe }) {
  const { id } = useParams();
  const { token, userId } = useAuthContext();

  // const idToUse = id ? id : userId;

  const [showError, setShowError] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState(''); 

  const [author, setAuthor] = useState();
  const [authorPosts, setAuthorPosts] = useState([]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const getAuthor = async () => {
    let url;
    if (isMe) {
      url = "/me";
    } else if (id) {
      url = `/authors/${id}`;
    } else {
      return;
    }
    console.log("isMe", isMe, "ENDPOINT", url);
    try {
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAuthor(res.data);
    } catch (err) {
      setConsoleMsg("An error occurred while fetching your profile 😿 try again later");
      setShowError(true);
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const getPosts = async () => {
    try {
      console.log("Provo a prendere i post");
      const allPosts = await axios.get(`/authors/${author._id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(allPosts.data)) {
        throw new Error("Dati dei post non validi");
      }
      
      console.log("Posts filtrati per autore:", allPosts.data);
      setAuthorPosts(allPosts.data);
    } catch (err) {
      setConsoleMsg("An error occurred while fetching your posts 😿 try again later");
      setShowError(true);
      console.error("Errore nel recupero dei post dello user:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (!token) return; 
    getAuthor();
  }, [id, token, isMe]);

  useEffect(() => {
    console.log("dettaglio di:", author);
    if (author) getPosts();
  }, [author]);

  return (
    <>
      {loadingUser ? (
        <Loader />
      ) : (
        <Row className="py-4">
          <Col md={8}>
            <h2>{isMe ? "Your Posts" : "Posts"}</h2>
            {isMe && (
              <Link to={"/posts/add-post"}>
                <Button variant="secondary">
                  <i className="bi bi-plus me-2"></i>
                  Add post
                </Button>
              </Link>
            )}
            {loadingPosts ? (
              <Loader />
            ) : (
              <Row>
                {authorPosts.length > 0 ? (
                  authorPosts.map((post) => (
                    <Col sm={12} key={post._id}>
                      <PostPreview post={post} />
                    </Col>
                  ))
                ) : (
                  <p className="my-5 fs-3">Still no posts 🤷‍♀️</p>
                )}
              </Row>
            )}
          </Col>
          <Col md={4} className="vh90 border-start">
            <Row className="align-items-center ">
              <Col sm={3}>
                <img
                  src={author.avatar}
                  alt="profile picture"
                  className="profileImg"
                />
              </Col>
              <Col sm={9} className="d-flex flex-column">
                <div className="pb-4 ">
                  <h2 className="titleColor text-end">
                    {author.nome} {author.cognome}
                  </h2>
                  <p className="d-flex align-items-center justify-content-end">
                    <i className="bi bi-envelope-at me-3"></i>
                    {author.email}
                  </p>
                </div>
                {isMe && (
                  <Link to={"/me/edit"} className="mt-3 align-self-end">
                    <Button variant="outline-secondary">
                      <i className="bi bi-pencil me-3"></i>
                      Edit profile
                    </Button>
                  </Link>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      <ErrorModal consoleMsg={consoleMsg} show={showError} setShow={setShowError} />
    </>
  );
}

export default UserProfile;
