import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function UserPreview({ profile }) {
  // se l'avatar non è impostato
  let imgToUse =
    profile.avatar == ""
      ? "https://res.cloudinary.com/dm9gnud6j/image/upload/v1757176661/nopicuser_puf2bd.png"
      : profile.avatar;

  return (
    <Link to={`/authors/${profile._id}`}>
      <Row className="profilePreview">
        <Col sm={3}>
          <img src={imgToUse} alt="profile pic" className="profilePreviewImg" />
        </Col>
        <Col sm={9}>
          <h2 className="fs-3">{profile.nome} · {profile.cognome}</h2>
          <p>{profile.email}</p>
        </Col>
      </Row>
    </Link>
  );
}

export default UserPreview;
