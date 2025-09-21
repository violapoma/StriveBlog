import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import Logo from "./Logo";

function Header() {
  const { token, logout, loggedUser } = useAuthContext();

  return (
    <Navbar expand="lg" className="navbarStyle">
      <Container className="d-flex align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="py-0 me-2 d-flex align-items-center"
        >
          <Logo />
        </Navbar.Brand>
        {token && loggedUser && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavDropdown
                  title={
                    <Image
                      src={loggedUser.avatar}
                      roundedCircle
                      className="dropdownAvatar"
                    />
                  }
                  id="nav-avatar-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    {loggedUser.nome} {loggedUser.cognome}
                  </NavDropdown.Header>
                  <NavDropdown.Item to="/me" as={Link}>
                    View profile
                  </NavDropdown.Item>
                  <NavDropdown.Item to="/posts/add-post" as={Link}>
                    Add post
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to="/" as={Link} onClick={logout}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
