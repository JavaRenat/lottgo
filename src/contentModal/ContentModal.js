import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {img_500, unavailable, unavailableLandscape} from "../config/config";
import {Backdrop, Button, Fade, Modal} from "@material-ui/core";
import axios from "axios";
import YouTubeIcon from "@material-ui/icons/YouTube";
import "./content.scss";
import Carousel from "../component/carousel/Carousel";
import CloseIcon from "@material-ui/icons/Close";
import {IconButton} from "@mui/material"; // Иконка закрытия

// const useStyles = makeStyles((theme) => ({
//     modal: {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//     },
//     paper: {
//         width: "100%",
//         height: "80%",
//         background: "#39445a",
//         border: "1px solod #282c34",
//         borderRadius: 10,
//         color: "white",
//         boxShadow: theme.shadows[5],
//         padding: theme.spacing(1, 1, 3)
//     }
// }));

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        width: "70vw", // Используем viewport width, чтобы модалка была шире
        maxWidth: "800px", // Ограничиваем максимальную ширину
        height: "80vh", // Используем viewport height
        maxHeight: "900px", // Ограничиваем максимальную высоту
        background: "#39445a",
        border: "1px solid #282c34",
        borderRadius: 10,
        color: "white",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3), // Увеличенный padding
        overflowY: "auto" // Добавляем прокрутку, если контент выходит за пределы
    }
}));

export default function ContentModal({children, content, id}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    // const [content, setContent] = useState();
    // const [video, setVideo] = useState();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                    <div className={classes.paper}>
                        {/* Кнопка закрытия */}
                        <IconButton className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>

                        {content && (
                            // <div className={classes.paper}>
                                <div className="contentModal">
                                    {/* ảnh desktop ${img_500} */}
                                    <img
                                        src={
                                            content?.poster_path
                                                ? `${process.env.PUBLIC_URL}/photos/${content.poster_path}`
                                                : unavailable
                                        }
                                        className="contentModal__portrait"
                                        alt={content.name || content.title}
                                    />
                                    {/*  ảnh mobile ${img_500}  */}
                                    <img
                                        src={
                                            content?.poster_path
                                                ? `${process.env.PUBLIC_URL}/photos/${content.poster_path}`
                                                : unavailableLandscape
                                        }
                                        className="contentModal__landscape"
                                        alt={content.name || content.title}
                                    />
                                    <div className="contentModal__about">
                                        <span className="contentModal__title">
                                            {content.name || content.title}
                                        </span>
                                        <p className="contentModal__decription">{content.overview}</p>
                                        <div>
                                            <Carousel id={id}/>
                                        </div>
                                    </div>

                            </div>
                        )}
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
