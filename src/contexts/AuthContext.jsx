import PropTypes from 'prop-types';
import { createContext } from 'react';

// project imports
import Loader from '@/ui-component/Loader';
import { useSelector } from '../store';
import * as functionsAuth from '../store/slices/auth';

// ==============================|| AUTH CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const auth = useSelector(state => state.auth);

   return <AuthContext.Provider value={{ ...auth, ...functionsAuth }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export default AuthContext;