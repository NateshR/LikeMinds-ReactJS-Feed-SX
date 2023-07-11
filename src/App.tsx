import logo from "./logo.svg";
import "./App.css";
import FeedComponent from "./pages/Feed/Feed";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { useEffect } from "react";
import { lmFeedClient } from ".";

function App() {
  useEffect(() => {
    lmFeedClient.initiateUser("28f7f107-5916-4cce-bbb7-4ee48b35e64d", false);
  }, []);
  return (
    <div>
      <div className="header">
        <Header />
      </div>
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
