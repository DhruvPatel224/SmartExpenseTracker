import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="bg-primary text-white rounded p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-wallet2 fs-5"></i>
          </div>
          <div>
            <span className="fs-5 fw-bold text-dark">Smart</span>
            <span className="fs-5 fw-bold text-primary ms-1">Personal Finance Tracker</span>
          </div>
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 rounded-3 ${isActive ? 'active text-primary bg-primary bg-opacity-10 fw-semibold' : 'text-secondary hover-bg-light'}`} 
                to="/" 
                end
              >
                <i className="bi bi-grid-1x2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 rounded-3 ${isActive ? 'active text-primary bg-primary bg-opacity-10 fw-semibold' : 'text-secondary hover-bg-light'}`} 
                to="/expenses"
              >
                <i className="bi bi-receipt me-1"></i> Expenses
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link 
                to="/add" 
                className="btn btn-primary px-4 shadow-sm w-100 w-lg-auto"
              >
                <i className="bi bi-plus-lg me-1"></i> Add New
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
