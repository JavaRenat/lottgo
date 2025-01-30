import axios from "axios";
import { useEffect, useState } from "react";
import Genres from "../../component/Genres";
import CustomPagination from "../../component/pagination/CustomPagination";
import SingeContext from "../../component/singeContext/singeContext";
import { useGenres } from "../../hooks/useGenres";

export default function Movie() {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [numOfPage, setNumOfPage] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const genresUrl = useGenres(selectedGenres);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genresUrl}`
      );
      setNumOfPage(data.total_pages);
      setContent(data.results);
    };
    fetchContent();
  }, [page, genresUrl]);

  return (
    <div>
      <span className="pageTitle">MOVIE</span>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingeContext key={c.id} content={{ ...c, media_type: "Movie" }} />
          ))}
      </div>
      {numOfPage > 1 && (
        <CustomPagination setPage={setPage} numOfPage={numOfPage} />
      )}
    </div>
  );
}
