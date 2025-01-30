import axios from "axios";
import { useEffect } from "react";
import { Chip } from "@material-ui/core";
export default function Genres(props) {
  const {
    type,
    selectedGenres,
    setSelectedGenres,
    genres,
    setGenres,
    setPage
  } = props;

  useEffect(() => {
    // chỉ chạy 1 lần khi mount
    const fetchContent = async () => {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      );
      setGenres(data.genres);
    };
    fetchContent();
    return () => {
      setGenres({});
    };
  }, []);

  const handeAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };
  const handeRemove = (genre) => {
    setGenres([...genres, genre]);
    setSelectedGenres(selectedGenres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  return (
    <div style={{ margin: "6px 0" }}>
      {selectedGenres &&
        selectedGenres.map((selected) => (
          <Chip
            style={{ margin: "2px" }}
            label={selected.name}
            clickable
            color="primary"
            key={selected.id}
            onDelete={() => handeRemove(selected)}
          />
        ))}
      {genres &&
        genres.map((genre) => (
          <Chip
            style={{ margin: "2px" }}
            label={genre.name}
            clickable
            key={genre.id}
            onClick={() => handeAdd(genre)}
          />
        ))}
    </div>
  );
}
