import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";
import SvgIcon from '@mui/material/SvgIcon';

const useStyles = makeStyles({
  root: {
    width: "100%",
    bottom: 0,
    position: "fixed",
    background: "#2d313a",
    zIndex: 100
  }
});

function SpadeIcon(props) {
  return (
      <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M12 2C9 7 3 10 3 14a5 5 0 009 3.5V20H9v2h6v-2h-3v-2.5A5 5 0 0021 14c0-4-6-7-9-12z" fill="black" />
      </SvgIcon>
  );
}

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
        icon={<SpadeIcon />}
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
