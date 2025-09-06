import { Container } from "react-bootstrap";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function MainLayout(){

  return( 
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

export default MainLayout;