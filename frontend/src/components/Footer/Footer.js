import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <NavItem>
            <NavLink href="https://github.com/Amaranthusss">
              Amaranthus
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="">
              About Me
            </NavLink>
          </NavItem>
        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()} Automated Guided Vehicle
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
