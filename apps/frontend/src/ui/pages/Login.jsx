import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import Card from '../components/ui/Card';
import '../styles/pages/Login.css'
import { motion } from 'framer-motion'

const Login = () => {
    return(
                    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
        <>
        <div className='main-container' style={{ display: 'grid', placeItems: 'center', minHeight: '80vh', padding: '24px' }}>
          <Card title="Inloggen" subtitle="Meld je aan om verder te gaan">
            <div style={{ display: 'grid', gap: '12px' }}>
              <img className="login-logo" src='logo.png' alt='UMC Utrecht logo' style={{ width: 120, margin: '0 auto 8px' }} />
              <LoginForm/>
            </div>
          </Card>
        </div>
        </>
        </motion.div>
    )
}

export default Login;
