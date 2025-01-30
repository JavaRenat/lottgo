import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
