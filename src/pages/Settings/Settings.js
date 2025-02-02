import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import BackendConfig from "../../config/config"; // Убедись, что путь правильный
import "./settings.scss"; // <-- Подключаем SCSS

export default function Settings({ userData }) {
    const { t } = useTranslation();
    const [cities, setCities] = useState({});
    const [services, setServices] = useState({});
    const [settings, setSettings] = useState(null);
    const [selectedCity, setSelectedCity] = useState("");
    const [ageRange, setAgeRange] = useState("any");
    const [drawTime, setDrawTime] = useState("all");
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let citiesData, servicesData, settingsData;

                if (BackendConfig.useMockData) {
                    const citiesResponse = await fetch(`${process.env.PUBLIC_URL}/mock/cities.json`);
                    citiesData = await citiesResponse.json();

                    const servicesResponse = await fetch(`${process.env.PUBLIC_URL}/mock/services.json`);
                    servicesData = await servicesResponse.json();
                } else {
                    const citiesResponse = await axios.get(`${BackendConfig.citiesEndpoint}`);
                    citiesData = citiesResponse.data;

                    const servicesResponse = await axios.get(`${BackendConfig.servicesEndpoint}`);
                    servicesData = servicesResponse.data;
                }

                setCities(citiesData);
                setServices(servicesData);

                if (!userData || !userData.telegramId) return;

                if (BackendConfig.useMockData) {
                    const settingsResponse = await fetch(`${process.env.PUBLIC_URL}/mock/settings.json`);
                    settingsData = await settingsResponse.json();
                } else {
                    const settingsResponse = await axios.get(`${BackendConfig.settingsEndpoint}?id=${userData.telegramId}`);
                    settingsData = settingsResponse.data;
                }

                setSettings(settingsData);
                setSelectedCity(settingsData.city || "");
                setAgeRange(settingsData.ageRange || "any");
                setDrawTime(settingsData.drawTime || "all");
                setSelectedServices(settingsData.services || []);

            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchData();
    }, [userData]);

    const handleServiceChange = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
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

    if (!settings || !cities || !services) return <p className="text-center text-gray-500">{t("Loading settings...")}</p>;

    return (
        <div className="settings-container">
            <h2 className="settings-title">{t("Settings")}</h2>

            <div className="settings-block">
                <label>{t("City")}</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="">{t("Select a city")}</option>
                    {Object.entries(cities).map(([id, cityKey]) => (
                        <option key={id} value={id}>{t(cityKey)}</option>
                    ))}
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
                    {Object.entries(services).map(([id, serviceKey]) => (
                        <label key={id} className="settings-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedServices.includes(parseInt(id))}
                                onChange={() => handleServiceChange(parseInt(id))}
                            />
                            {t(serviceKey)}
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
