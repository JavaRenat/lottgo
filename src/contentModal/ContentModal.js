import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { unavailable } from "../config/config";
import { Backdrop, Fade, Modal } from "@material-ui/core";
import Carousel from "../component/carousel/Carousel";
import Button from "@material-ui/core/Button";
import axios from "axios";
import BackendConfig from "../config/config";
import { useTranslation } from "react-i18next";
import "./content.scss";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        width: "70vw",
        maxWidth: 800,
        height: "80vh",
        maxHeight: 900,
        background: "#39445a",
        border: "1px solid #282c34",
        borderRadius: 10,
        color: "white",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(3),
        overflowY: "auto",
        position: "relative"
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column"
    },
    modalContent: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up("md")]: {
            flexDirection: "row"
        }
    },
    leftColumn: {
        flex: 1,
        [theme.breakpoints.up("md")]: {
            maxWidth: "40%",
            marginRight: theme.spacing(2)
        }
    },
    rightColumn: {
        flex: 1,
        [theme.breakpoints.up("md")]: {
            maxWidth: "60%"
        }
    },
    photoCarouselContainer: {
        width: "100%",
        height: 300,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    photoImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        cursor: "pointer" // Курсор показывает, что фото кликабельно
    },
    navButtonsContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    modelName: {
        textAlign: "center",
        margin: theme.spacing(2, 0),
        fontSize: "1.5rem"
    },
    tag: {
        display: "inline-block",
        backgroundColor: "#ff9800",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "5px",
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        fontSize: "0.9rem"
    },
    infoList: {
        listStyle: "none",
        padding: 0,
        "& li": {
            marginBottom: theme.spacing(1)
        },
        "& strong": {
            marginRight: theme.spacing(2)
        }
    },
    description: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    footer: {
        marginTop: theme.spacing(2),
        display: "flex",
        justifyContent: "flex-end"
    },
    closeButton: {
        color: "white",
        backgroundColor: "#ff9800",
        borderRadius: 4,
        padding: theme.spacing(1, 2),
        textTransform: "none",
        "&:hover": {
            backgroundColor: "#e68900"
        }
    },
    fullScreenPaper: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    fullScreenImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        cursor: "pointer"
    },
    fullScreenCloseButton: {
        position: "absolute",
        top: 20,
        right: 20,
        color: "white",
        backgroundColor: "#ff9800",
        borderRadius: 4,
        padding: "8px 16px",
        textTransform: "none",
        "&:hover": {
            backgroundColor: "#e68900"
        }
    },
    // Стили для сообщений перед и после тегов
    preTagsMessage: {
        marginBottom: theme.spacing(1),
        fontSize: "1rem",
        textAlign: "center"
    },
    postTagsMessage: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3), // увеличенный отступ после текста
        fontSize: "1rem",
        textAlign: "center"
    }
}));

