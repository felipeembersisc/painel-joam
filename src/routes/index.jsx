import { useRoutes, Navigate } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import { RotasDashboard } from './RotasDashboard';

// Reducer
import useAuth from '../hooks/useAuth';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { user, isLoggedIn } = useAuth();

    if (!isLoggedIn || !user) {
        return useRoutes([{ path: '*', element: <Navigate to="/login" /> }, AuthenticationRoutes]);
    } else {
        return useRoutes([{ path: '*', element: <Navigate to="/dashboard" /> }, RotasDashboard]);
    }
}
