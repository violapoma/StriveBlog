import { Alert, Button, Col, Image, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useRef, useState } from "react";
import axios from "../../data/axios";
import parse from "html-react-parser"; //per quill

function SingleComment({ comment, postId, setCommentToEdit, successDel, setSuccessDel, scrollToThis, setIsAccordionOpen }) {
  const { token, loggedUser } = useAuthContext();
  const date = new Date(comment.updatedAt); //prendo questo, metti caso che faccio al modifica

  //modale di cancellazione
  const [show, setShow] = useState(false);

  const commentRef = useRef(null);

  //messaggio di errore per lo user
  const [consoleMsg, setConsoleMsg] = useState("");

  const formatted = date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isMine = comment.author._id === loggedUser._id; //va bene anche senza stato credo

  useEffect(() => {
    if (scrollToThis && commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollToThis]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteComment = async () => {
    try {
      const deleting = await axios.delete(`/posts/${postId}/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessDel(true);
      setTimeout(() => {
        handleClose();
        setSuccessDel(false);
      }, 1000);
    } catch (error) {
      console.log("errore cancellazione commento", error);
      setConsoleMsg(
        "An error occurred while deleting your comment, try again later"
      );
    }
  };

  const editComment = () => {
    console.log('setCommentToEdit in singlecomment', comment);
    setCommentToEdit(comment);
    setIsAccordionOpen(true);
  };

  return (
    <>
      <Row className="mb-3 mx-1 gy-2 align-items-center rounded bgLight">
        <Col sm={1}>
          <Image
            src={comment.author.avatar}
            roundedCircle
            className="dropdownAvatar"
          />
        </Col>
        <Col sm={11}>
          <Row>
            <Col sm={5} >
              <Link to={`/authors/${comment.author._id}`} className='authorLink'>
                {comment.author.nome} {comment.author.cognome}
              </Link>
              {isMine && (
                <div className="d-inline mx-3">
                  <Button variant="outline-secondary" onClick={editComment} className=" border-0 text-dark button">
                    <i className="bi bi-pencil-square" />
                  </Button>
                  <Button variant="outline-secondary" onClick={handleShow} className="border-0 text-dark button">
                    <i className="bi bi-trash" />
                  </Button>
                </div>
              )}
            </Col>
            <Col sm={7} className="text-end">
              {formatted}
            </Col>
          </Row>
        </Col>
        <Col sm={12} className="my-3">
          {parse(comment.text)}
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          {successDel ? (
            <Alert variant="success">Comment deleted successfully!</Alert>
          ) : (
            <>
              Are you sure you want to delete this comment <strong>permanently</strong>? This action is irreversible!
            </>
          )}
          {consoleMsg && <Alert variant="danger">{consoleMsg}</Alert>}
        </Modal.Body>
        {!successDel && (
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose}>
              Go back
            </Button>
            <Button variant="danger" onClick={deleteComment}>
              Delete this comment <strong>permanently</strong>
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
export default SingleComment;
