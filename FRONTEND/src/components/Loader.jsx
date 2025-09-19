import { Container } from "react-bootstrap";
import { BarLoader } from "react-spinners";

function Loader() {
  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center loaderContainer">
      <BarLoader width={150} color="#6b37bf" />
    </Container>
  );
}

export default Loader;
