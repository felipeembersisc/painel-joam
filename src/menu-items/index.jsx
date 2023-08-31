// Menus
import { menuDashboard } from './MenuDashboard';

// Hooks
import useAuth from '../hooks/useAuth';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
    const { user } = useAuth();

    let menu = null;

    if (user.uid) {
        menu = menuDashboard
    }

    return { items: menu };
};

export default menuItems;
