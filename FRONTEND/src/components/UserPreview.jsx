import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function UserPreview({ profile }) {
  // se l'avatar non è impostato
  let imgToUse =
    profile.avatar == ""
      ? "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
      : profile.avatar;

  return (
    <Link to={`/authors/${profile._id}`}>
      <Row className="profilePreview">
        <Col sm={3}>
          <img src={imgToUse} alt="profile pic" className="profileImg" />
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
