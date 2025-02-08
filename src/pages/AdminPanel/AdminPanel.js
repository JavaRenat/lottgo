import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BackendConfig from "../../config/config";
import axios from "axios";
import "./adminPanel.scss";

export default function AdminPanel({ userData }) {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [newApplications, setNewApplications] = useState([]);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [editedApplication, setEditedApplication] = useState(null);
    const [fullScreenPhoto, setFullScreenPhoto] = useState(null);

    // Состояния для создания игры из новой заявки
    const [selectedNewApplication, setSelectedNewApplication] = useState(null);
    const [newAppForm, setNewAppForm] = useState({
        bitcoin_price_at: "",
        period: "week",
        participation_price_usd: ""
    });

    // Загрузка существующих заявок со статусом "created"
    useEffect(() => {
        async function fetchApplications() {
            let data = {};
            try {
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/models.json`);
                    data = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.modelEndpoint}?status=created&telegram_id=${userData.telegramId}`);
                    data = response.data;
                }
                setApplications(data.cards);
            } catch (error) {
                console.error("Ошибка загрузки заявок", error);
                setError(t("error_loading_applications"));
            }
        }
        fetchApplications();
    }, [t]);

    // Загрузка новых заявок со статусом "new"
    useEffect(() => {
        async function fetchNewApplications() {
            let data = {};
            try {
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/models_new.json`);
                    data = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.modelEndpoint}?status=new&telegram_id=${userData.telegramId}`);
                    data = response.data;
                }
                setNewApplications(data.cards);
            } catch (error) {
                console.error("Ошибка загрузки новых заявок", error);
            }
        }
        fetchNewApplications();
    }, [t]);

    const approveApplication = async (id) => {
        try {
            if (BackendConfig.useMockData) {
                console.log(`Mock approval for ID: ${id}`);
                setApplications((prev) => prev.filter((app) => app.id !== id));
            } else {
                const response = await axios.get(`${BackendConfig.approveModelEndpoint}?id=${id}&telegram_id=${userData.telegramId}`);
                if (response.status === 200) {
                    setApplications((prev) => prev.filter((app) => app.id !== id));
                } else {
                    setError(t("error_approving_application"));
                }
            }
        } catch (error) {
            console.error("Ошибка одобрения заявки", error);
            setError(t("error_approving_application"));
        }
    };

    const deleteApplication = async (id) => {
        try {
            if (BackendConfig.useMockData) {
                console.log(`Mock deletion for ID: ${id}`);
                setApplications((prev) => prev.filter((app) => app.id !== id));
            } else {
                const response = await axios.delete(`${BackendConfig.deleteModelEndpoint}?id=${id}&telegram_id=${userData.telegramId}`);
                if (response.status === 200) {
                    setApplications((prev) => prev.filter((app) => app.id !== id));
                } else {
                    setError(t("error_deleting_application"));
                }
            }
        } catch (error) {
            console.error("Ошибка удаления заявки", error);
            setError(t("error_deleting_application"));
        }
    };

    const handleEditClick = (app) => {
        setSelectedApplication(app);
        setEditedApplication({ ...app });
    };

    const handleSave = async () => {
        try {
            if (BackendConfig.useMockData) {
                console.log("Mock update for application", editedApplication);
                setApplications((prev) =>
                    prev.map((app) => (app.id === editedApplication.id ? editedApplication : app))
                );
            } else {
                const response = await axios.request({
                    url: BackendConfig.modelEndpoint,
                    method: "UPDATE",
                    data: editedApplication,
                });
                if (response.status === 200) {
                    setApplications((prev) =>
                        prev.map((app) => (app.id === editedApplication.id ? editedApplication : app))
                    );
                } else {
                    setError(t("error_updating_application"));
                }
            }
            setSelectedApplication(null);
            setEditedApplication(null);
        } catch (error) {
            console.error("Ошибка обновления данных", error);
            setError(t("error_updating_application"));
        }
    };

    // Обработка создания игры на основе новой заявки с обязательными полями для даты и цены
    const handleNewApplicationSubmit = async () => {
        // Проверка обязательного заполнения полей
        if (!newAppForm.bitcoin_price_at || !newAppForm.participation_price_usd) {
            setError(t("fill_all_required_fields"));
            return;
        }

        // Проверяем, что введённая дата bitcoin_price_at хотя бы на 1 час позже текущего времени
        const bitcoinDate = new Date(newAppForm.bitcoin_price_at);
        const now = new Date();
        if (bitcoinDate.getTime() < now.getTime() + 3600000) {
            setError(t("bitcoin_date_invalid"));
            return;
        }

        const newGame = {
            telegram_id: selectedNewApplication.telegramId,
            model_id: selectedNewApplication.id,
            title: selectedNewApplication.name,
            overview: selectedNewApplication.description,
            poster_path:
                selectedNewApplication.photos && selectedNewApplication.photos.length > 0
                    ? selectedNewApplication.photos[0]
                    : "",
            bitcoin_price_at: newAppForm.bitcoin_price_at,
            period: newAppForm.period,
            participation_price_usd: Number(newAppForm.participation_price_usd),
            status: "running",
        };

        try {
            if (BackendConfig.useMockData) {
                console.log("Mock create game submission:", newGame);
                // Удаляем заявку из списка после "отправки"
                setNewApplications((prev) =>
                    prev.filter((app) => app.id !== selectedNewApplication.id)
                );
            } else {
                const response = await axios.post(BackendConfig.createGameEndpoint, newGame);
                if (response.status === 200) {
                    setNewApplications((prev) =>
                        prev.filter((app) => app.id !== selectedNewApplication.id)
                    );
                } else {
                    setError(t("error_submitting_game"));
                }
            }
            setSelectedNewApplication(null);
            setNewAppForm({ bitcoin_price_at: "", period: "week", participation_price_usd: "" });
        } catch (error) {
            console.error("Ошибка при отправке игрового объекта:", error);
            setError(t("error_submitting_game"));
        }
    };

    return (
        <div className="admin-panel-container">
            <h2 className="admin-title">{t("admin_panel")}</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="admin-table">
                <thead>
                <tr>
                    <th>{t("name")}</th>
                    <th>{t("actions")}</th>
                </tr>
                </thead>
                <tbody>
                {applications.map((app) => (
                    <tr key={app.id}>
                        <td>{app.name}</td>
                        <td>
                            <button className="view-button" onClick={() => handleEditClick(app)}>
                                {t("view")}
                            </button>
                            <button className="approve-button" onClick={() => approveApplication(app.id)}>
                                {t("approve")}
                            </button>
                            <button className="delete-button" onClick={() => deleteApplication(app.id)}>
                                {t("delete")}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Секция для новых заявок */}
            <div className="new-applications-section">
                <h3>{t("new_applications")}</h3>
                {newApplications.length > 0 ? (
                    newApplications.map((app) => (
                        <button
                            key={app.id}
                            className="new-app-button"
                            onClick={() => setSelectedNewApplication(app)}
                        >
                            {app.name}
                        </button>
                    ))
                ) : (
                    <p>{t("no_new_applications")}</p>
                )}
            </div>

            {/* Модальное окно для редактирования существующей заявки */}
            {selectedApplication && editedApplication && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        setSelectedApplication(null);
                        setEditedApplication(null);
                    }}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{t("edit_application")}</h2>
                        <div className="form-group">
                            <label>{t("name")}:</label>
                            <input
                                type="text"
                                value={editedApplication.name || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("height")}:</label>
                            <input
                                type="number"
                                value={editedApplication.height || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, height: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("weight")}:</label>
                            <input
                                type="number"
                                value={editedApplication.weight || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, weight: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("city")}:</label>
                            <input
                                type="text"
                                value={editedApplication.city || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, city: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("bustSize")}:</label>
                            <input
                                type="text"
                                value={editedApplication.bustSize || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, bustSize: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("phoneNumber")}:</label>
                            <input
                                type="text"
                                value={editedApplication.phoneNumber || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, phoneNumber: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("description")}:</label>
                            <textarea
                                value={editedApplication.description || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="photo-gallery">
                            {editedApplication.photos &&
                                editedApplication.photos.map((photo, index) => {
                                    const photoSrc = `${process.env.PUBLIC_URL}/photos/${editedApplication.telegramId}_${editedApplication.id}/${photo}`;
                                    return (
                                        <img
                                            key={index}
                                            src={photoSrc}
                                            alt={photo}
                                            className="modal-photo"
                                            onClick={() => setFullScreenPhoto(photoSrc)}
                                        />
                                    );
                                })}
                        </div>
                        <div className="modal-buttons">
                            <button className="save-button" onClick={handleSave}>
                                {t("save")}
                            </button>
                            <button
                                className="close-button"
                                onClick={() => {
                                    setSelectedApplication(null);
                                    setEditedApplication(null);
                                }}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для создания игры из новой заявки */}
            {selectedNewApplication && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        setSelectedNewApplication(null);
                        setNewAppForm({ bitcoin_price_at: "", period: "week", participation_price_usd: "" });
                        setError(""); // очищаем ошибку при закрытии
                    }}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{t("create_game")}</h2>
                        {/* Если есть ошибка, выводим её внутри модального окна */}
                        {error && <p className="modal-error">{error}</p>}
                        <p>{selectedNewApplication.name}</p>
                        <div className="form-group">
                            <label>{t("participation_price_usd")}:</label>
                            <input
                                type="number"
                                value={newAppForm.participation_price_usd}
                                onChange={(e) =>
                                    setNewAppForm({ ...newAppForm, participation_price_usd: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("bitcoin_price_at")}:</label>
                            {/* Добавлен атрибут step="1" для ввода секунд */}
                            <input
                                type="datetime-local"
                                step="1"
                                value={newAppForm.bitcoin_price_at}
                                onChange={(e) =>
                                    setNewAppForm({ ...newAppForm, bitcoin_price_at: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("period")}:</label>
                            <select
                                value={newAppForm.period}
                                onChange={(e) =>
                                    setNewAppForm({ ...newAppForm, period: e.target.value })
                                }
                            >
                                <option value="week">{t("week")}</option>
                                <option value="month">{t("month")}</option>
                                <option value="hour">{t("hour")}</option>
                                <option value="day">{t("day")}</option>
                            </select>
                        </div>
                        <div className="modal-buttons">
                            <button className="save-button" onClick={handleNewApplicationSubmit}>
                                {t("create_game")}
                            </button>
                            <button
                                className="close-button"
                                onClick={() => {
                                    setSelectedNewApplication(null);
                                    setNewAppForm({ bitcoin_price_at: "", period: "week", participation_price_usd: "" });
                                    setError(""); // очищаем ошибку при закрытии
                                }}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для полноэкранного просмотра фото */}
            {fullScreenPhoto && (
                <div
                    className="fullscreen-photo-overlay"
                    onClick={() => setFullScreenPhoto(null)}
                >
                    <div className="fullscreen-photo-container" onClick={(e) => e.stopPropagation()}>
                        <img src={fullScreenPhoto} alt="Full Screen" className="fullscreen-photo" />
                        <button className="close-fullscreen-button" onClick={() => setFullScreenPhoto(null)}>
                            {t("close")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
