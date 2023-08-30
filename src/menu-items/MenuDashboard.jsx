// assets
import { IconBox, IconBrandWindows } from '@tabler/icons';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const menuDashboard = [
   {
       id: 'ti',
       title: 'TI',
       icon: IconBrandWindows,
       type: 'group',
       children: [
         {
            id: 'inventario',
            title: 'Inventário',
            type: 'collapse',
            icon: IconBox,
            children: [
               {
                  id: 'dashboardAtivos',
                  title: 'Dashboard',
                  type: 'item',
                  url: '/ti/inventario/dashboard'
               }
            ]
         }
     ]
   }
]
