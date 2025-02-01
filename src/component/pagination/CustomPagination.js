import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const darkTheme = createTheme({
  palette: {
    type: "dark"
  }
});

export default function CustomPagination({ setPage, numOfPage = 10 }) {
  const handePageChange = (e, value) => {
    setPage(e.target.textContent);
    window.scroll(0, 0);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "20"
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <Pagination
          variant="outlined"
          count={numOfPage}
          onChange={handePageChange}
          color="primary"
        />
      </ThemeProvider>
    </div>
  );
}
