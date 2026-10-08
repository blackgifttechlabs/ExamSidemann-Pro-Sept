import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user, loading } = useAuth();

  // A signed-in visitor must never be left on /login (e.g. after a Google
  // redirect whose result was already consumed). The modal's own success
  // animation navigates after 2s, so this only acts when that did not happen.
  useEffect(() => {
    if (loading || !user) return;
    const timer = window.setTimeout(() => {
      let destination = notice && returnTo ? returnTo : '/dashboard';
      try {
        const saved = window.sessionStorage?.getItem('auth_return_to');
        if (saved && saved.startsWith('/') && !saved.startsWith('//') && !saved.startsWith('/login')) {
          window.sessionStorage.removeItem('auth_return_to');
          destination = saved;
        }
      } catch { /* Session storage optional */ }
      navigate(destination, { replace: true });
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [user, loading, navigate, notice, returnTo]);

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
