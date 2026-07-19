import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container text-center">
        <p className="text-muted small mb-0">
          &copy; {new Date().getFullYear()} Smart Expense Tracker
        </p>
      </div>
    </footer>
  );
}

export default Footer;
