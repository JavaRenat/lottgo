import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import {HashRouter} from "react-router-dom";
import App from "./App";

const ensureHashRouting = () => {
    if (
        window.location.pathname.startsWith("/lottgo") &&
        !window.location.hash
    ) {
        window.location.replace(`/lottgo/#/`);
    }
};

ensureHashRouting();

const rootElement = document.getElementById("root");
ReactDOM.render(
    <HashRouter>
        <App/>
    </HashRouter>,
    rootElement
);
