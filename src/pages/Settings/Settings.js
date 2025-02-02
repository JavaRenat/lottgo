import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import BackendConfig from "../../config/config"; // Убедись, что путь правильный
import "./settings.scss"; // <-- Подключаем SCSS

export default function Settings({ userData }) {
    const { t } = useTranslation();
    const [settings, setSettings] = useState(null);
    const [selectedCity, setSelectedCity] = useState("");
    const [ageRange, setAgeRange] = useState("any");
    const [drawTime, setDrawTime] = useState("all");
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        if (!userData || !userData.telegramId) return;

        const fetchSettings = async () => {
            try {
                let data;
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/settings.json`);
                    data = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.settingsEndpoint}?id=${userData.telegramId}`);
                    data = response.data;
                }

                setSettings(data);
                setSelectedCity(data.city || "");
                setAgeRange(data.ageRange || "any");
                setDrawTime(data.drawTime || "all");
                setSelectedServices(data.services || []);
            } catch (error) {
                console.error("Ошибка загрузки настроек:", error);
            }
        };

        fetchSettings();
    }, [userData]);

    const handleServiceChange = (service) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    };

    const saveSettings = async () => {
        try {
            await axios.post(`${BackendConfig.settingsEndpoint}`, {
                telegramId: userData.telegramId,
                city: selectedCity,
                ageRange,
                drawTime,
                services: selectedServices,
            });
            alert("Настройки сохранены!");
        } catch (error) {
            console.error("Ошибка сохранения настроек:", error);
        }
    };

    if (!settings) return <p className="text-center text-gray-500">{t("Loading settings...")}</p>;

    return (
        <div className="settings-container">
            <h2 className="settings-title">{t("Settings")}</h2>

            <div className="settings-block">
                <label>{t("City")}</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">{t("Select a city")}</option>
                    <option value="Москва">Москва</option>
                    <option value="Санкт-Петербург">Санкт-Петербург</option>
                    <option value="Казань">Казань</option>
                    <option value="Новосибирск">Новосибирск</option>
                    <option value="Екатеринбург">Екатеринбург</option>
                </select>
            </div>

            <div className="settings-block">
                <label>{t("Age Range")}</label>
                <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                    <option value="any">{t("Any Age")}</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46+">46+</option>
                </select>
            </div>

            <div className="settings-block">
                <label>{t("Draw Time")}</label>
                <select value={drawTime} onChange={(e) => setDrawTime(e.target.value)}>
                    <option value="all">{t("All Draws")}</option>
                    <option value="hours">{t("Next Few Hours")}</option>
                    <option value="days">{t("Next Few Days")}</option>
                    <option value="weeks">{t("Next Few Weeks")}</option>
                    <option value="months">{t("Next Few Months")}</option>
                </select>
            </div>

            <div className="settings-block">
                <label>{t("Services")}</label>
                <div className="settings-checkbox-group">
                    {["Свидание", "Встреча на 1 час", "Встреча на 1 день", "Ужин", "Прогулка"].map((service) => (
                        <label key={service} className="settings-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedServices.includes(service)}
                                onChange={() => handleServiceChange(service)}
                            />
                            {t(service)}
                        </label>
                    ))}
                </div>
            </div>

            <button className="settings-button" onClick={saveSettings}>
                {t("Save Settings")}
            </button>
        </div>
    );
}