export default function ContentModal({ children, content, id, userData }) {
    const classes = useStyles();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [modelData, setModelData] = useState(null);
    const [services, setServices] = useState({});
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [photoFullscreen, setPhotoFullscreen] = useState(false);

    useEffect(() => {
        async function fetchModelData() {
            if (!content?.model_id) return;
            try {
                let modelResponse;
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/model_id.json`);
                    modelResponse = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.modelEndpoint}?id=${content.model_id}`);
                    modelResponse = response.data;
                }
                setModelData(modelResponse);
                setCurrentPhotoIndex(0); // Сброс индекса при загрузке новой модели
            } catch (error) {
                console.error("Ошибка загрузки модели", error);
            }
        }

        async function fetchServices() {
            try {
                let servicesData;
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/services.json`);
                    servicesData = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.servicesEndpoint}`);
                    servicesData = response.data;
                }
                setServices(servicesData);
            } catch (error) {
                console.error("Ошибка загрузки услуг", error);
            }
        }

        fetchModelData();
        fetchServices();
    }, [content?.model_id]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Навигация по фотографиям
    const handleNextPhoto = () => {
        if (!modelData) return;
        const photosArray = modelData.photos && modelData.photos.length > 0 ? modelData.photos : [];
        if (photosArray.length === 0) return;
        setCurrentPhotoIndex((prev) => (prev + 1) % photosArray.length);
    };

    const handlePrevPhoto = () => {
        if (!modelData) return;
        const photosArray = modelData.photos && modelData.photos.length > 0 ? modelData.photos : [];
        if (photosArray.length === 0) return;
        setCurrentPhotoIndex((prev) => (prev === 0 ? photosArray.length - 1 : prev - 1));
    };

    // Формирование URL фотографий по схеме:
    // `${process.env.PUBLIC_URL}/photos/${modelData.telegramId}_${modelData.id}/{имя фотки}`
    const photosArray =
        modelData && modelData.photos && modelData.photos.length > 0
            ? modelData.photos.map(
                (photoName) =>
                    `${process.env.PUBLIC_URL}/photos/${modelData.telegramId}_${modelData.id}/${photoName}`
            )
            : [
                content && content.poster_path
                    ? `${process.env.PUBLIC_URL}/photos/${content.poster_path}`
                    : unavailable
            ];

    return (
        <>
            <div className="media" onClick={handleOpen}>
                {children}
            </div>

            <Modal
                aria-labelledby="content-modal-title"
                aria-describedby="content-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    {modelData && (
                        <div className={classes.paper}>
                            <div className={classes.contentWrapper}>
                                <div className={classes.modalContent}>
                                    <div className={classes.leftColumn}>
                                        <div className={classes.photoCarouselContainer}>
                                            <img
                                                src={photosArray[currentPhotoIndex]}
                                                alt={`${modelData.name} photo ${currentPhotoIndex + 1}`}
                                                className={classes.photoImage}
                                                onClick={() => setPhotoFullscreen(true)}
                                            />
                                        </div>
                                        <div className={classes.navButtonsContainer}>
                                            <Button variant="outlined" onClick={handlePrevPhoto}>
                                                {t("prev")}
                                            </Button>
                                            <Button variant="outlined" onClick={handleNextPhoto}>
                                                {t("next")}
                                            </Button>
                                        </div>
                                        <h2 className={classes.modelName}>{modelData.name}</h2>
                                    </div>
                                    <div className={classes.rightColumn}>
                                        {/* Сообщение перед тегами */}
                                        <p className={classes.preTagsMessage}>
                                            {t("lottery_before_message")}
                                        </p>
                                        <div className="contentModal__services">
                                            {modelData.selectedServices.map((serviceId) => (
                                                <span key={serviceId} className={classes.tag}>
                                                    {t(services[serviceId])}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Сообщение после тегов */}
                                        <p className={classes.postTagsMessage}>
                                            {t("lottery_after_message")}
                                        </p>
                                        <ul className={classes.infoList}>
                                            <li>
                                                <strong>{t("age")}:</strong> {modelData.age || t("n/a")}
                                            </li>
                                            <li>
                                                <strong>{t("bust_size")}:</strong> {modelData.bustSize}
                                            </li>
                                            <li>
                                                <strong>{t("height")}:</strong> {modelData.height} {t("cm")}
                                            </li>
                                            <li>
                                                <strong>{t("weight")}:</strong> {modelData.weight} {t("kg")}
                                            </li>
                                            <li>
                                                <strong>{t("city")}:</strong> {modelData.city}
                                            </li>
                                        </ul>
                                        <p className={classes.description}>{modelData.description}</p>
                                        <Carousel id={id} />
                                    </div>
                                </div>
                                <div className={classes.footer}>
                                    <Button className={classes.closeButton} onClick={handleClose}>
                                        {t("close")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Fade>
            </Modal>

            {modelData && (
                <Modal
                    open={photoFullscreen}
                    onClose={() => setPhotoFullscreen(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{ timeout: 500 }}
                >
                    <Fade in={photoFullscreen}>
                        <div className={classes.fullScreenPaper}>
                            <img
                                src={photosArray[currentPhotoIndex]}
                                alt={`${modelData.name} full screen`}
                                className={classes.fullScreenImage}
                                onClick={() => setPhotoFullscreen(false)}
                            />
                            <Button
                                className={classes.fullScreenCloseButton}
                                onClick={() => setPhotoFullscreen(false)}
                            >
                                {t("close")}
                            </Button>
                        </div>
                    </Fade>
                </Modal>
            )}
        </>
    );
}
