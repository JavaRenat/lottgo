import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BackendConfig from "../../config/config";
import axios from "axios";
import "./makeModel.scss";

export default function MakeModel({ userData, setUserData }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        height: "",
        weight: "",
        bustSize: "",
        phoneNumber: "",
        selectedServices: [],
        photos: []
    });
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchServices() {
            let servicesData = {};
            try {
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/services.json`);
                    servicesData = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.servicesEndpoint}`);
                    servicesData = response.data;
                }
            } catch (error) {
                console.error("Ошибка загрузки услуг", error);
            }
            setServices(Object.values(servicesData));
        }
        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (service) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(service)
                ? prev.selectedServices.filter(s => s !== service)
                : [...prev.selectedServices, service]
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...Array.from(e.target.files)] }));
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (userData.has_card >= userData.card_limit) {
            setError(t("card_limit_reached"));
            return;
        }

        if (!formData.name || !formData.height || !formData.weight || !formData.bustSize || !formData.phoneNumber || formData.selectedServices.length === 0 || formData.photos.length === 0) {
            setError(t("fill_all_fields"));
            return;
        }

        const requestData = {
            telegramId: userData.telegramId,
            ...formData
        };

        try {
            if (BackendConfig.useMockData) {
                console.log("Mock submission: ", requestData);
                setUserData(prev => ({ ...prev, has_card: prev.has_card + 1 }));
            } else {
                const response = await axios.post(`${BackendConfig.modelEndpoint}`, requestData);
                if (response.data.success) {
                    setUserData(prev => ({ ...prev, has_card: prev.has_card + 1 }));
                } else {
                    setError(t("submission_failed"));
                }
            }
        } catch (error) {
            setError(t("submission_failed"));
        }
    };

    return (
        <div className="make-model-container">
            <h2 className="make-model-title">{t("promotion_message")}</h2>
            <div className="make-model-block">
                <label>{t("name")} *</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("height")} *</label>
                <input name="height" type="number" value={formData.height} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("weight")} *</label>
                <input name="weight" type="number" value={formData.weight} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("bust_size")} *</label>
                <select name="bustSize" value={formData.bustSize} onChange={handleChange} required>
                    {["A", "B", "C", "D", "E"].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <div className="make-model-block">
                <label>{t("phone_number")} *</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("choose_services")} *</label>
                <div className="make-model-checkbox-group">
                    {services.map(service => (
                        <label key={service} className="make-model-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.selectedServices.includes(service)}
                                onChange={() => handleServiceChange(service)}
                            />
                            {t(service)}
                        </label>
                    ))}
                </div>
            </div>
            <div className="make-model-block">
                <label>{t("upload_photos")} *</label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} required />
                {formData.photos.length > 0 && (
                    <div className="photo-preview">
                        {formData.photos.map((photo, index) => (
                            <div key={index} className="photo-wrapper">
                                <img src={URL.createObjectURL(photo)} alt={`preview-${index}`} className="photo-thumbnail" />
                                <button className="remove-photo" onClick={() => removePhoto(index)}>✖</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="make-model-button" onClick={handleSubmit}>{t("submit")}</button>
        </div>
    );
}
