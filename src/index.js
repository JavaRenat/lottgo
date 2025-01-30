import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import {HashRouter} from "react-router-dom";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <HashRouter>
        <App/>
    </HashRouter>,
    rootElement
);
