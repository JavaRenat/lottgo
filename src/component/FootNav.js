import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
  root: {
    width: "100%",
    bottom: 0,
    position: "fixed",
    background: "#2d313a",
    zIndex: 100
  }
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const navi = useNavigate();
  useEffect(() => {
    if (value === 0) return navi("/");
    else if (value === 1) return navi("/movies");
    else if (value === 2) return navi("/series");
    else if (value === 3) return navi("/search");
  }, [value, navi]);
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        style={{ color: "red" }}
        label="Get chance"
        icon={<FavoriteIcon  />}
      />
      <BottomNavigationAction
        style={{ color: "black" }}
        label="Сompleted Chances"
        icon={<CheckCircleIcon />}
      />
      <BottomNavigationAction
        style={{ color: "grey" }}
        label="Settings"
        icon={<SettingsIcon  />}
      />
      {/*<BottomNavigationAction*/}
      {/*  style={{ color: "white" }}*/}
      {/*  label="Search"*/}
      {/*  icon={<SearchIcon />}*/}
      {/*/>*/}
    </BottomNavigation>
  );
}
