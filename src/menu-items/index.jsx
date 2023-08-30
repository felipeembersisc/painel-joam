// Menus
import { menuAdm } from './MenuAdm';
import { menuInventario } from './MenuInventario';
import { menuDashboard } from './MenuDashboard';
import { menuTi } from './MenuTi';
import { menuFinanceiro } from './MenuFinanceiro';

// Hooks
import useAuth from '../hooks/useAuth';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
    const { user } = useAuth();

    let menu = null;

    switch(user.usu_grupo_id){
        case 1:
            menu = menuAdm;
        break;
        case 2:
        case 6:
            menu = menuDashboard;
        break;
        case 3:
            menu = menuInventario;
        break;
        case 4:
            menu = menuFinanceiro;
        break;
        case 5:
            menu = menuTi;
        break;
        default:
        break;
    }

    return { items: menu };
};

export default menuItems;
