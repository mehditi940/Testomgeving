import React, { useState } from "react";
import { handleCreateRoom } from "../../../business/controller/RoomController";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/components/forms/NewRoomForm.css";
import SurgeonSelect from "./newRooms/SurgeonSelect";
import PatientSelect from "./newRooms/PatientSelect";
import ModelUpload from "./newRooms/ModelUpload";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";

const NewRoomForm = () => {
  const [roomName, setRoomName] = useState("");
  const [models, setModels] = useState([{ id: Date.now(), file: null }]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedSurgeons, setSelectedSurgeons] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [roomType, setRoomType] = useState("patient");
  const [showConfirm, setShowConfirm] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    const files = models.map((m) => m.file).filter(Boolean);
    try {
      const response = await handleCreateRoom(
        roomName,
        files,
        selectedPatient,
        selectedSurgeons,
        roomType
      );

      if (!response.success) {
        showNotification(response.message || "Aanmaken kamer mislukt", "error");
        return;
      }

      showNotification(`Room: ${roomName} is aangemaakt`, "success");
      navigate("/admin/rooms");
    } catch (error) {
      showNotification("Er is iets misgegaan: " + error.message, "error");
    } finally {
      setShowConfirm(false);
    }
  };

  const cancelSubmit = () => setShowConfirm(false);

  return (
    <div className="new-room-container">
      <form className="new-room-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Roomnaam</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>

        <SurgeonSelect
          selectedSurgeon={selectedSurgeons}
          setSelectedSurgeon={setSelectedSurgeons}
        />
        <PatientSelect
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />

        <div className="form-group">
          <label>Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <option value="patient">Patiënt</option>
            <option value="surgeon">Chirurg</option>
            <option value="demo">Demo</option>
          </select>
        </div>

        <ModelUpload models={models} setModels={setModels} />

        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.type}`}>
            {uploadStatus.message}
          </div>
        )}

        <button type="submit" className="room-btn">
          Toevoegen
        </button>
      </form>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Weet je zeker dat je deze kamer wilt aanmaken?</h3>
            <div className="modal-actions">
              <button onClick={confirmSubmit} className="confirm-button">
                Bevestigen
              </button>
              <button onClick={cancelSubmit} className="cancel-button">
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRoomForm;

