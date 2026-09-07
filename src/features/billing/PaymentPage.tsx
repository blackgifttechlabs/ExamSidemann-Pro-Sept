import React from 'react';
import { Navigate } from 'react-router-dom';

/** Payments are not live. Keep old bookmarks away from any simulated checkout. */
export const PaymentPage: React.FC = () => <Navigate to="/premium/" replace />;
