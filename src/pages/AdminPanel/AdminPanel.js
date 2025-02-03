import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BackendConfig from "../../config/config";
import axios from "axios";
import "./adminPanel.scss";

export default function AdminPanel({ userData }) {
    const { t } = useTranslation();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

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
                setApplications(prev => prev.filter(app => app.id !== id));
            } else {
                const response = await axios.get(`${BackendConfig.modelEndpoint}?id=${id}&status=approved`);
                if (response.status === 200) {
                    setApplications(prev => prev.filter(app => app.id !== id));
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
                setApplications(prev => prev.filter(app => app.id !== id));
            } else {
                const response = await axios.delete(`${BackendConfig.modelEndpoint}?id=${id}`);
                if (response.status === 200) {
                    setApplications(prev => prev.filter(app => app.id !== id));
                } else {
                    setError(t("error_deleting_application"));
                }
            }
        } catch (error) {
            console.error("Ошибка удаления заявки", error);
            setError(t("error_deleting_application"));
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
                            <button className="view-button" onClick={() => setSelectedApplication(app)}>{t("view")}</button>
                            <button className="approve-button" onClick={() => approveApplication(app.id)}>{t("approve")}</button>
                            <button className="delete-button" onClick={() => deleteApplication(app.id)}>{t("delete")}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
                        <h2>{selectedApplication.name}</h2>
                        <p><strong>{t("height")}:</strong> {selectedApplication.height} cm</p>
                        <p><strong>{t("weight")}:</strong> {selectedApplication.weight} kg</p>
                        <p><strong>{t("city")}:</strong> {selectedApplication.city}</p>
                        <p><strong>{t("bustSize")}:</strong> {selectedApplication.bustSize}</p>
                        <p><strong>{t("phoneNumber")}:</strong> {selectedApplication.phoneNumber}</p>
                        <p><strong>{t("description")}:</strong> {selectedApplication.description}</p>
                        <p><strong>{t("created_at")}:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</p>
                        <div className="photo-gallery">
                            {selectedApplication.photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={`${process.env.PUBLIC_URL}/photos/${selectedApplication.telegramId}_${selectedApplication.id}/${photo}`}
                                    alt={photo}
                                    className="modal-photo"
                                />
                            ))}
                        </div>
                        <button className="close-button" onClick={() => setSelectedApplication(null)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}
