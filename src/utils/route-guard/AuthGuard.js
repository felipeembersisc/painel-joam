import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from '@/hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
   const { isLoggedIn, user, verificarStatusToken } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!isLoggedIn) {
         navigate('login', { replace: true });
      }
   
      if(isLoggedIn && user.token){
         verificarStatusToken(user.token);
      }
   }, [isLoggedIn, navigate]);

   return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
