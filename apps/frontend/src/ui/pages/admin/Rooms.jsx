import React, { useEffect, useState } from 'react';
import '../../styles/pages/admin/Rooms.css'
import { useNavigate } from 'react-router-dom';
import BackBtn from '../../components/buttons/BackBtn';
import { handleGetRooms } from '../../../business/controller/RoomController';
import SelectedRoom from '../../components/rooms/admin/SelectedRoom';
import Select from 'react-select';
import { motion } from 'framer-motion'
import { useNotification } from '../../../context/NotificationContext';
import MessageAlert from '../../components/messages/MessageAlert';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';


const Rooms = () => {
const [rooms, setRooms] = useState([]);
const [selectedRoom, setSelectedRoom] = useState(null);
    const navigate = useNavigate();
        const {notification} = useNotification();

    useEffect(() => {
        const getAllRooms = async () => {
            const allRooms = await handleGetRooms();
            
            setRooms(allRooms.data);
        }
        getAllRooms();

    }
    
    , []);

    const roomOptions = rooms.map(room => ({
        value: room.id,
        label: room.name,
        data: room
    }));

    function handleToNieuwRoom(){
        navigate('/admin/rooms/nieuw-room')
    }


      const handleRoomDeleted = (deletedRoomId) => {
    setRooms(prev => prev.filter(r => r.id !== deletedRoomId));
    setSelectedRoom(null); // deselecteer de kamer zodat SelectedRoom verdwijnt
  }

    return(
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
        <>
        <Container>
          <BackBtn/>
          <PageHeader
            title="Rooms"
            subtitle="Beheer en zoek rooms"
            actions={<Button onClick={handleToNieuwRoom}>Nieuwe room</Button>}
          />
          <Card title="Zoeken">
            <div style={{ display: 'grid', gap: 12 }}>
              <Select
                options={roomOptions}
                value={selectedRoom ? roomOptions.find(opt => opt.value === selectedRoom.id) : null}
                onChange={(selectedOption) => setSelectedRoom(selectedOption.data)}
                placeholder="Zoek een room..."
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </Card>
          <div style={{ marginTop: 16 }}>
            {selectedRoom ? (
              <SelectedRoom room={selectedRoom} onRoomDeleted={handleRoomDeleted} />
            ) : (
              <EmptyState description="Kies een room in de zoeklijst of maak een nieuwe room aan." />
            )}
          </div>
        </Container>
          {notification && (
            <MessageAlert message={notification.message} type={notification.type} />
          )}
        </>
                </motion.div>

    )
}

export default Rooms;
