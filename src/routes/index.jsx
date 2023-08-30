import { useRoutes, Navigate } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import { RotasAdm } from './RotasAdm';
import { RotasInventario } from './RotasInventario';
import { RotasDashboard } from './RotasDashboard';
import { RotasFinanceiro } from './RotasFinanceiro';
import { RotasTi } from './RotasTi';

// Reducer
import useAuth from '../hooks/useAuth';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const { user, isLoggedIn, isCodeVerification } = useAuth();

    if (!isLoggedIn || !isCodeVerification || !user) {
        return useRoutes([{ path: '*', element: <Navigate to="/login" /> }, AuthenticationRoutes]);
    } else {
        switch(user.usu_grupo_id){
            case 1:
                return useRoutes([{ path: '*', element: <Navigate to="/ti/inventario/dashboard" /> }, RotasAdm]);
            case 2:
            case 6:
                return useRoutes([{ path: '*', element: <Navigate to="/ti/inventario/dashboard" /> }, RotasDashboard]);
            case 3:
                return useRoutes([{ path: '*', element: <Navigate to="/ti/inventario/dashboard" /> }, RotasInventario]);
            case 4:
                return useRoutes([{ path: '*', element: <Navigate to="/financeiro/movimento-financeiro" /> }, RotasFinanceiro]);
            case 5:
                return useRoutes([{ path: '*', element: <Navigate to="/ti/inventario/dashboard" /> }, RotasTi]);
            default:
            break;
        }
    }
}
