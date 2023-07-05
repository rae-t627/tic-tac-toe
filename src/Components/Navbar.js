import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {
    Link,
  } from "react-router-dom";

function MyNavigationBar() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <div className="container" style={{ marginRight: "0"}}>
          <Navbar.Brand></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav className="justify-content-end" style={{ width: "100%" }}>
              <Nav.Link as={Link} to = "/" style={{ paddingLeft: "2.5rem" }}>Home</Nav.Link>
              <Nav.Link as={Link} to = "/dashboard" style={{ paddingLeft: "2.5rem" }}>Dashboard</Nav.Link>
              <Nav.Link as={Link} to = "/contact" style={{ paddingLeft: "2.5rem" }}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
}

export default MyNavigationBar;
