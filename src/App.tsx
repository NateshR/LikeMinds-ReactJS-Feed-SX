import React, { useState } from 'react';
import './App.css';
import FeedComponent from './pages/Feed/Feed';
import Header from './components/Header';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostDetails from './components/post-details';
function App() {
  const [callback, setCallBack] = useState<
    null | ((action: string, index: number, value: any) => void)
  >(null);
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <section className="mainBlock">
        <div className="nav">
          <Nav />
        </div>
        <BrowserRouter>
          <div className="main">
            <FeedComponent setCallBack={setCallBack} />
          </div>
        </BrowserRouter>
      </section>
    </div>
  );
}

export default App;
