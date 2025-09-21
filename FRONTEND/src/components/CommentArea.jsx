import { Accordion, Alert, Col, Container, Row } from "react-bootstrap";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useRef, useState } from "react";
import axios from "../../data/axios";
import { useParams } from "react-router-dom";
import SingleComment from "./SingleComment";
import AddComment from "./AddComment";
import Loader from "./Loader";

function CommentArea() {
  const { id } = useParams(); //id post

  const containerRef = useRef(null); //scroll automatico per accordion open

  const [isLoading, setIsLoading] = useState(true);
  const [commentList, setCommentList] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [scrollCommentId, setScrollCommentId] = useState(null); //per tornare al commento editato
  const [consoleMsg, setConsoleMsg] = useState(""); //messaggio di errore per l'utente

  const [commentToEdit, setCommentToEdit] = useState({}); //statelifting per edit
  const [successDel, setSuccessDel] = useState(false);

  const fetchComments = async () => {
    const comments = await axios.get(`/posts/${id}/comments`);
    console.log("comments.data.length", comments.data.length);
    setCommentList(comments.data);
    setIsLoading(false);
    if (comments.data.length === 0) {
      console.log("no comments for this post");
      setConsoleMsg("Be the first person to comment this post! 🎉");
      return;
    }
  };

  useEffect(() => {
    fetchComments();
    console.log("commentList.length", commentList.length);
  }, [id, successDel]);

  return (
    <Container className="w-75 m-auto px-0">
      {consoleMsg && (
        <Alert variant="secondary" className="fs-3">
          {consoleMsg}
        </Alert>
      )}
      <Accordion
        className="mb-3"
        activeKey={isAccordionOpen ? "0" : null}
        onSelect={(key) => setIsAccordionOpen(key === "0")}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add comment</Accordion.Header>
          <Accordion.Body>
            <AddComment
              commentToEdit={commentToEdit}
              setCommentToEdit={setCommentToEdit}
              isAccordionOpen={isAccordionOpen}
              setIsAccordionOpen={setIsAccordionOpen}
              containerRef={containerRef} //passa ref per scroll
              refreshComments={fetchComments} //aggiorna lista dopo submit
              setScrollCommentId={setScrollCommentId} //per focus sul commento edit/add
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row>
        {isLoading && commentList.length > 0 ? (
          <Loader />
        ) : (
          commentList.length > 0 &&
          commentList.map((comment) => (
            <Col sm={12} key={comment._id}>
              <SingleComment
                comment={comment}
                postId={id}
                setIsAccordionOpen={setIsAccordionOpen}
                setCommentToEdit={setCommentToEdit}
                setSuccessDel={setSuccessDel}
                successDel={successDel}
                scrollToThis={scrollCommentId === comment._id}
              />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
export default CommentArea;
