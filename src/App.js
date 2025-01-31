import Header from "./component/header/Header";
import "./styles.scss";
import FootNav from "./component/FootNav";
import {Container} from "@material-ui/core";
import {Route, Routes} from "react-router-dom";
import CurrentGames from "./pages/CurrentGames/CurrentGames";
import History from "./pages/History/History";
import Series from "./pages/Series/Series";
import Search from "./pages/Search/Search";
import { useEffect } from "react";
import "./i18n";  // Подключаем i18n

export default function App() {
    useEffect(() => {
        console.log("React App загружен!");
    }, []);


    return (
        <>
            <Header/>
            <div className="app">
                <Container>
                    <Routes>
                        <Route path="/" element={<CurrentGames/>}/>
                        <Route path="/history" element={<History/>}/>
                        <Route path="/settings" element={<Series/>}/>
                    </Routes>
                </Container>
            </div>
            <FootNav/>
        </>
    );
}
