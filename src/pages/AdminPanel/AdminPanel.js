import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BackendConfig from "../../config/config";
import axios from "axios";
import "./adminPanel.scss";

// Пример установки эндпоинта для обновления
// BackendConfig.modelEndpoint = `${BackendConfig.backEndApi}/${BackendConfig.apiVersion}/model`;

export default function AdminPanel({ userData }) {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [editedApplication, setEditedApplication] = useState(null);
    const [fullScreenPhoto, setFullScreenPhoto] = useState(null);

    useEffect(() => {
        async function fetchApplications() {
            let data = {};
            try {
                if (BackendConfig.useMockData) {
                    const response = await fetch(`${process.env.PUBLIC_URL}/mock/models.json`);
                    data = await response.json();
                } else {
                    const response = await axios.get(`${BackendConfig.modelEndpoint}?status=created`);
                    data = response.data;
                }
                setApplications(data.cards);
            } catch (error) {
                console.error("Ошибка загрузки заявок", error);
                setError(t("error_loading_applications"));
            }
        }
        fetchApplications();
    }, []);

    const approveApplication = async (id) => {
        try {
            if (BackendConfig.useMockData) {
                console.log(`Mock approval for ID: ${id}`);
                setApplications((prev) => prev.filter((app) => app.id !== id));
            } else {
                const response = await axios.get(`${BackendConfig.modelEndpoint}?id=${id}&status=approved`);
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
                const response = await axios.delete(`${BackendConfig.modelEndpoint}?id=${id}`);
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

    // При клике на "Посмотреть" запоминаем выбранную заявку и создаём копию для редактирования
    const handleEditClick = (app) => {
        setSelectedApplication(app);
        setEditedApplication({ ...app });
    };

    // Функция сохранения изменений через метод UPDATE
    const handleSave = async () => {
        try {
            if (BackendConfig.useMockData) {
                console.log("Mock update for application", editedApplication);
                // Обновляем локально
                setApplications((prev) =>
                    prev.map((app) => (app.id === editedApplication.id ? editedApplication : app))
                );
            } else {
                const response = await axios.request({
                    url: BackendConfig.modelEndpoint,
                    method: "UPDATE", // Используем метод UPDATE
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
            // Закрываем окно редактирования после успешного сохранения
            setSelectedApplication(null);
            setEditedApplication(null);
        } catch (error) {
            console.error("Ошибка обновления данных", error);
            setError(t("error_updating_application"));
        }
    };

    return (
        <div className="admin-panel-container" style={{ background: "#f4f4f4" }}>
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

            {/* Модальное окно для просмотра и редактирования заявки */}
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
                            <label>{t("height")} (cm):</label>
                            <input
                                type="number"
                                value={editedApplication.height || ""}
                                onChange={(e) =>
                                    setEditedApplication({ ...editedApplication, height: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("weight")} (kg):</label>
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
