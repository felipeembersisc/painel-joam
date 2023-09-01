// Menus
import { menu } from './Menu';

// Hooks
import useAuth from '../hooks/useAuth';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
    const { user } = useAuth();

    if (user.uid) {
        return { items: menu };
    } else {
        return { items: [] };
    }
};

export default menuItems;
