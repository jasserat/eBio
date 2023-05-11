import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import { useSelector } from 'react-redux';
// pages
import Login from '../pages/auth/Login';
// components
import LoadingScreen from '../components/LoadingScreen';
import useAuthContext from '../contexts/useAuthContext';
import { UserApi } from '../actions/userAction';
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { user } = useAuthContext();
  // console.log(user);
  const { currentUser } = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /*  if (!isInitialized) {
    return <LoadingScreen />;
  } */

  if (localStorage.getItem('token')) {
    console.log('refresh Token');
    UserApi.getUserById(localStorage.getItem('token').replace(/^"|"$/g, ''))
      .then((r) => {
        setIsLoading(true);
        if (!r) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoading(false);
      });
  } else {
    return <Login />;
  }

  if (!currentUser && isLoading) {
    return <LoadingScreen />;
  }
  /*
  if (currentUser && !isLoading) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(PATH_DASHBOARD.general.app);
    }
  } */

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    // return <Navigate to={requestedLocation} />;
    return <Navigate to={PATH_DASHBOARD.general.app} />;
  }

  return <>{children}</>;
}
