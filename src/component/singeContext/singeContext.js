import {Badge, Button} from "@material-ui/core";
import {img_300, unavailable} from "../../config/config";
import ContentModal from "../../contentModal/ContentModal";
import "./singe.scss";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function SingeContext({content}) {
    const { t } = useTranslation();
    const {
        id,
        poster_path,
        progress,
        bitcoin_price_at,
        title,
        participation_price_usd
    } = content;

    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (bitcoin_price_at) {
            updateRemainingTime();
            const interval = setInterval(updateRemainingTime, 1000); // Обновление каждую секунду
            return () => clearInterval(interval);
        }
    }, [bitcoin_price_at]);

    const updateRemainingTime = () => {
        setTimeLeft(getTimeLeftString(bitcoin_price_at, t));
    };

    return (
        <ContentModal id={id} content={content}>
            <Badge
                badgeContent={progress}
                color={progress > 70.0 ? "primary" : "secondary"}
            />
            <img
                className="poster"
                src={`photos/${poster_path}` || unavailable}
                alt={title}
            />
            <b className="title">{title}</b>
            <div className="subTitle">
                <div className="time-container">
                    {/* Текстовое поле */}
                    <div className="time-box">
                        <span>₿ {t("through")} {timeLeft}</span>
                    </div>

                    {/* SVG-анимация без разрывов */}
                    <svg className="indicator" viewBox="0 0 200 50">
                        <rect x="2" y="2" width="196" height="46" rx="23" ry="23"
                              stroke="white" fill="none"/>
                        <rect className="indicator-path" x="2" y="2" width="196" height="46" rx="23" ry="23"
                              stroke="gold" strokeWidth="4" fill="none"
                              strokeDasharray="300"
                              strokeDashoffset="600"/>
                    </svg>
                </div>
            </div>
            <div className="button-container">
                <Button variant="contained" className="play-button">
                    {t("play")} | ${participation_price_usd}
                </Button>
            </div>
        </ContentModal>
    );
}

// Функция для вычисления оставшегося времени с точностью до секунды
function getTimeLeftString(dateStr, t) {
    const targetDate = new Date(dateStr);
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return t("expired");

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} ${t("months")} ${days % 30} ${t("days")}`;
    if (weeks > 0) return `${weeks} ${t("weeks")} ${days % 7} ${t("days")}`;
    if (days > 0) return `${days} ${t("days")} ${hours} ${t("hours")}`;
    if (hours > 0) return `${hours} ${t("hours")} ${minutes} ${t("minutes")}`;
    if (minutes > 0) return `${minutes} ${t("minutes")} ${seconds} ${t("seconds")}`;
    return `${seconds} ${t("seconds")}`;
}