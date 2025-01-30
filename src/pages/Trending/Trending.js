import axios from "axios";
import {useEffect, useState} from "react";
import SingeContext from "../../component/singeContext/singeContext";
import CustomPagination from "../../component/pagination/CustomPagination";
import "./trending.scss";

const useMockData = true; // Переключатель между API и моковыми данными


export default function Trending() {
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [numOfPages, setNumOfPages] = useState(10); // Количество страниц

    useEffect(() => {
        window.scroll(0, 0);
        const fetchTrending = async () => {
            let data;
            if (useMockData) {
                const response = await fetch(`${process.env.PUBLIC_URL}/mock/trending.json`);
                data = await response.json();
            } else {
                const response = await axios.get(
                    `https://Evgenij_lezhnin_s_API/v1/chances?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
                );
                data = response.data;
            }
            setContent(data.results);
            setNumOfPages(data.total_pages);
        };
        fetchTrending();
        // eslint-disable-next-line
    }, [page]);

    return (
        <div>
            <span className="pageTitle">Current chances</span>
            <div className="trending">
                {content.map((c) => (
                    <SingeContext key={c.id} content={c}/>
                ))}
            </div>
            <CustomPagination setPage={setPage} numOfPage={numOfPages}/>
        </div>
    );
}
