import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props): React.ReactElement => {
  return isAuthenticated() ? children as React.ReactElement : <Navigate to="/" />;
};

export default PrivateRoute;
