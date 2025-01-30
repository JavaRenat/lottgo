import Header from "./component/header/Header";
import "./styles.scss";
import FootNav from "./component/FootNav";
import {Container} from "@material-ui/core";
import {Route, Routes} from "react-router-dom";
import Trending from "./pages/Trending/Trending";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series";
import Search from "./pages/Search/Search";
import { useEffect } from "react";

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
                        <Route path="/" element={<Trending/>}/>
                        <Route path="/movies" element={<Movies/>}/>
                        <Route path="/series" element={<Series/>}/>
                        <Route path="/search" element={<Search/>}/>
                    </Routes>
                </Container>
            </div>
            <FootNav/>
        </>
    );
}
