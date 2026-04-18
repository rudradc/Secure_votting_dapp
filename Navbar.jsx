import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Vote, BarChart, LogOut, ShieldCheck, Settings, Users } from 'lucide-react';

const Navigation = ({ user, logout }) => {
  return (
    <Navbar expand="lg" className="glass-card mx-3 mt-3 px-3 py-2 border-0">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 text-white fw-bold">
          <Vote className="text-primary" />
          <span>Chain<span className="gradient-text">Vote</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={NavLink} to="/results" className="d-flex align-items-center gap-1">
              <BarChart size={18} /> Results
            </Nav.Link>
            <Nav.Link as={NavLink} to="/history" className="d-flex align-items-center gap-1">
              <Users size={18} /> History
            </Nav.Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Nav.Link as={NavLink} to="/admin" className="d-flex align-items-center gap-1">
                    <Settings size={18} /> Admin
                  </Nav.Link>
                )}
                {user.role === 'voter' && (
                  <Nav.Link as={NavLink} to="/vote" className="d-flex align-items-center gap-1">
                    <Vote size={18} /> Vote Now
                  </Nav.Link>
                )}
                <div className="d-flex align-items-center gap-2 ms-3">
                  <div className="d-flex align-items-center gap-1 badge bg-dark border border-secondary text-light p-2 px-3 rounded-pill">
                    <ShieldCheck size={14} className={user.role === 'admin' ? "text-danger" : user.role === 'auditor' ? "text-warning" : "text-success"} />
                    {user.id}
                  </div>
                  <Button variant="outline-light" size="sm" onClick={logout} className="rounded-circle p-2 d-flex align-items-center">
                    <LogOut size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                <Button className="btn-gradient px-4 rounded-pill">Login to Vote</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
