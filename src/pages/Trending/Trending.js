import axios from "axios";
import { useEffect, useState } from "react";
import SingeContext from "../../component/singeContext/singeContext";
import CustomPagination from "../../component/pagination/CustomPagination";
import "./trending.scss";
export default function Trending() {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);

  useEffect(() => {
    // window.scroll(0, 0);
    const fetchTrending = async () => {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
      );
      setContent(data.results);
    };
    fetchTrending();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div>
      <span className="pageTitle">Trending</span>
      <div className="trending">
        {content.map((c) => (
          <SingeContext key={c.id} content={c} />
        ))}
      </div>
      <CustomPagination setPage={setPage} />
    </div>
  );
}
