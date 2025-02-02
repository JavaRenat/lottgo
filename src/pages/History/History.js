import axios from "axios";
import {useEffect, useState} from "react";
import CustomPagination from "../../component/pagination/CustomPagination";
import SingeContext from "../../component/singeContext/singeContext";
import BackendConfig from "../../config/config";
import {useTranslation} from "react-i18next";

export default function History({userData}) {
    const {t} = useTranslation();
    const [content, setContent] = useState([]);
    const [page, setPage] = useState(1);
    const [numOfPage, setNumOfPage] = useState();

    useEffect(() => {
        window.scroll(0, 0);
        const fetchTrending = async () => {
            let data;
            if (BackendConfig.useMockData) {
                const response = await fetch(`${process.env.PUBLIC_URL}/mock/finishedgames.json`);
                data = await response.json();
            } else {
                const response = await axios.get(
                    `${BackendConfig.currentGamesEndpoint}?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
                );
                data = response.data;
            }
            setContent(data.results);
            setNumOfPage(data.total_pages);
        };
        fetchTrending();
        // eslint-disable-next-line
    }, [page]);

    return (
        <div>
            <span className="pageTitle">{t("history_games")}</span>
            <div className="trending">
                {content.map((c) => (
                    <SingeContext key={c.id} content={c} userData={userData}/>
                ))}
            </div>
            {numOfPage > 1 && (
                <CustomPagination setPage={setPage} numOfPage={numOfPage}/>
            )}
        </div>
    );
}
