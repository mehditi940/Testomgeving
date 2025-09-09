import React, { useEffect, useState } from 'react';
import '../../styles/pages/admin/Rooms.css'
import { useNavigate } from 'react-router-dom';
import BackBtn from '../../components/buttons/BackBtn';
import Select from 'react-select';
import { motion } from 'framer-motion'
import { useNotification } from '../../../context/NotificationContext';
import MessageAlert from '../../components/messages/MessageAlert';
import { handleGetPatients } from '../../../business/controller/PatientController';
import SelectedPatient from '../../components/patients/admin/SelectedPatient';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const Patients = () => {
  const { notification } = useNotification();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPatients = async () => {
      const allPatients = await handleGetPatients();
      setPatients(allPatients.data);
    };
    getAllPatients();
  }, []);

  const roomOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.nummer,
    data: patient,
  }));

  function handleCreatePatient() {
    navigate('/admin/patients/nieuw-patient');
  }

  const handlePatientDeleted = (deletedPatientId) => {
    setPatients((prev) => prev.filter((r) => r.id !== deletedPatientId));
    setSelectedPatient(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <>
        <Container>
          <BackBtn />
          <PageHeader
            title="Patiënten"
            subtitle="Zoek en beheer patiënten"
            actions={<Button onClick={handleCreatePatient}>Nieuwe patiënt</Button>}
          />
          <Card title="Zoeken">
            <Select
              options={roomOptions}
              value={selectedPatient ? roomOptions.find((opt) => opt.value === selectedPatient.id) : null}
              onChange={(selectedOption) => setSelectedPatient(selectedOption.data)}
              placeholder="Zoek een patiënt..."
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </Card>
          <div style={{ marginTop: 16 }}>
            {selectedPatient ? (
              <SelectedPatient patient={selectedPatient} onPatientDelete={handlePatientDeleted} />
            ) : (
              <EmptyState description="Kies een patiënt in de zoeklijst of voeg een nieuwe toe." />
            )}
          </div>
        </Container>
        {notification && (
          <MessageAlert message={notification.message} type={notification.type} />
        )}
      </>
    </motion.div>
  );
};

export default Patients;

