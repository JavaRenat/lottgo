import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BackendConfig from "../../config/config";
import axios from "axios";
import "./makeModel.scss";

export default function MakeModel({ userData, setUserData }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        age: "", // Добавлено поле возраста
        height: "",
        weight: "",
        city: "",
        bustSize: "A",
        phoneNumber: "",
        description: "",
        selectedServices: [],
        photos: []
    });
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            setServices(servicesData);
        }
        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            if (!/^\+\d*$/.test(value)) {
                return;
            }
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleServiceChange = (serviceId) => {
        setFormData((prev) => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(serviceId)
                ? prev.selectedServices.filter((id) => id !== serviceId)
                : [...prev.selectedServices, serviceId]
        }));
        setError("");
        setSuccess("");
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...Array.from(e.target.files)] }));
        setError("");
        setSuccess("");
    };

    const removePhoto = (index) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        // Проверяем лимит карточек через запрос или мок-данные
        try {
            let limitReached = false;

            if (BackendConfig.useMockData) {
                const response = await fetch(`${process.env.PUBLIC_URL}/mock/modelLimit.json`);
                const data = await response.json();
                limitReached = data.limitReached;
            } else {
                const response = await axios.post(`${BackendConfig.checkModelLimitEndpoint}`, {
                    telegramId: userData.telegramId
                });
                limitReached = response.data.limitReached;
            }

            if (limitReached) {
                setError(t("card_limit_reached"));
                return;
            }
        } catch (error) {
            setError(t("submission_failed"));
            return;
        }

        if (formData.photos.length < 3) {
            setError(t("upload_photos"));
            return;
        }

        if (formData.selectedServices.length === 0) {
            setError(t("what_to_raffle"));
            return;
        }

        // Проверяем обязательные поля
        if (
            !formData.name ||
            !formData.age || // Проверка заполненности возраста
            !formData.height ||
            !formData.weight ||
            !formData.bustSize ||
            !formData.phoneNumber ||
            !formData.city
        ) {
            setError(t("fill_all_fields_min_photos"));
            return;
        }

        // Создаем объект FormData для передачи файлов вместе с другими данными
        const formDataToSend = new FormData();
        formDataToSend.append("telegramId", userData.telegramId);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("age", formData.age); // Добавляем возраст
        formDataToSend.append("height", formData.height);
        formDataToSend.append("weight", formData.weight);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("bustSize", formData.bustSize);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("description", formData.description);

        // Если услуг несколько – добавляем каждую как отдельное значение
        formData.selectedServices.forEach((serviceId) => {
            formDataToSend.append("selectedServices", serviceId);
        });

        // Добавляем фотографии
        formData.photos.forEach((file) => {
            formDataToSend.append("photos", file);
        });

        try {
            if (BackendConfig.useMockData) {
                console.log("Mock submission: ", formDataToSend, `${BackendConfig.modelEndpoint}`);
                setUserData((prev) => ({ ...prev, has_model: prev.has_model + 1 }));
                setSuccess(t("submission_success"));
            } else {
                const response = await axios.post(`${BackendConfig.modelEndpoint}`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.data.success) {
                    setUserData((prev) => ({ ...prev, has_model: prev.has_model + 1 }));
                    setSuccess(t("submission_success"));
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
            {/* Добавлено поле для ввода возраста */}
            <div className="make-model-block">
                <label>{t("age")} *</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} required />
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
                <select name="bustSize" value={formData.bustSize} onChange={handleChange} required defaultValue="A">
                    {["A", "B", "C", "D", "E"].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
            <div className="make-model-block">
                <label>{t("phone_number")} *</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("city")} *</label>
                <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="make-model-block">
                <label>{t("description")}</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="make-model-block">
                <label>{t("choose_services")} *</label>
                <div className="make-model-checkbox-group">
                    {Object.entries(services).map(([id, service]) => (
                        <label key={id} className="make-model-checkbox">
                            <input
                                type="checkbox"
                                checked={formData.selectedServices.includes(id)}
                                onChange={() => handleServiceChange(id)}
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
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`preview-${index}`}
                                    className="photo-thumbnail"
                                />
                                <button className="remove-photo" onClick={() => removePhoto(index)}>
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button className="make-model-button" onClick={handleSubmit}>
                {t("submit")}
            </button>
        </div>
    );
}
