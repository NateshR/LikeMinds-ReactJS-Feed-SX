// src/Footer/Footer.tsx

import React from 'react';

const Nav: React.FC = () => {
  return (
    <div>
      <nav className="navBar">
        <ul>
          <li>
            <a href="#" className="active">
              Feed
            </a>
          </li>
          <li>
            <a href="#">Chat</a>
          </li>
          <li>
            <a href="#">Search</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
