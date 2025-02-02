import {Badge, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import BackendConfig, {unavailable} from "../../config/config";
import ContentModal from "../../contentModal/ContentModal";
import "./singe.scss";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function SingeContext({content, userData, setUserData}) {
    const {t} = useTranslation();
    const {
        id,
        poster_path,
        bitcoin_price_at,
        title,
        participation_price_usd
    } = content;

    const userGamesCount = userData?.games_count?.[id] || 0;
    const [timeLeft, setTimeLeft] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [showCloseButton, setShowCloseButton] = useState(false);

    useEffect(() => {
        if (bitcoin_price_at) {
            updateRemainingTime();
            const interval = setInterval(updateRemainingTime, 1000);
            return () => clearInterval(interval);
        }
    }, [bitcoin_price_at]);

    const updateRemainingTime = () => {
        setTimeLeft(getTimeLeftString(bitcoin_price_at, t));
    };

    const handlePlayClick = () => {

        if (userData.balance < participation_price_usd) {
            setDialogMessage(t("insufficient_funds"));
            setShowCloseButton(true);
            setOpenDialog(true);
            return;
        }

        if (userGamesCount > 0) {
            setDialogMessage(`${t("existing_tickets")} ${userGamesCount} ${t("want_more_tickets")}`);
        } else {
            setDialogMessage(t("confirm_purchase"));
        }
        setShowCloseButton(false);
        setOpenDialog(true);
    };

    const confirmPlay = async () => {
        try {
            let response;
            let data;
            if (BackendConfig.useMockData) {
                // Используем моковые данные
                response = await fetch(`${process.env.PUBLIC_URL}/mock/play.json`);
                data = await response.json();
            } else {
                // Отправляем запрос на бэкенд
                response = await fetch(`${BackendConfig.playEndpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegramId: userData.telegramId, gameId: id })
                });
                data = await response.json();
            }
            if (data.success) {
                const newBalance = userData.balance - participation_price_usd;
                console.log("newBalance" + newBalance);
                setUserData((prev) => ({
                    ...prev,
                    balance: newBalance,
                    games_count: {
                        ...prev.games_count,
                        [id]: (prev.games_count?.[id] || 0) + 1
                    }
                }));
            } else {
                console.error("purchase_error");
            }
        } catch (error) {
            console.error("network_error", error);
        }
        setOpenDialog(false);
    };

    return (
        <>
            <ContentModal id={id} content={content}>
                <Badge
                    badgeContent={userGamesCount}
                    color={"secondary"}
                />
                <img
                    className="poster"
                    src={`photos/${poster_path}` || unavailable}
                    alt={title}
                />
                <b className="title">{title}</b>
                <div className="subTitle">
                    <div className="time-container">
                        <div className="time-box">
                            <span>₿ {t("through")} {timeLeft}</span>
                        </div>
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

                {/* Кнопка "Play" внутри, но не вызывает открытие ContentModal */}
                <div className="button-container">
                    <Button
                        variant="contained"
                        className="play-button"
                        onClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие клика
                            handlePlayClick(); // Открываем сообщение
                        }}
                    >
                        {t("play")} | ${participation_price_usd}
                    </Button>
                </div>
            </ContentModal>

            {/* Окно предупреждения */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{t("purchase_confirmation")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {showCloseButton ? (
                        <Button onClick={() => setOpenDialog(false)} color="secondary">{t("close")}</Button>
                    ) : (
                        <>
                            <Button onClick={confirmPlay} color="primary">{t("yes")}</Button>
                            <Button onClick={() => setOpenDialog(false)} color="secondary">{t("no")}</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

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
