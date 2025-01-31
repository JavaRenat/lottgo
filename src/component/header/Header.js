import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./header.scss";

export default function Header() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const [bitcoinPrice, setBitcoinPrice] = useState("00000.00");

    useEffect(() => {
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.p).toFixed(2); // Точность до 2 знаков после запятой
            setBitcoinPrice(price);
        };

        return () => ws.close(); // Закрываем WebSocket при размонтировании
    }, []);

    // Разделяем цену на 4 цветные цифры перед запятой и 2 цветные после
    const [integerPart, decimalPart] = bitcoinPrice.split(".");

    // Берем последние 4 цифры перед запятой + 2 цифры после
    const highlightedDigits = integerPart.slice(-4) + "." + decimalPart;

    // Цвета для первых 4 цифр до запятой + 2 цифр после запятой
    const digitColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F4D03F", "#8E44AD"];



    return (
        <div className="header-container">
            <div onClick={() => window.scroll(0, 0)} className="header-logo">
                ₿ <span className="normal-text">{t("now")} </span>

                {/* Отображаем всю цену, но раскрашиваем только 6 последних цифр */}
                <span className="price-integer">{integerPart.slice(0, -4)}</span>
                {highlightedDigits.split("").map((digit, index) => (
                    <span
                        key={index}
                        style={{ color: digit === "." ? "white" : digitColors[index % digitColors.length] }}
                    >
                        {digit}
                    </span>
                ))}
            </div>
            {/* Выбор языка */}
            <div className="language-container">
                <select className="language-select" onChange={changeLanguage} value={i18n.language}>
                    <option value="en">🇬🇧</option>
                    <option value="ru">🇷🇺</option>
                </select>
            </div>
        </div>
    );
}
