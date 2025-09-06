import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../data/axios";
import parse from "html-react-parser"; //per quill
import { Alert, Button, Container, Modal } from "react-bootstrap";
import Footer from "../components/Footer";

function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState();
  const [dateToShow, setDateToShow] = useState("");
  const [show, setShow] = useState(false);
  const [successDel, setSuccessDel] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deletePost = async () => {
    try {
      const res = axios.delete(`/posts/${id}`);
      console.log("deleted successfully");
      setSuccessDel(true);

      setTimeout(() => {
        handleClose();
        navigate("/");
      }, 1000);
    } catch (e) {
      console.log("errore nella delete", e);
    }
  };

  const getPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}`);
      console.log("post", res.data);
      setPost(res.data);
    } catch (e) {
      console.log("errore nel recupero del post", e);
    }
  };

  function getDate(dateString) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  }

  useEffect(() => {
    getPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setDateToShow(getDate(post.createdAt));
    }
  }, [post]);

  return (
    <>
      {post && (
        <Container>
          <div id="postContent">
            <div className="border-bottom my-3 pb-3">
              <h1 className="fw-bold">{post.title}</h1>
              <div className="d-flex align-items-center justify-content-between">
                <div className="w-50 d-flex justify-content-evenly align-items-center">
                  {/* TODO: immagine profilo autore */}
                  <span className="fw-semibold">{post.author}</span>
                  <Button variant="outline-secondary" className="rounded-5">
                    Follow
                  </Button>
                  <span>
                    {post.readTime.value} {post.readTime.unit} read
                  </span>
                  <span className="mx-3">·</span>
                  <span>{dateToShow}</span>
                </div>
                <div>
                  <Link to={`/posts/edit-post/${id}`}>
                    <Button variant="outline-secondary" className="border-0">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </Link>
                  <Button variant="outline-secondary" className="border-0">
                    <i className="bi bi-trash" onClick={handleShow}></i>
                  </Button>
                </div>
              </div>
            </div>
            <div className="py-3">
              <img src={post.cover} alt="post cover" className="postImg" />
            </div>
            <div>{parse(post.content)}</div>
          </div>
        </Container>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          {successDel ? (
            <Alert variant="success">Post deleted successfully!</Alert>
          ) : (
            <>
              Are you sure you want to delete <strong>permanently</strong> this
              post? This action is irreversible!
            </>
          )}
        </Modal.Body>
        {!successDel && (
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose}>
              Go back
            </Button>
            <Button variant="danger" onClick={deletePost}>
              Delete this post <strong>permanently</strong>
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      <Footer />
    </>
  );
}
export default PostDetails;
