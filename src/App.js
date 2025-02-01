import Header from "./component/header/Header";
import "./styles.scss";
import FootNav from "./component/FootNav";
import {Container} from "@material-ui/core";
import {Route, Routes} from "react-router-dom";
import CurrentGames from "./pages/CurrentGames/CurrentGames";
import History from "./pages/History/History";
import Series from "./pages/Series/Series";
import {useEffect, useState} from "react";
import i18n from "./i18n"; // Подключаем i18n
import axios from "axios";
import BackendConfig from "./config/config";


export default function App() {

    const [tgUser, setTgUser] = useState(null);
    const [location, setLocation] = useState({
        ip: "Определяется...",
        country: "Неизвестно",
        city: "Неизвестно",
        lat: 0.0,
        lon: 0.0,
    });
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log("React App загружен!");

        const fetchIpAddress = async () => {
            let tgData;
            if (BackendConfig.useMockData) {
                const tgResponse = await fetch(`${process.env.PUBLIC_URL}/mock/tgUser.json`);
                tgData = await tgResponse.json();
                console.log("Используются моковые данные для Telegram:", tgData);
            } else {
                if (window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp;
                    tg.ready();
                    tgData = tg.initDataUnsafe?.user || null;
                }
            }

            let response;
            setTgUser(tgData);

            if (BackendConfig.useMockData) {
                response = await fetch(`${process.env.PUBLIC_URL}/mock/ip.json`);
            } else {
                response = await axios.get(BackendConfig.getLocationEndpoint);
            }

            const data = await response.json();

            setLocation(prevState => {
                const newState = {
                    ip: data.ip,
                    country: data.country || "Неизвестно",
                    city: data.city || "Неизвестно",
                    lat: data.lat || 0.0,
                    lon: data.lon || 0.0,
                };
                console.log("ip: " + newState.ip);
                return newState;
            });
        }
        fetchIpAddress();
    }, []);

    useEffect(() => {
        if (!tgUser || location.ip === "Определяется...") return; // Проверка на корректные данные
        const sendUserData = async () => {
            try {
                let response;
                let data;

                if (BackendConfig.useMockData) {
                    response = await fetch(`${process.env.PUBLIC_URL}/mock/user.json`);
                    data = await response.json();
                    console.log("Используются моковые данные:", data);
                } else {
                    response = await axios.post(`${BackendConfig.userEndpoint}`, {
                        telegramId: tgUser.id,
                        firstName: tgUser.first_name,
                        lastName: tgUser.last_name || "",
                        username: tgUser.username || "",
                        language: tgUser.language_code || "unknown",
                        ip: location.ip,
                        country: location.country,
                        city: location.city,
                        lat: location.lat,
                        lon: location.lon
                    });
                    data = response.data;
                    console.log("Ответ от бэкенда:", data);
                }

                if (!data || !data.telegramId || typeof data.balance !== "number") {
                    throw new Error("Некорректный ответ от сервера!");
                }

                setUserData(data);
            } catch (error) {
                console.error("Ошибка отправки данных на сервер:", error);
            }
        };

        sendUserData();
    }, [tgUser, location]); // Запускать только когда загружены `tgUser` и `location`

    useEffect(() => {
        if (tgUser?.language_code) {
            const supportedLanguages = Object.keys(i18n.options.resources);
            const userLang = supportedLanguages.includes(tgUser.language_code)
                ? tgUser.language_code
                : "en";
            i18n.changeLanguage(userLang);
        }
    }, [tgUser]);

    return (
        <>
            <Header userData={userData}/>
            <div className="app">
                <Container>
                    <Routes>
                        <Route path="/" element={<CurrentGames/>}/>
                        <Route path="/history" element={<History/>}/>
                        <Route path="/settings" element={<Series/>}/>
                    </Routes>
                </Container>
            </div>
            <FootNav/>
        </>
    );
}
