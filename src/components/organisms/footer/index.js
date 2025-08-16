import React from 'react';
import './style.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="container-fluid footer-container p-0">
        <p className="mb-0 bg-dark text-white text-center border border-1">
          Copyright &copy; {currentYear} AUCTION TEAM
        </p>
      </div>
    </footer>
  );
};

export default Footer;
