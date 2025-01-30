import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { img_500, unavailable, unavailableLandscape } from "../config/config";
import { Backdrop, Button, Fade, Modal } from "@material-ui/core";
import axios from "axios";
import YouTubeIcon from "@material-ui/icons/YouTube";
import "./content.scss";
import Carousel from "../component/carousel/Carousel";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    width: "90%",
    height: "80%",
    background: "#39445a",
    border: "1px solod #282c34",
    borderRadius: 10,
    color: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 3)
  }
}));

export default function ContentModal({ children, media_type, id }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
  };
  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );

    setVideo(data.results[0]?.key);
  };
  useEffect(() => {
    fetchData();
    fetchVideo();
  }, []);
  return (
    <>
      <div className="media" onClick={handleOpen}>
        {children}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          {content && (
            <div className={classes.paper}>
              <div className="contentModal">
                {/* ảnh desktop */}
                <img
                  src={
                    content?.poster_path
                      ? `${img_500}/${content.poster_path}`
                      : unavailable
                  }
                  className="contentModal__portrait"
                  alt={content.name || content.title}
                />
                {/*  ảnh mobile */}
                <img
                  src={
                    content?.backdrop_path
                      ? `${img_500}/${content.backdrop_path}`
                      : unavailableLandscape
                  }
                  className="contentModal__landscape"
                  alt={content.name || content.title}
                />
                <div className="contentModal__about">
                  <span className="contentModal__title">
                    {content.name || content.title} (
                    {(
                      content.first_air_date ||
                      content.release_date ||
                      "----"
                    ).substring(0, 4)}
                    )
                  </span>
                  {content.tagline && (
                    <i className="tagline"> {content.tagline} </i>
                  )}
                  <p className="contentModal__decription">{content.overview}</p>
                  <div>
                    <Carousel media_type={media_type} id={id} />
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<YouTubeIcon />}
                    target="__blank"
                    href={`https://www.youtube.com/watch?v=${video}`}
                  >
                    Watch the trailer!!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Fade>
      </Modal>
    </>
  );
}
