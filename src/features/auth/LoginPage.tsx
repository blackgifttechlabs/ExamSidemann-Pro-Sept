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
  const params = new URLSearchParams(location.search);
  const returnTo = safeReturnPath(params.get('returnTo'));
  const notice = params.get('reason') === 'install' ? 'Sign in to download Exam Sidemann' : undefined;

  return (
    <LoginModal
      isOpen
      notice={notice}
      onClose={() => navigate(returnTo ?? '/', { replace: true })}
      onLoginSuccess={() => navigate(notice && returnTo ? returnTo : '/dashboard', { replace: true })}
    />
  );
};

export default LoginPage;
