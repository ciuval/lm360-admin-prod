// src/pages/LoginPage.tsx

import React from 'react';
import { LoginForm } from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#121212',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

