import {
  Container,
  Dropdown,
  Image,
  InputGroup,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import { Form, Link } from "react-router-dom";

function Header() {


  return (
    <div>
      <Navbar expand="lg" className="navbarStyle">
        <Container className="d-flex align-items-center">
          <Navbar.Brand
            to="/"
            as={Link}
            className="py-0 me-2 d-flex align-items-center"
          >
            <i className="bi bi-pen text-dark fs-1 me-3"></i>
            <span className="fs-1 text-dark">StriveBlog</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title={
                  <Image
                    src="https://placehold.co/40x40"
                    roundedCircle
                    className="dropdownAvatar"
                  />
                }
                id="nav-avatar-dropdown"
                align="end"
              >
                
                <NavDropdown.Item to="/posts/add-post" as={Link}>
                  Add post
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item to="/" as={Link}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
