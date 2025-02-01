import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import "./header.scss";

export default function Header({userData}) {
    const {i18n, t} = useTranslation();

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const [bitcoinPrice, setBitcoinPrice] = useState("00000.00");
    const [showWinInfo, setShowWinInfo] = useState(false);

    useEffect(() => {
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.p).toFixed(2);
            setBitcoinPrice(price);
        };
        return () => ws.close();
    }, []);

    const [integerPart, decimalPart] = bitcoinPrice.split(".");
    const highlightedDigits = integerPart.slice(-4) + "." + decimalPart;
    const digitColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F4D03F", "#8E44AD"];

    const toggleWinInfo = () => {
        setShowWinInfo(!showWinInfo);
    };

    return (
        <div className="header-container">
            {/* Левая группа: курс биткоина и кнопка "?" */}
            <div className="header-left">
                <div onClick={() => window.scroll(0, 0)} className="header-logo">
                    ₿ <span className="normal-text">{t("now")}</span>{" "}
                    <span className="price-integer">
            {integerPart.slice(0, -4)}
                        {highlightedDigits.split("").map((digit, index) => (
                            <span
                                key={index}
                                style={{
                                    color: digit === "." ? "white" : digitColors[index % digitColors.length],
                                }}
                            >
                {digit}
              </span>
                        ))}
          </span>
                </div>
                <button className="win-info-btn" onClick={toggleWinInfo}>
                    ?
                </button>
            </div>

            {/* Правая группа: баланс и выбор языка */}
            <div className="header-right">
                <div className="balance-container">
                    <span className="balance-label">{t("Balance")}:</span>
                    <span className="balance-amount">
            {userData?.balance !== undefined ? userData.balance.toFixed(2) : "0.00"}
          </span>
                    <button className="top-up-btn">+</button>
                </div>
                <div className="language-container">
                    <select className="language-select" onChange={changeLanguage} value={i18n.language}>
                        <option value="en">🇬🇧</option>
                        <option value="ru">🇷🇺</option>
                    </select>
                </div>
            </div>

            {/* Модальное окно для информации о выигрыше */}
            {showWinInfo && (
                <div className="modal-overlay" onClick={toggleWinInfo}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{t("Win Info")}</h3>
                        {t("Win Explanation", {returnObjects: true}).map((paragraph, index) => (
                            <p key={index}>
                                {paragraph.split("\n").map((line, lineIndex) => (
                                    <span key={lineIndex}>
                                        {line}
                                        <br/>
                                    </span>
                                ))}
                            </p>
                        ))}
                        <button onClick={toggleWinInfo}>{t("Close")}</button>
                    </div>
                </div>
            )}

        </div>
    );
}
