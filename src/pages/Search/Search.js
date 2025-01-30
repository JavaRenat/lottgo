import {
  Button,
  createTheme,
  Tab,
  Tabs,
  TextField,
  ThemeProvider
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import SingeContext from "../../component/singeContext/singeContext";
import CustomPagination from "../../component/pagination/CustomPagination";
import { useEffect, useState } from "react";

export default function Search() {
  const [type, setType] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);
  const [numOfPage, setNumOfPage] = useState(1);

  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#fff"
      }
    }
  });
  const fetchContent = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
        process.env.REACT_APP_API_KEY
      }&language=en-US&query=${
        searchText || "a"
      }&page=${page}&include_adult=false`
    );
    setNumOfPage(data.total_pages);
    setContent(data.results);
  };
  useEffect(() => {
    window.scroll(0, 0);
    fetchContent();
  }, [page, type, searchText]);
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <div style={{ display: "flex", margin: "10px 0" }}>
          <TextField
            style={{ flex: "1" }}
            label="search"
            className="searchBox"
            variant="filled"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={fetchContent}
          >
            <SearchIcon />
          </Button>
        </div>
        <Tabs
          value={type}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, newValue) => {
            setType(newValue);
            setPage(1);
          }}
          style={{ paddingBottom: "5" }}
        >
          <Tab style={{ width: "50%" }} label="Search Movie" />
          <Tab style={{ width: "50%" }} label="Search TV Series" />
        </Tabs>
      </ThemeProvider>
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingeContext
              key={c.id}
              content={{ ...c, media_type: type ? "tv" : "movie" }}
            />
          ))}
        {content.length < 1 &&
          searchText &&
          (type ? <h2>No Tv Series found</h2> : <h2>No Movie found</h2>)}
      </div>
      {numOfPage > 1 && (
        <CustomPagination setPage={setPage} numOfPage={numOfPage} />
      )}
    </div>
  );
}
