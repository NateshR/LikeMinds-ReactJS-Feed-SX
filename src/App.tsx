import React, { useState } from 'react';
import './App.css';
import FeedComponent from './pages/Feed/Feed';
import Header from './components/Header';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
function LMFeed() {
  const [, setCallBack] = useState<null | ((action: string, index: number, value: never) => void)>(
    null
  );
  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <section className="mainBlock">
        {/* <div className="nav">
          <Nav />
        </div> */}
        <BrowserRouter>
          <div className="main">
            <Provider store={store}>
              <FeedComponent setCallBack={setCallBack} />
            </Provider>
          </div>
        </BrowserRouter>
      </section>
    </div>
  );
}

export default LMFeed;
