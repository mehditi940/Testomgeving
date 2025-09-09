import React, { useEffect, useState, Suspense } from 'react';
import '../../styles/pages/admin/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import LogoutBtn from '../../components/buttons/LogoutBtn';
import BackBtn from '../../components/buttons/BackBtn';
import { useNotification } from '../../../context/NotificationContext';
import MessageAlert from '../../components/messages/MessageAlert';
import ErrorBoundary from '../../components/errors/ErrorBoundary';
import { motion } from 'framer-motion';
import ModelViewer from '../../components/model/ModelFrame';
import LoadingSpinner from '../../components/LoadingSpinner';
import dummyAPI from '../../../service/apiHandler';

async function downloadFileAsBlobURL(url, headers) {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`);
  }
  const blob = await response.blob();
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

const Dashboard = () => {
  const { notification } = useNotification();
  const navigate = useNavigate();
  const [localUrl, setLocalUrl] = useState(null);
  const [partSettings, setPartSettings] = useState({});
  const [fileExt, setFileExt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let revoke;
    const fetchLatestModel = async () => {
      try {
        const rooms = await dummyAPI.room.get_rooms();
        if (!rooms || rooms.length === 0) return;

        const allModels = rooms
          .flatMap((r) => r.models || [])
          .filter((m) => m && m.path);

        if (allModels.length === 0) return;

        const sortByCreated = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        const skulls = allModels
          .filter((m) => (m.name && m.name.toLowerCase().includes('skull')) || (m.path && m.path.toLowerCase().includes('skull')))
          .sort(sortByCreated);
        const latest3ds = allModels.filter((m) => m.path.toLowerCase().endsWith('.3ds')).sort(sortByCreated);
        const latestAny = allModels.sort(sortByCreated);
        const chosen = skulls[0] || latest3ds[0] || latestAny[0];

        if (!chosen) return;

        const token = localStorage.getItem('authToken');
        const fileUrl = `${import.meta.env.VITE_API_URL}/static/${chosen.path}`;
        const ext = (chosen.path.split('.').pop() || '').toLowerCase();
        const url = await downloadFileAsBlobURL(fileUrl, { Authorization: `Bearer ${token}` });
        setLocalUrl(url);
        setFileExt(ext);
        revoke = url;
      } catch (e) {
        console.error('Failed to load latest model for dashboard', e);
      }
    };

    fetchLatestModel();
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    if (isFullscreen) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  function handleToRooms() {
    navigate('/admin/rooms');
  }

  function handleToNieuwPatient() {
    navigate('/admin/patients');
  }

  function handleToNieuwAccount() {
    navigate('/admin/users');
  }

  function handleToWachtwoordVeranderen() {
    navigate('/admin/nieuw-wachtwoord');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <>
        <div className='admin-dashboard__screen'>
          <BackBtn />
          {notification && (
            <div className='admin-dashboard__notice'>
              <MessageAlert message={notification.message} type={notification.type} />
            </div>
          )}

          <div className='admin-dashboard__topbar'>
            <div className='admin-dashboard__brand'>AR MEDICAL VIEWER</div>
            <div className='admin-dashboard__top-controls'>
              <div className='pill'>
                <span className='pill__icon'>HL</span>
                <span>Hololens 2</span>
              </div>
              <div className='pill'>
                <span className='pill__icon'>TB</span>
                <span>Tablet</span>
              </div>
              <div className='pill pill--user'>
                <span className='avatar'>A</span>
                <span>Patient A</span>
              </div>
            </div>
          </div>

          <div
            className='admin-dashboard__mode pill'
            role='button'
            tabIndex={0}
            onClick={() => setIsFullscreen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsFullscreen(true);
            }}
            title='Bekijk 3D-model fullscreen'
          >
            <span className='pill__icon'>MD</span>
            <span>3D Model</span>
          </div>

          <div className='admin-dashboard__model-area'>
            <ErrorBoundary>
              {localUrl ? (
                <Suspense fallback={<LoadingSpinner />}>
                <ModelViewer
                  modelPath={localUrl}
                  fileExt={fileExt}
                  partSettings={partSettings}
                  onPartsLoaded={(newParts) => {
                    const settingsMap = newParts.reduce((acc, part) => {
                      acc[part.name] = { visible: true, opacity: 1.0 };
                      return acc;
                    }, {});
                    setPartSettings(settingsMap);
                  }}
                  drawMode={'mouse'}
                  isLocked={false}
                />
                </Suspense>
              ) : (
                <div className='model-placeholder' aria-label='3D model placeholder'>
                  <LoadingSpinner />
                </div>
              )}
            </ErrorBoundary>
          </div>

          {isFullscreen && (
            <div className='model-fullscreen-overlay'>
              <button
                className='model-fullscreen-close'
                onClick={() => setIsFullscreen(false)}
                aria-label='Sluit fullscreen weergave'
              >
                X
              </button>
              <ErrorBoundary>
                {localUrl ? (
                  <Suspense fallback={<LoadingSpinner />}>
                    <div className='model-fullscreen-content'>
                      <ModelViewer
                        modelPath={localUrl}
                        fileExt={fileExt}
                        partSettings={partSettings}
                        onPartsLoaded={(newParts) => {
                          const settingsMap = newParts.reduce((acc, part) => {
                            acc[part.name] = { visible: true, opacity: 1.0 };
                            return acc;
                          }, {});
                          setPartSettings(settingsMap);
                        }}
                        drawMode={'mouse'}
                        isLocked={false}
                        canvasStyle={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </Suspense>
                ) : (
                  <LoadingSpinner />
                )}
              </ErrorBoundary>
            </div>
          )}

          <aside className='admin-dashboard__session'>
            <div className='session__title'>SESSION OPTIONS</div>
            <ul className='session__list'>
              <li className='session__item'>START SESSION</li>
              <li className='session__item'>INVITE USER</li>
              <li className='session__item'>SYNC VIEW</li>
            </ul>
          </aside>

          <div className='admin-dashboard__tiles'>
            <div className='tile tile--primary'>
              <div className='tile__title'>PRE-SURGICAL PLANNING</div>
              <button className='rooms-pill' onClick={handleToRooms}>Rooms</button>
            </div>
            <div className='tile' onClick={handleToNieuwPatient} role='button' tabIndex={0}>
              <div className='tile__title'>PATIENTS</div>
              <div className='tile__subtitle'>Users</div>
            </div>
            <div className='tile' role='button' tabIndex={0} onClick={handleToNieuwAccount}>
              <div className='tile__title'>CONSULTATION</div>
            </div>
            <div className='tile'>
              <div className='tile__title'>PEDIATRIC SIMULATION</div>
            </div>
          </div>

          <LogoutBtn />
        </div>
      </>
    </motion.div>
  );
};

export default Dashboard;
