import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';

const safeReturnPath = (value: string | null): string | null => {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/login')) {
    return null;
  }
  return value;
};

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = safeReturnPath(new URLSearchParams(location.search).get('returnTo'));

  return (
    <LoginModal
      isOpen
      onClose={() => navigate(returnTo ?? '/', { replace: true })}
      onLoginSuccess={() => navigate('/dashboard', { replace: true })}
    />
  );
};

export default LoginPage;
