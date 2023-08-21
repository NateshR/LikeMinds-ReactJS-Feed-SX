import React from 'react';
import './App.css';
import FeedComponent from './pages/Feed/Feed';
import Header from './components/Header';
import Nav from './components/Nav';

function App() {
  return (
    <div>
      {/* <div className="header">
        <Header />
      </div> */}
      <section className="mainBlock">
        <div className="nav">
          <Nav />
        </div>
        <div className="main">
          <FeedComponent />
        </div>
      </section>
    </div>
  );
}

export default App;
